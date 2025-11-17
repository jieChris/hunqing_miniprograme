const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const axios = require('axios')

class WechatPayService {
  constructor(options = {}) {
    this.config = options
    this.mock = options.mock || !options.mchId || !options.appId
    this.privateKey = null
    this.platformCertificate = null

    if (!this.mock) {
      if (options.privateKeyPath && fs.existsSync(path.resolve(options.privateKeyPath))) {
        this.privateKey = fs.readFileSync(path.resolve(options.privateKeyPath), 'utf8')
      }
      if (options.platformCertPath && fs.existsSync(path.resolve(options.platformCertPath))) {
        const platformCertContent = fs.readFileSync(path.resolve(options.platformCertPath), 'utf8')
        this.platformCertificate = new crypto.X509Certificate(platformCertContent)
      }
    }
  }

  generateClientPayParams(prepayId) {
    const timestamp = `${Math.floor(Date.now() / 1000)}`
    const nonceStr = crypto.randomBytes(16).toString('hex')
    const pkg = `prepay_id=${prepayId}`
    if (this.mock || !this.privateKey) {
      const paySign = crypto
        .createHash('sha256')
        .update(`${this.config.appId}|${timestamp}|${nonceStr}|${pkg}`)
        .digest('hex')
      return {
        timeStamp: timestamp,
        nonceStr,
        package: pkg,
        signType: 'RSA',
        paySign,
        appId: this.config.appId
      }
    }

    const signString = `${this.config.appId}\n${timestamp}\n${nonceStr}\n${pkg}\n`
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(signString)
    const paySign = sign.sign(this.privateKey, 'base64')
    return {
      timeStamp: timestamp,
      nonceStr,
      package: pkg,
      signType: 'RSA',
      paySign,
      appId: this.config.appId
    }
  }

  async createOrderPayment(order, notifyUrl) {
    const description = order.title || 'GoBuy订单'
    const amountTotal = Number(order.amountTotal)

    if (this.mock || !this.privateKey) {
      const prepayId = `mock_prepay_${order.id}`
      return {
        prepayId,
        paymentParams: this.generateClientPayParams(prepayId)
      }
    }

    const payload = {
      appid: this.config.appId,
      mchid: this.config.mchId,
      description,
      out_trade_no: order.id,
      notify_url: notifyUrl,
      amount: {
        total: amountTotal,
        currency: 'CNY'
      },
      payer: {
        openid: order.openId
      }
    }

    const response = await this.callWechatPay('/v3/pay/transactions/jsapi', payload)
    const prepayId = response.prepay_id
    return {
      prepayId,
      paymentParams: this.generateClientPayParams(prepayId)
    }
  }

  verifySignature(headers, body) {
    if (this.mock || !this.platformCertificate) {
      return true
    }

    const timestamp = headers['wechatpay-timestamp']
    const nonce = headers['wechatpay-nonce']
    const signature = headers['wechatpay-signature']

    if (!timestamp || !nonce || !signature) {
      throw new Error('缺少微信支付签名头')
    }

    const message = `${timestamp}\n${nonce}\n${body}\n`
    const verifier = crypto.createVerify('RSA-SHA256')
    verifier.update(message)
    const verified = verifier.verify(this.platformCertificate.publicKey, signature, 'base64')
    if (!verified) {
      throw new Error('微信支付签名验证失败')
    }
    return true
  }

  decryptResource(resource) {
    if (this.mock) {
      return resource
    }

    const { associated_data: associatedData, nonce, ciphertext } = resource
    if (!this.config.apiV3Key) {
      throw new Error('未配置API V3密钥')
    }

    const key = Buffer.from(this.config.apiV3Key, 'utf8')
    const buffer = Buffer.from(ciphertext, 'base64')
    const authTag = buffer.subarray(buffer.length - 16)
    const data = buffer.subarray(0, buffer.length - 16)
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(nonce, 'utf8'))
    decipher.setAuthTag(authTag)
    if (associatedData) {
      decipher.setAAD(Buffer.from(associatedData, 'utf8'))
    }
    const decoded = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
    return JSON.parse(decoded)
  }

  async parseNotification(req) {
    const body = req.rawBody?.toString('utf8') || JSON.stringify(req.body || {})
    if (this.mock) {
      return req.body || {}
    }

    this.verifySignature(req.headers, body)
    const parsed = JSON.parse(body)
    return this.decryptResource(parsed.resource)
  }

  async refund(order, amount, reason = '用户发起退款') {
    const refundAmount = amount || order.amountTotal
    if (this.mock || !this.privateKey) {
      return {
        refund_id: `mock_refund_${order.id}`,
        status: 'SUCCESS',
        refund: {
          amount: refundAmount,
          reason
        }
      }
    }

    const payload = {
      out_trade_no: order.id,
      out_refund_no: `refund_${order.id}_${Date.now()}`,
      reason,
      amount: {
        refund: refundAmount,
        total: order.amountTotal,
        currency: 'CNY'
      }
    }

    const response = await this.callWechatPay('/v3/refund/domestic/refunds', payload)
    return response
  }

  buildAuthorization(method, urlPath, body = '') {
    if (!this.privateKey) {
      throw new Error('未配置商户私钥，无法请求微信支付接口')
    }
    const timestamp = Math.floor(Date.now() / 1000)
    const nonceStr = crypto.randomBytes(16).toString('hex')
    const message = `${method}\n${urlPath}\n${timestamp}\n${nonceStr}\n${body}\n`
    const signer = crypto.createSign('RSA-SHA256')
    signer.update(message)
    const signature = signer.sign(this.privateKey, 'base64')
    return {
      token: `WECHATPAY2-SHA256-RSA2048 mchid="${this.config.mchId}",serial_no="${this.config.serialNo}",nonce_str="${nonceStr}",timestamp="${timestamp}",signature="${signature}"`,
      timestamp,
      nonceStr
    }
  }

  async callWechatPay(pathname, payload) {
    const body = JSON.stringify(payload)
    const { token } = this.buildAuthorization('POST', pathname, body)
    const { data } = await axios.post(`https://api.mch.weixin.qq.com${pathname}`, payload, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      }
    })
    return data
  }
}

module.exports = WechatPayService
