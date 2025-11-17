// pages/group-detail/group-detail.js
import { api } from '../../utils/api.js'

Page({
  data: {
    groupId: '',
    group: null,
    paymentStatus: '',
    currentOrderId: ''
  },

  onLoad(options) {
    const id = options.id
    if (id) {
      this.setData({ groupId: id })
      this.loadGroupDetail()
    }
  },

  // 加载团购详情
  async loadGroupDetail() {
    try {
      wx.showLoading({ title: '加载中...' })
      const group = await api.getGroupDetail(this.data.groupId)
      
      // 格式化价格
      if (group) {
        group.priceText = (group.price / 100).toFixed(2)
        group.originalPriceText = (group.originalPrice / 100).toFixed(2)
        group.discountText = ((group.originalPrice - group.price) / 100).toFixed(2)
      }
      
      this.setData({ group })
      wx.hideLoading()
    } catch (error) {
      wx.hideLoading()
      console.error('加载团购详情失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 立即抢购 - gobuy函数
  async gobuy() {
    const group = this.data.group
    if (!group) {
      wx.showToast({
        title: '数据加载中',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({ title: '下单中...' })
      const loginRes = await wx.login()
      if (!loginRes.code) {
        throw new Error('微信登录失败，请稍后再试')
      }

      const userProfile = wx.getStorageSync('USER_PROFILE') || {}
      const orderPayload = {
        groupId: group.id,
        productId: group.id,
        title: group.title,
        quantity: 1,
        amount: group.price,
        loginCode: loginRes.code,
        userInfo: userProfile
      }
      const orderResult = await api.createOrder(orderPayload)
      wx.hideLoading()
      this.setData({ currentOrderId: orderResult.orderId })
      await this.requestPayment(orderResult.paymentParams)
      wx.showToast({ title: '支付完成', icon: 'success' })
      const paidOrder = await this.pollOrderStatus(orderResult.orderId)
      this.setData({ paymentStatus: paidOrder?.status || 'paid' })
    } catch (error) {
      wx.hideLoading()
      console.error('下单失败', error)
      wx.showToast({
        title: error?.errMsg || error?.message || '支付失败',
        icon: 'none'
      })
    }
  },

  requestPayment(paymentParams) {
    if (!paymentParams) {
      return Promise.reject(new Error('缺少支付参数'))
    }
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        ...paymentParams,
        success: resolve,
        fail: (error) => {
          if (error.errMsg && error.errMsg.includes('cancel')) {
            wx.showToast({ title: '支付已取消', icon: 'none' })
          }
          reject(error)
        }
      })
    })
  },

  async pollOrderStatus(orderId, maxRetry = 5) {
    for (let i = 0; i < maxRetry; i++) {
      await this.delay(1500)
      const orderDetail = await api.getOrderDetail(orderId)
      if (orderDetail.status === 'paid') {
        return orderDetail
      }
      if (['payment_failed', 'refunded'].includes(orderDetail.status)) {
        throw new Error('支付未完成，请重新尝试')
      }
    }
    throw new Error('支付结果未确认，可稍后在订单列表查看')
  },

  delay(timeout = 1000) {
    return new Promise((resolve) => setTimeout(resolve, timeout))
  },

  // 查看适用商户
  viewStore(e) {
    const { store } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/store-detail/store-detail?id=${store.id}`
    })
  }
})

