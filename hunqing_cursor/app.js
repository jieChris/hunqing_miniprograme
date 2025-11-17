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

  restoreSession() {
    const token = wx.getStorageSync('token')
    const refreshToken = wx.getStorageSync('refreshToken')
    const user = wx.getStorageSync('user')
    if (token) {
      this.globalData.token = token
    }
    if (refreshToken) {
      this.globalData.refreshToken = refreshToken
    }
    if (user) {
      this.globalData.user = user
    }
  },

  persistSession(payload) {
    if (!payload) return
    const { accessToken, refreshToken, user } = payload
    if (accessToken) {
      this.globalData.token = accessToken
      wx.setStorageSync('token', accessToken)
    }
    if (refreshToken) {
      this.globalData.refreshToken = refreshToken
      wx.setStorageSync('refreshToken', refreshToken)
    }
    if (user) {
      this.globalData.user = user
      wx.setStorageSync('user', user)
    }
  },

  loginWithWeChat(force = false) {
    if (this.loginPromise && !force) {
      return this.loginPromise
    }
    this.loginPromise = new Promise((resolve, reject) => {
      wx.login({
        timeout: 30000,
        success: ({ code }) => {
          if (!code) {
            reject(new Error('无法获取登录凭证'))
            return
          }
          wx.request({
            url: `${this.globalData.baseUrl}/auth/login`,
            method: 'POST',
            data: { code },
            success: (res) => {
              if (res.statusCode === 200) {
                this.persistSession(res.data)
                resolve(res.data)
              } else {
                reject(res.data)
              }
            },
            fail: reject
          })
        },
        fail: reject
      })
    }).finally(() => {
      this.loginPromise = null
    })
    return this.loginPromise
  },

  refreshToken() {
    const refreshToken = this.globalData.refreshToken || wx.getStorageSync('refreshToken')
    if (!refreshToken) {
      return Promise.reject(new Error('缺少刷新凭证'))
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.baseUrl}/auth/refresh`,
        method: 'POST',
        data: { refreshToken },
        success: (res) => {
          if (res.statusCode === 200) {
            this.persistSession(res.data)
            resolve(res.data)
          } else {
            this.clearSession()
            reject(res.data)
          }
        },
        fail: reject
      })
    })
  },

  logout() {
    const refreshToken = this.globalData.refreshToken || wx.getStorageSync('refreshToken')
    return new Promise((resolve) => {
      if (!refreshToken) {
        this.clearSession()
        resolve()
        return
      }
      wx.request({
        url: `${this.globalData.baseUrl}/auth/logout`,
        method: 'POST',
        data: { refreshToken },
        complete: () => {
          this.clearSession()
          resolve()
        }
      })
    })
  },

  clearSession() {
    this.globalData.token = null
    this.globalData.refreshToken = null
    this.globalData.user = null
    wx.removeStorageSync('token')
    wx.removeStorageSync('refreshToken')
    wx.removeStorageSync('user')
  }
})
