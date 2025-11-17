// app.js
App({
  globalData: {
    userInfo: null,
    baseUrl: 'http://localhost:4000/api',
    cosUrl: 'https://59-1302292078.cos.ap-nanjing.myqcloud.com'
  },

  onLaunch() {
    console.log('小程序启动，当前 API 地址：', this.globalData.baseUrl)
  },

  onShow() {},

  onHide() {}
})
