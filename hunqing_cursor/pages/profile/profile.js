const { request } = require('../../utils/request')

Page({
  data: {
    user: null,
    roleText: '',
    loading: false
  },

  onShow() {
    const app = getApp()
    if (app.globalData.user) {
      this.updateUser(app.globalData.user)
    }
    this.fetchProfile()
  },

  updateUser(user) {
    if (!user) return
    this.setData({
      user,
      roleText: this.getRoleText(user.role)
    })
  },

  getRoleText(role) {
    switch (role) {
      case 'admin':
        return '平台管理员'
      case 'merchant':
        return '商家'
      default:
        return '普通用户'
    }
  },

  async fetchProfile() {
    const app = getApp()
    if (!app.globalData.token) {
      return
    }
    this.setData({ loading: true })
    try {
      const res = await request({ url: '/users/me' })
      if (res?.user) {
        app.persistSession({ user: res.user })
        this.updateUser(res.user)
      }
    } catch (error) {
      console.log('fetch profile failed', error)
    } finally {
      this.setData({ loading: false })
    }
  },

  handleLogin() {
    const app = getApp()
    app
      .loginWithWeChat(true)
      .then((res) => {
        if (res?.user) {
          this.updateUser(res.user)
        }
      })
      .catch(() => {
        wx.showToast({ title: '登录失败', icon: 'none' })
      })
  },

  handleLogout() {
    const app = getApp()
    app.logout().then(() => {
      this.setData({ user: null, roleText: '' })
    })
  },

  handleMerchant() {
    if (!this.data.user) return
    wx.navigateTo({ url: '/pages/merchant-dashboard/merchant-dashboard' })
  },

  handleAdmin() {
    if (!this.data.user) return
    wx.navigateTo({ url: '/pages/admin-dashboard/admin-dashboard' })
  }
})
