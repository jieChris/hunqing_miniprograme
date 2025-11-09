// pages/store-list/store-list.js
import { api } from '../../utils/api.js'
import { SORT_TYPES, SORT_NAMES } from '../../utils/constant.js'
import { calculateDistance } from '../../utils/util.js'

Page({
  data: {
    category: '',              // 当前分类
    stores: [],                // 商户列表
    sortType: SORT_TYPES.DISTANCE,  // 排序方式
    sortOptions: [
      { value: SORT_TYPES.DISTANCE, label: SORT_NAMES[SORT_TYPES.DISTANCE] },
      { value: SORT_TYPES.POPULARITY, label: SORT_NAMES[SORT_TYPES.POPULARITY] },
      { value: SORT_TYPES.CATEGORY_COUNT, label: SORT_NAMES[SORT_TYPES.CATEGORY_COUNT] }
    ],
    userLocation: null         // 用户位置
  },

  onLoad(options) {
    const category = options.category || ''
    this.setData({ category })
    this.getUserLocation()
    this.loadStores()
  },

  // 获取用户位置
  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          userLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        this.loadStores()
      },
      fail: () => {
        console.log('获取位置失败')
      }
    })
  },

  // 加载商户列表
  async loadStores() {
    try {
      wx.showLoading({ title: '加载中...' })
      const stores = await api.getStoreList({
        category: this.data.category,
        sort: this.data.sortType
      })
      
      // 计算距离
      if (this.data.userLocation) {
        stores.forEach(store => {
          if (store.latitude && store.longitude) {
            store.distanceText = calculateDistance(
              this.data.userLocation.latitude,
              this.data.userLocation.longitude,
              store.latitude,
              store.longitude
            )
          } else {
            store.distanceText = store.distance + 'km'
          }
        })
      } else {
        stores.forEach(store => {
          store.distanceText = store.distance + 'km'
        })
      }

      this.setData({ stores })
      wx.hideLoading()
    } catch (error) {
      wx.hideLoading()
      console.error('加载商户列表失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 排序选择 - storelick函数（这里用于跳转到商户详情）
  storelick(e) {
    const { store } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/store-detail/store-detail?id=${store.id}`
    })
  },

  // 排序切换
  onSortChange(e) {
    const sortType = e.currentTarget.dataset.sort
    this.setData({ sortType })
    this.loadStores()
  }
})

