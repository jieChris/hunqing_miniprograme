const axios = require('axios')

class MiniProgramService {
  constructor(config) {
    this.appId = config.appId
    this.appSecret = config.appSecret
    this.mock = config.mock
  }

  async getOpenId(loginCode) {
    if (!loginCode) {
      return null
    }
    if (this.mock || !this.appSecret) {
      return `mock_openid_${loginCode.slice(-6)}`
    }

    const { data } = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: this.appId,
        secret: this.appSecret,
        js_code: loginCode,
        grant_type: 'authorization_code'
      }
    })
    if (data.errcode) {
      throw new Error(data.errmsg || '获取OpenId失败')
    }
    return data.openid
  }
}

module.exports = MiniProgramService
