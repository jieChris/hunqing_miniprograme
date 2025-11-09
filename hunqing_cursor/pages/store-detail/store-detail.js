// pages/store-detail/store-detail.js
import { api } from '../../utils/api.js'
import { calculateDistance } from '../../utils/util.js'

Page({
  data: {
    storeId: '',
    store: null,              // 商户详情
    comments: [],              // 评论列表
    products: []               // 商户商品列表
  },

  onLoad(options) {
    const id = options.id
    if (id) {
      this.setData({ storeId: id })
      this.loadStoreDetail()
      this.loadComments()
      this.loadProducts()
    }
  },

  // 加载商户详情
  async loadStoreDetail() {
    try {
      wx.showLoading({ title: '加载中...' })
      const store = await api.getStoreDetail(this.data.storeId)
      
      // 计算距离（如果有用户位置）
      if (store.latitude && store.longitude) {
        wx.getLocation({
          type: 'gcj02',
          success: (res) => {
            store.distanceText = calculateDistance(
              res.latitude,
              res.longitude,
              store.latitude,
              store.longitude
            )
            this.setData({ store })
            wx.hideLoading()
          },
          fail: () => {
            store.distanceText = store.distance + 'km'
            this.setData({ store })
            wx.hideLoading()
          }
        })
      } else {
        store.distanceText = store.distance + 'km'
        this.setData({ store })
        wx.hideLoading()
      }
    } catch (error) {
      wx.hideLoading()
      console.error('加载商户详情失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 加载评论
  async loadComments() {
    try {
      const comments = await api.getStoreComments(this.data.storeId)
      this.setData({ comments })
    } catch (error) {
      console.error('加载评论失败:', error)
    }
  },

  // 加载商户商品
  async loadProducts() {
    try {
      const products = await api.getStoreProducts(this.data.storeId)
      this.setData({ products })
    } catch (error) {
      console.error('加载商户商品失败:', error)
    }
  },

  // 商品点击事件 - 跳转到团购详情
  onProductTap(e) {
    const { product } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/group-detail/group-detail?id=${product.id}`
    })
  },

  // 拨打电话
  makePhoneCall() {
    const phone = this.data.store?.phone
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          wx.showToast({
            title: '拨打电话失败',
            icon: 'none'
          })
        }
      })
    }
  },

  // 查看位置
  viewLocation() {
    const store = this.data.store
    if (store.latitude && store.longitude) {
      wx.openLocation({
        latitude: store.latitude,
        longitude: store.longitude,
        name: store.name,
        address: store.address
      })
    } else {
      wx.showToast({
        title: '暂无位置信息',
        icon: 'none'
      })
    }
  }
})

