// app.js
const DEFAULT_BASE_URL = 'http://127.0.0.1:8787/api'

App({
  globalData: {
    userInfo: null,
    baseUrl: DEFAULT_BASE_URL,
    cosUrl: 'https://59-1302292078.cos.ap-nanjing.myqcloud.com'
  },

  onLaunch() {
    const storedUrl = wx.getStorageSync('BASE_API_URL')
    if (storedUrl) {
      this.globalData.baseUrl = storedUrl
    }
    console.log('小程序启动，使用接口地址：', this.globalData.baseUrl)
  },

  setBaseUrl(url) {
    if (!url) return
    this.globalData.baseUrl = url
    wx.setStorageSync('BASE_API_URL', url)
  },

  onShow() {
    // 小程序显示时的逻辑
  },

  onHide() {
    // 小程序隐藏时的逻辑
  }
})
