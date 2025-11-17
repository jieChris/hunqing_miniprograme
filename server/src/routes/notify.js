const express = require('express')
const { updateOrder, findOrderById } = require('../db')

module.exports = function createNotifyRouter(wechatPayService) {
  const router = express.Router()

  router.post('/notify', async (req, res) => {
    try {
      const notification = await wechatPayService.parseNotification(req)
      const { out_trade_no: orderId, trade_state: tradeState } = notification
      const order = findOrderById(orderId)
      if (!order) {
        return res.status(404).json({ code: 'FAIL', message: '订单不存在' })
      }

      if (tradeState === 'SUCCESS') {
        updateOrder(orderId, {
          status: 'paid',
          transactionId: notification.transaction_id,
          paidAt: notification.success_time
        })
      } else if (tradeState === 'REFUND') {
        updateOrder(orderId, { status: 'refunded' })
      } else {
        updateOrder(orderId, { status: 'payment_failed', tradeState })
      }

      return res.json({ code: 'SUCCESS', message: 'OK' })
    } catch (error) {
      console.error('[notify] 验签失败', error)
      return res.status(400).json({ code: 'FAIL', message: error.message })
    }
  })

  return router
}
