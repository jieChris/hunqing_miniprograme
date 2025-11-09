// app.js
App({
  globalData: {
    userInfo: null,
    baseUrl: 'https://your-api-domain.com/api', // 替换为实际API地址
    cosUrl: 'https://59-1302292078.cos.ap-nanjing.myqcloud.com' // 腾讯云COS地址
  },

  onLaunch() {
    // 小程序启动时的逻辑
    console.log('小程序启动')
  },

  onShow() {
    // 小程序显示时的逻辑
  },

  onHide() {
    // 小程序隐藏时的逻辑
  }
})
