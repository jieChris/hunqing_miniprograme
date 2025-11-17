const { request } = require('../../utils/request')

Page({
  data: {
    stats: null,
    suggestions: [],
    storeName: '',
    loading: false
  },

  onLoad() {
    this.fetchOverview()
  },

  async fetchOverview() {
    this.setData({ loading: true })
    try {
      const res = await request({ url: '/merchant/overview' })
      this.setData({
        stats: res.stats,
        suggestions: res.suggestions || [],
        storeName: res.storeName || ''
      })
    } catch (error) {
      console.log('merchant overview failed', error)
    } finally {
      this.setData({ loading: false })
    }
  }
})
