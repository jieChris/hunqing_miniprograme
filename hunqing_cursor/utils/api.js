import { request } from './request.js'
import { getImageUrl } from './util.js'

const fallbackData = {
  categories: [
    { id: 'wedding_plan', name: '婚礼策划', icon: '/images/category/wedding-plan.png' },
    { id: 'photography', name: '婚纱摄影', icon: '/images/category/photography.png' },
    { id: 'hotel', name: '婚宴酒店', icon: '/images/category/hotel.png' },
    { id: 'car', name: '婚礼用车', icon: '/images/category/car.png' },
    { id: 'supplies', name: '婚礼用品', icon: '/images/category/supplies.png' }
  ],
  banners: [
    { id: 1, image: getImageUrl('/images/banner/banner1.jpg'), link: '' },
    { id: 2, image: getImageUrl('/images/banner/banner2.jpg'), link: '' },
    { id: 3, image: getImageUrl('/images/banner/banner3.jpg'), link: '' }
  ],
  recommendations: [
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
    }
  ],
  stores: [
    {
      id: 1,
      name: '浪漫婚礼体验店',
      category: 'wedding_plan',
      image: getImageUrl('/images/stores/ch/001.png'),
      rating: 4.8,
      distance: 1.2,
      popularity: 1234,
      categoryCount: 15,
      address: '北京市朝阳区幸福路 88 号'
    },
    {
      id: 2,
      name: '星河自助婚宴',
      category: 'hotel',
      image: getImageUrl('/images/stores/jd/001.png'),
      rating: 4.9,
      distance: 3.4,
      popularity: 2010,
      categoryCount: 25,
      address: '北京市东城区国贸大厦 18F'
    }
  ],
  productsByStore: {
    1: [
      {
        id: 1,
        name: '浪漫婚礼套餐',
        price: 19900,
        originalPrice: 29900,
        image: getImageUrl('/images/products/product-001.jpg'),
        sales: 1234,
        rating: 4.8
      }
    ],
    2: [
      {
        id: 3,
        name: '星河自助婚宴桌',
        price: 3999,
        originalPrice: 4999,
        image: getImageUrl('/images/products/product-003.jpg'),
        sales: 1530,
        rating: 4.9
      }
    ]
  },
  commentsByStore: {
    1: [
      {
        id: 'comment-1',
        userName: '米其林星',
        avatar: getImageUrl('/images/avatar/avatar-1.png'),
        rating: 5,
        comment: '策划老师非常专业，婚礼现场效果令人惊喜！',
        createdAt: new Date().toISOString()
      }
    ],
    2: [
      {
        id: 'comment-2',
        userName: '甜心',
        avatar: getImageUrl('/images/avatar/avatar-2.png'),
        rating: 4.8,
        comment: '菜品丰富，家人非常满意。',
        createdAt: new Date().toISOString()
      }
    ]
  },
  groupBuys: {
    1: {
      id: 1,
      title: '双十二婚礼团购',
      status: 'ongoing',
      minParticipants: 3,
      currentParticipants: 2,
      price: 17900,
      product: {
        id: 1,
        name: '浪漫婚礼套餐',
        price: 19900,
        image: getImageUrl('/images/products/product-001.jpg')
      }
    }
  }
}

function withFallback(requestTask, fallback) {
  return requestTask().catch(() => fallback)
}

export const api = {
  getCategories() {
    return withFallback(() => request({ url: '/user/categories' }), fallbackData.categories)
  },
  getBanners() {
    return withFallback(() => request({ url: '/user/banners' }), fallbackData.banners)
  },
  getRecommendProducts() {
    return withFallback(() => request({ url: '/user/recommendations' }), fallbackData.recommendations)
  },
  getStoreList(params = {}) {
    return withFallback(
      () => request({ url: '/user/stores', data: params }),
      fallbackData.stores.filter((store) => !params.category || store.category === params.category)
    )
  },
  getStoreDetail(storeId) {
    return withFallback(
      () => request({ url: `/user/stores/${storeId}` }),
      fallbackData.stores.find((store) => store.id === Number(storeId))
    )
  },
  getStoreComments(storeId) {
    return withFallback(
      () => request({ url: `/user/stores/${storeId}/comments` }),
      fallbackData.commentsByStore[storeId] || []
    )
  },
  getStoreProducts(storeId) {
    return withFallback(
      () => request({ url: `/user/stores/${storeId}/products` }),
      fallbackData.productsByStore[storeId] || []
    )
  },
  getGroupDetail(groupId) {
    return withFallback(
      () => request({ url: `/user/group-buys/${groupId}` }),
      fallbackData.groupBuys[groupId]
    )
  },
  createOrder(data) {
    return request({ url: '/user/orders', method: 'POST', data })
  },
  joinGroupBuy(groupId, data) {
    return request({ url: `/user/group-buys/${groupId}/join`, method: 'POST', data })
  }
}
