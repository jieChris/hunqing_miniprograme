// pages/index/index.js
import { api } from '../../utils/api.js'

Page({
  data: {
    categories: [],           // 分类列表
    banners: [],               // Banner列表
    recommendProducts: []      // 推荐商品
  },

  onLoad() {
    this.loadData()
  },

  // 加载数据
  async loadData() {
    try {
      const [categories, banners, recommendProducts] = await Promise.all([
        api.getCategories(),
        api.getBanners(),
        api.getRecommendProducts()
      ])

      this.setData({
        categories,
        banners,
        recommendProducts
      })
    } catch (error) {
      console.error('加载数据失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 分类按钮点击事件 - fucClick函数
  fucClick(e) {
    const { category } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/store-list/store-list?category=${category.id}`
    })
  },

  // 商品套餐点击事件 - goodDetail函数
  goodDetail(e) {
    const { product } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/group-detail/group-detail?id=${product.id}`
    })
  },

  // Banner点击事件
  onBannerTap(e) {
    const { index } = e.detail
    const banner = this.data.banners[index]
    if (banner.link) {
      // 处理Banner跳转逻辑
    }
  }
})
