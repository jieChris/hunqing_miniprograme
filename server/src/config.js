const path = require('path')

const seconds = (value, defaultValue) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? defaultValue : parsed
}

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'hunqing-secret',
  accessTokenTTL: seconds(process.env.ACCESS_TOKEN_TTL, 60 * 60),
  refreshTokenTTL: seconds(process.env.REFRESH_TOKEN_TTL, 60 * 60 * 24 * 7),
  wechat: {
    appId: process.env.WECHAT_APPID,
    secret: process.env.WECHAT_SECRET
  },
  dataPaths: {
    users: path.join(__dirname, '..', 'data', 'users.json')
  }
}
