const express = require('express')
const { nanoid } = require('nanoid')
const { db, write, findOrderById, updateOrder } = require('../db')
const config = require('../config')

module.exports = function createOrderRouter({ wechatPayService, miniProgramService }) {
  const router = express.Router()

  router.post('/', async (req, res, next) => {
    try {
      const { groupId, productId, quantity = 1, userInfo = {}, loginCode, amount } = req.body
      if (!groupId || !productId) {
        return res.status(400).json({ message: '缺少团购或商品信息' })
      }
      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({ message: '金额不合法' })
      }

      const orderId = nanoid(24)
      const amountTotal = Number(amount) || 0
      const openId = await miniProgramService.getOpenId(loginCode)

      const order = {
        id: orderId,
        groupId,
        productId,
        quantity,
        status: 'pending_payment',
        amountTotal,
        title: req.body.title || 'GoBuy 团购订单',
        userInfo,
        loginCode,
        openId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      db.data.orders.push(order)
      write()

      const payment = await wechatPayService.createOrderPayment(
        { ...order, openId },
        config.notifyUrl
      )

      updateOrder(orderId, {
        prepayId: payment.prepayId,
        paymentParams: payment.paymentParams
      })

      return res.json({
        orderId,
        status: 'pending_payment',
        prepayId: payment.prepayId,
        paymentParams: payment.paymentParams
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/:orderId', (req, res) => {
    const order = findOrderById(req.params.orderId)
    if (!order) {
      return res.status(404).json({ message: '订单不存在' })
    }
    return res.json(order)
  })

  router.post('/:orderId/refund', async (req, res, next) => {
    try {
      const order = findOrderById(req.params.orderId)
      if (!order) {
        return res.status(404).json({ message: '订单不存在' })
      }

      const refund = await wechatPayService.refund(order, req.body.amount, req.body.reason)
      updateOrder(order.id, { status: 'refunding', refund })
      return res.json({ message: '退款处理中', refund })
    } catch (error) {
      next(error)
    }
  })

  return router
}
