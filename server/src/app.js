require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const { db } = require('./db')
const WechatPayService = require('./services/wechat-pay')
const createOrderRouter = require('./routes/orders')
const createNotifyRouter = require('./routes/notify')
const MiniProgramService = require('./services/mini-program')

const app = express()
const wechatPayService = new WechatPayService(config.wechat)
const miniProgramService = new MiniProgramService(config.wechat)

app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))

app.get('/healthz', (req, res) => {
  res.json({
    status: 'ok',
    orders: db.data.orders.length,
    mockWechatPay: wechatPayService.mock
  })
})

app.use('/api/orders', createOrderRouter({ wechatPayService, miniProgramService }))
app.use('/api/wechatpay', createNotifyRouter(wechatPayService))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: err.message || '服务器内部错误' })
})

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`)
})
