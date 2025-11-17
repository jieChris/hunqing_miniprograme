const https = require('https')
const config = require('../config')

const getJson = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (error) {
            reject(error)
          }
        })
      })
      .on('error', (err) => reject(err))
  })

const exchangeCodeForSession = async (code) => {
  if (!code) {
    throw new Error('Missing login code')
  }
  if (!config.wechat.appId || !config.wechat.secret) {
    return {
      openid: `mock_${code}`,
      session_key: Math.random().toString(36).slice(2, 12)
    }
  }
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.wechat.appId}&secret=${config.wechat.secret}&js_code=${code}&grant_type=authorization_code`
  const response = await getJson(url)
  if (response.errcode) {
    throw new Error(response.errmsg || 'Failed to fetch session')
  }
  return {
    openid: response.openid,
    session_key: response.session_key
  }
}

module.exports = { exchangeCodeForSession }
