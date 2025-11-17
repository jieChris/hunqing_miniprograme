const showError = (message) => {
  wx.showToast({
    title: message || '请求失败',
    icon: 'none'
  })
}

const request = (options, retry = false) => {
  const app = getApp()
  const baseUrl = app?.globalData?.baseUrl || ''
  const token = app?.globalData?.token || wx.getStorageSync('token')
  const header = {
    'Content-Type': 'application/json',
    ...options.header
  }
  if (token) {
    header.Authorization = `Bearer ${token}`
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      success: async (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
          return
        }

        if (res.statusCode === 401 && !retry && app?.refreshToken) {
          try {
            await app.refreshToken()
            const data = await request(options, true)
            resolve(data)
            return
          } catch (error) {
            app?.logout?.()
          }
        }

        showError(res.data?.message)
        reject(res)
      },
      fail: (err) => {
        showError('网络错误')
        reject(err)
      }
    })
  })
}

module.exports = {
  request
}
