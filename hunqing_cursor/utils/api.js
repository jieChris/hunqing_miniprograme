// api.js - API请求封装

const app = getApp()

// COS基础URL
const COS_BASE_URL = 'https://59-1302292078.cos.ap-nanjing.myqcloud.com'

/**
 * 获取完整的图片URL
 * @param {String} path 图片路径
 * @returns {String} 完整的COS URL
 */
function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const imagePath = path.startsWith('/') ? path : '/' + path
  return COS_BASE_URL + imagePath
}

/**
 * 请求封装
 * @param {Object} options 请求配置
 * @returns {Promise} 请求结果
 */
function request(options) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: (app.globalData.baseUrl || '') + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          wx.showToast({
            title: res.data?.message || '请求失败',
            icon: 'none'
          })
          reject(res)
        }
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// API接口
export const api = {
  // 获取分类列表
  getCategories() {
    // 模拟数据，实际应该调用真实API
    // category 文件夹中的图片使用本地引用
    return Promise.resolve([
      { id: 'wedding_plan', name: '婚礼策划', icon: '/images/category/wedding-plan.png' },
      { id: 'photography', name: '婚纱摄影', icon: '/images/category/photography.png' },
      { id: 'hotel', name: '婚宴酒店', icon: '/images/category/hotel.png' },
      { id: 'car', name: '婚礼用车', icon: '/images/category/car.png' },
      { id: 'supplies', name: '婚礼用品', icon: '/images/category/supplies.png' }
    ])
  },

  // 获取Banner列表
  getBanners() {
    // 模拟数据
    return Promise.resolve([
      { id: 1, image: getImageUrl('/images/banner/banner1.jpg'), link: '' },
      { id: 2, image: getImageUrl('/images/banner/banner2.jpg'), link: '' },
      { id: 3, image: getImageUrl('/images/banner/banner3.jpg'), link: '' }
    ])
  },

  // 获取推荐商品（猜你喜欢）
  getRecommendProducts() {
    // 模拟数据
    return Promise.resolve([
      {
        id: 1,
        title: '浪漫婚礼套餐',
        price: 19900,
        originalPrice: 29900,
        image: getImageUrl('/images/products/product-001.jpg'),
        sales: 1234,
        rating: 4.8
      },
      {
        id: 2,
        title: '豪华婚宴套餐',
        price: 39900,
        originalPrice: 49900,
        image: getImageUrl('/images/products/product-002.jpg'),
        sales: 856,
        rating: 4.9
      },
      {
        id: 3,
        title: '精致婚纱摄影',
        price: 8990,
        originalPrice: 12990,
        image: getImageUrl('/images/products/product-003.jpg'),
        sales: 2345,
        rating: 4.7
      }
    ])
  },

  // 获取商户列表
  getStoreList(params = {}) {
    // 所有商户数据，按分类组织
    const allStores = {
      // 婚礼策划分类
      // 图片素材文件夹为 ch，即“策划”，其余分类同
      wedding_plan: [
        {
          id: 1,
          name: '浪漫婚礼策划',
          category: 'wedding_plan',
          image: getImageUrl('/images/stores/ch/001.png'),
          rating: 4.8,
          distance: 1.2,
          popularity: 1234,
          categoryCount: 15,
          address: '北京市朝阳区xxx路xxx号'
        },
        {
          id: 11,
          name: '唯美婚礼工作室',
          category: 'wedding_plan',
          image: getImageUrl('/images/stores/ch/002.png'),
          rating: 4.9,
          distance: 2.1,
          popularity: 1890,
          categoryCount: 18,
          address: '北京市海淀区xxx路xxx号'
        },
        {
          id: 12,
          name: '幸福婚礼定制',
          category: 'wedding_plan',
          image: getImageUrl('/images/stores/ch/003.png'),
          rating: 4.7,
          distance: 3.5,
          popularity: 1567,
          categoryCount: 12,
          address: '北京市丰台区xxx路xxx号'
        },
        {
          id: 13,
          name: '梦幻婚礼设计',
          category: 'wedding_plan',
          image: getImageUrl('/images/stores/ch/004.png'),
          rating: 4.6,
          distance: 4.2,
          popularity: 1345,
          categoryCount: 20,
          address: '北京市石景山区xxx路xxx号'
        }
      ],
      // 婚纱摄影分类
      photography: [
        {
          id: 2,
          name: '唯美婚纱摄影',
          category: 'photography',
          image: getImageUrl('/images/stores/sy/001.png'),
          rating: 4.9,
          distance: 2.5,
          popularity: 2345,
          categoryCount: 20,
          address: '北京市海淀区xxx路xxx号'
        },
        {
          id: 21,
          name: '时光婚纱摄影',
          category: 'photography',
          image: getImageUrl('/images/stores/sy/002.png'),
          rating: 4.8,
          distance: 1.8,
          popularity: 2100,
          categoryCount: 25,
          address: '北京市朝阳区xxx路xxx号'
        },
        {
          id: 22,
          name: '浪漫婚纱影楼',
          category: 'photography',
          image: getImageUrl('/images/stores/sy/003.png'),
          rating: 4.7,
          distance: 3.2,
          popularity: 1876,
          categoryCount: 22,
          address: '北京市西城区xxx路xxx号'
        },
        {
          id: 23,
          name: '经典婚纱摄影',
          category: 'photography',
          image: getImageUrl('/images/stores/sy/004.png'),
          rating: 4.6,
          distance: 4.5,
          popularity: 1654,
          categoryCount: 18,
          address: '北京市东城区xxx路xxx号'
        }
      ],
      // 婚宴酒店分类
      hotel: [
        {
          id: 3,
          name: '豪华婚宴酒店',
          category: 'hotel',
          image: getImageUrl('/images/stores/jd/001.png'),
          rating: 4.7,
          distance: 3.8,
          popularity: 3456,
          categoryCount: 25,
          address: '北京市西城区xxx路xxx号'
        },
        {
          id: 31,
          name: '金玉满堂酒店',
          category: 'hotel',
          image: getImageUrl('/images/stores/jd/002.png'),
          rating: 4.9,
          distance: 2.3,
          popularity: 4123,
          categoryCount: 30,
          address: '北京市朝阳区xxx路xxx号'
        },
        {
          id: 32,
          name: '喜来登婚宴厅',
          category: 'hotel',
          image: getImageUrl('/images/stores/jd/003.png'),
          rating: 4.8,
          distance: 1.5,
          popularity: 3789,
          categoryCount: 28,
          address: '北京市海淀区xxx路xxx号'
        },
        {
          id: 33,
          name: '盛世华庭酒店',
          category: 'hotel',
          image: getImageUrl('/images/stores/jd/004.png'),
          rating: 4.6,
          distance: 4.8,
          popularity: 3124,
          categoryCount: 22,
          address: '北京市丰台区xxx路xxx号'
        },
        {
          id: 34,
          name: '皇家花园酒店',
          category: 'hotel',
          image: getImageUrl('/images/stores/jd/005.png'),
          rating: 4.5,
          distance: 5.2,
          popularity: 2890,
          categoryCount: 20,
          address: '北京市石景山区xxx路xxx号'
        }
      ],
      // 婚礼用车分类
      car: [
        {
          id: 41,
          name: '豪华婚车租赁',
          category: 'car',
          image: getImageUrl('/images/stores/yc/001.png'),
          rating: 4.8,
          distance: 1.5,
          popularity: 1234,
          categoryCount: 10,
          address: '北京市朝阳区xxx路xxx号'
        },
        {
          id: 42,
          name: '经典婚车车队',
          category: 'car',
          image: getImageUrl('/images/stores/yc/002.png'),
          rating: 4.7,
          distance: 2.8,
          popularity: 1123,
          categoryCount: 12,
          address: '北京市海淀区xxx路xxx号'
        },
        {
          id: 43,
          name: '尊贵婚车服务',
          category: 'car',
          image: getImageUrl('/images/stores/yc/003.png'),
          rating: 4.9,
          distance: 3.1,
          popularity: 1456,
          categoryCount: 15,
          address: '北京市西城区xxx路xxx号'
        },
        {
          id: 44,
          name: '浪漫婚车定制',
          category: 'car',
          image: getImageUrl('/images/stores/yc/004.png'),
          rating: 4.6,
          distance: 4.3,
          popularity: 987,
          categoryCount: 8,
          address: '北京市丰台区xxx路xxx号'
        }
      ],
      // 婚礼用品分类
      supplies: [
        {
          id: 51,
          name: '喜糖喜饼专营店',
          category: 'supplies',
          image: getImageUrl('/images/stores/yp/001.png'),
          rating: 4.7,
          distance: 1.8,
          popularity: 1567,
          categoryCount: 50,
          address: '北京市朝阳区xxx路xxx号'
        },
        {
          id: 52,
          name: '婚礼用品商城',
          category: 'supplies',
          image: getImageUrl('/images/stores/yp/002.png'),
          rating: 4.8,
          distance: 2.5,
          popularity: 1890,
          categoryCount: 60,
          address: '北京市海淀区xxx路xxx号'
        },
        {
          id: 53,
          name: '精美婚庆用品',
          category: 'supplies',
          image: getImageUrl('/images/stores/yp/003.png'),
          rating: 4.6,
          distance: 3.6,
          popularity: 1345,
          categoryCount: 45,
          address: '北京市西城区xxx路xxx号'
        },
        {
          id: 54,
          name: '一站式婚庆用品',
          category: 'supplies',
          image: getImageUrl('/images/stores/yp/004.png'),
          rating: 4.9,
          distance: 4.1,
          popularity: 2123,
          categoryCount: 70,
          address: '北京市东城区xxx路xxx号'
        },
        {
          id: 55,
          name: '传统婚庆用品店',
          category: 'supplies',
          image: getImageUrl('/images/stores/yp/005.png'),
          rating: 4.5,
          distance: 5.0,
          popularity: 1123,
          categoryCount: 40,
          address: '北京市丰台区xxx路xxx号'
        }
      ]
    }

    // 根据分类筛选商户
    let stores = []
    if (params.category && allStores[params.category]) {
      stores = [...allStores[params.category]]
    } else if (!params.category) {
      // 如果没有指定分类，返回所有商户
      stores = Object.values(allStores).flat()
    }

    // 排序逻辑
    if (params.sort === 'distance') {
      stores.sort((a, b) => a.distance - b.distance)
    } else if (params.sort === 'popularity') {
      stores.sort((a, b) => b.popularity - a.popularity)
    } else if (params.sort === 'category_count') {
      stores.sort((a, b) => b.categoryCount - a.categoryCount)
    }

    return Promise.resolve(stores)
  },

  // 获取商户详情
  getStoreDetail(id) {
    // 模拟数据
    return Promise.resolve({
      id: id,
      name: '浪漫婚礼策划',
      category: 'wedding_plan',
      images: [
        getImageUrl('/images/stores/ch/006.png'),
        getImageUrl('/images/stores/ch/005.png')
      ],
      rating: 4.8,
      distance: 1.2,
      address: '北京市朝阳区xxx路xxx号',
      phone: '010-12345678',
      description: '专业提供一站式婚礼策划服务，为您打造完美婚礼',
      services: [
        '婚礼策划',
        '场地布置',
        '司仪服务',
        '摄影摄像'
      ]
    })
  },

  // 获取商户评论
  getStoreComments(storeId) {
    // 模拟数据
    return Promise.resolve([
      {
        id: 1,
        userName: '张**',
        avatar: '',
        rating: 5,
        content: '服务非常专业，婚礼办得很成功！',
        date: '2024-01-15'
      },
      {
        id: 2,
        userName: '李**',
        avatar: '',
        rating: 4,
        content: '整体不错，就是价格稍微贵了点。',
        date: '2024-01-10'
      }
    ])
  },

  // 获取商户商品列表
  getStoreProducts(storeId) {
    // 模拟数据 - 根据商户ID返回不同的商品
    const productsByStore = {
      '1': [
        {
          id: 1,
          title: '浪漫婚礼套餐',
          price: 19900,
          originalPrice: 29900,
          image: getImageUrl('/images/products/product-001.jpg'),
          sales: 1234,
          rating: 4.8
        },
        {
          id: 4,
          title: '精致婚礼策划',
          price: 15900,
          originalPrice: 22900,
          image: getImageUrl('/images/products/product-001.jpg'),
          sales: 856,
          rating: 4.7
        }
      ],
      '2': [
        {
          id: 3,
          title: '精致婚纱摄影',
          price: 8990,
          originalPrice: 12990,
          image: getImageUrl('/images/products/product-003.jpg'),
          sales: 2345,
          rating: 4.7
        },
        {
          id: 5,
          title: '豪华婚纱摄影套餐',
          price: 12990,
          originalPrice: 17990,
          image: getImageUrl('/images/products/product-003.jpg'),
          sales: 1123,
          rating: 4.9
        }
      ],
      '3': [
        {
          id: 2,
          title: '豪华婚宴套餐',
          price: 39900,
          originalPrice: 49900,
          image: getImageUrl('/images/products/product-002.jpg'),
          sales: 856,
          rating: 4.9
        }
      ]
    }
    
    return Promise.resolve(productsByStore[storeId] || [])
  },

  // 获取团购详情
  getGroupDetail(id) {
    // 模拟数据
    return Promise.resolve({
      id: id,
      title: '浪漫婚礼套餐',
      price: 19900,
      originalPrice: 29900,
      image: getImageUrl('/images/products/product-001.jpg'),
      images: [
        getImageUrl('/images/products/product-001.jpg'),
        getImageUrl('/images/products/product-002.jpg')
      ],
      sales: 1234,
      rating: 4.8,
      description: '包含婚礼策划、场地布置、司仪服务等一站式服务',
      applicableStores: [
        { id: 1, name: '浪漫婚礼策划', address: '北京市朝阳区xxx路xxx号' },
        { id: 2, name: '唯美婚礼策划', address: '北京市海淀区xxx路xxx号' }
      ],
      details: '1. 婚礼策划方案设计\n2. 场地布置服务\n3. 专业司仪服务\n4. 摄影摄像服务',
      notice: '1. 有效期至2024年12月31日\n2. 需提前30天预约\n3. 不可与其他优惠叠加使用',
      comments: [
        {
          id: 1,
          userName: '王**',
          avatar: '',
          rating: 5,
          content: '套餐很划算，服务也很到位！',
          date: '2024-01-20'
        }
      ]
    })
  }
}

