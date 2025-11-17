const app = getApp()

export function request(options = {}) {
  return new Promise((resolve, reject) => {
    const baseUrl = app?.globalData?.baseUrl || ''
    wx.request({
      url: `${baseUrl}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data?.data ?? res.data)
        } else {
          reject(res.data)
        }
      },
      fail: reject
    })
  })
}
