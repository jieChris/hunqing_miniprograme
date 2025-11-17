const { request } = require('../../utils/request')

Page({
  data: {
    pendingMerchants: [],
    pendingActivities: [],
    loading: false
  },

  onLoad() {
    this.fetchReviews()
  },

  async fetchReviews() {
    this.setData({ loading: true })
    try {
      const res = await request({ url: '/admin/reviews' })
      this.setData({
        pendingMerchants: res.pendingMerchants || [],
        pendingActivities: res.pendingActivities || []
      })
    } catch (error) {
      console.log('admin reviews error', error)
    } finally {
      this.setData({ loading: false })
    }
  }
})
