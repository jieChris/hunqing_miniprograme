// pages/group-detail/group-detail.js
import { api } from '../../utils/api.js'

Page({
  data: {
    groupId: '',
    group: null              // 团购详情
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
  gobuy() {
    const group = this.data.group
    if (!group) {
      wx.showToast({
        title: '数据加载中',
        icon: 'none'
      })
      return
    }

    // 这里可以跳转到订单页面或调用支付接口
    wx.showModal({
      title: '确认购买',
      content: `确定要购买"${group.title}"吗？`,
      confirmText: '立即购买',
      confirmColor: '#E91E63',
      success: (res) => {
        if (res.confirm) {
          // 处理购买逻辑
          wx.showToast({
            title: '购买成功',
            icon: 'success'
          })
          // 实际项目中应该调用支付接口
          // wx.requestPayment({...})
        }
      }
    })
  },

  // 查看适用商户
  viewStore(e) {
    const { store } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/store-detail/store-detail?id=${store.id}`
    })
  }
})

