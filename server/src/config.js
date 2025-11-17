const path = require('path')

const config = {
  port: process.env.PORT || 8787,
  dbFile: process.env.DB_FILE ? path.resolve(process.cwd(), process.env.DB_FILE) : path.join(__dirname, '../data/db.json'),
  baseDomain: process.env.BASE_DOMAIN || 'http://localhost:8787',
  notifyUrl: process.env.WECHAT_NOTIFY_URL || `${process.env.BASE_DOMAIN || 'http://localhost:8787'}/api/wechatpay/notify`,
  wechat: {
    appId: process.env.WECHAT_APP_ID || '',
    appSecret: process.env.WECHAT_APP_SECRET || '',
    mchId: process.env.WECHAT_MCH_ID || '',
    serialNo: process.env.WECHAT_SERIAL_NO || '',
    apiV3Key: process.env.WECHAT_API_V3_KEY || '',
    privateKeyPath: process.env.WECHAT_PRIVATE_KEY_PATH || '',
    platformCertPath: process.env.WECHAT_PLATFORM_CERT_PATH || '',
    mock: process.env.MOCK_WECHATPAY !== 'false'
  }
}

module.exports = config
