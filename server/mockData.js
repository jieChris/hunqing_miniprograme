const { v4: uuid } = require('uuid')

const COS_BASE_URL = 'https://59-1302292078.cos.ap-nanjing.myqcloud.com'

const categories = [
  { id: 'wedding_plan', name: '婚礼策划' },
  { id: 'photography', name: '婚纱摄影' },
  { id: 'hotel', name: '婚宴酒店' },
  { id: 'car', name: '婚礼用车' },
  { id: 'supplies', name: '婚礼用品' }
]

const banners = [
  { id: 1, image: `${COS_BASE_URL}/images/banner/banner1.jpg`, link: '' },
  { id: 2, image: `${COS_BASE_URL}/images/banner/banner2.jpg`, link: '' },
  { id: 3, image: `${COS_BASE_URL}/images/banner/banner3.jpg`, link: '' }
]

const merchants = [
  { id: 1, name: '浪漫婚礼策划', status: 'active', contact: '020-88888888' },
  { id: 2, name: '星河婚宴酒店', status: 'active', contact: '010-66666666' }
]

const stores = [
  {
    id: 1,
    merchantId: 1,
    name: '浪漫婚礼体验店',
    category: 'wedding_plan',
    image: `${COS_BASE_URL}/images/stores/ch/001.png`,
    rating: 4.8,
    distance: 1.2,
    popularity: 1234,
    categoryCount: 15,
    address: '北京市朝阳区幸福路 88 号',
    status: 'open'
  },
  {
    id: 2,
    merchantId: 2,
    name: '星河自助婚宴',
    category: 'hotel',
    image: `${COS_BASE_URL}/images/stores/jd/001.png`,
    rating: 4.9,
    distance: 3.4,
    popularity: 2010,
    categoryCount: 25,
    address: '北京市东城区国贸大厦 18F',
    status: 'open'
  }
]

const products = [
  {
    id: 1,
    storeId: 1,
    name: '浪漫婚礼套餐',
    price: 19900,
    originalPrice: 29900,
    image: `${COS_BASE_URL}/images/products/product-001.jpg`,
    sales: 1234,
    rating: 4.8,
    inventory: 8,
    tags: ['热门', '限时优惠']
  },
  {
    id: 2,
    storeId: 1,
    name: '精致婚礼主持套餐',
    price: 6990,
    originalPrice: 8990,
    image: `${COS_BASE_URL}/images/products/product-002.jpg`,
    sales: 856,
    rating: 4.7,
    inventory: 20,
    tags: ['主持', '经典']
  },
  {
    id: 3,
    storeId: 2,
    name: '星河自助婚宴桌',
    price: 3999,
    originalPrice: 4999,
    image: `${COS_BASE_URL}/images/products/product-003.jpg`,
    sales: 1530,
    rating: 4.9,
    inventory: 50,
    tags: ['热门', '五星餐标']
  }
]

const groupBuys = [
  {
    id: 1,
    productId: 1,
    title: '双十二婚礼团购',
    status: 'ongoing',
    minParticipants: 3,
    currentParticipants: 2,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    price: 17900
  }
]

const storeComments = {
  1: [
    {
      id: uuid(),
      userName: '米其林星',
      avatar: `${COS_BASE_URL}/images/avatar/avatar-1.png`,
      rating: 5,
      comment: '策划老师非常专业，婚礼现场效果令人惊喜！',
      createdAt: new Date().toISOString()
    }
  ],
  2: [
    {
      id: uuid(),
      userName: '甜心',
      avatar: `${COS_BASE_URL}/images/avatar/avatar-2.png`,
      rating: 4.8,
      comment: '菜品丰富，家人非常满意。',
      createdAt: new Date().toISOString()
    }
  ]
}

const users = [
  { id: 1, name: '系统管理员', role: 'admin' },
  { id: 2, name: '星河商户', role: 'merchant', merchantId: 1 },
  { id: 3, name: '普通会员', role: 'user' }
]

const orders = []
const payments = []

function addOrder(order) {
  const newOrder = { id: orders.length + 1, status: 'pending', createdAt: new Date().toISOString(), ...order }
  orders.push(newOrder)
  return newOrder
}

function addPayment(payment) {
  const newPayment = { id: payments.length + 1, status: 'created', createdAt: new Date().toISOString(), ...payment }
  payments.push(newPayment)
  return newPayment
}

function addMerchant(payload) {
  const newMerchant = { id: merchants.length + 1, status: 'active', ...payload }
  merchants.push(newMerchant)
  return newMerchant
}

function addStore(payload) {
  const newStore = { id: stores.length + 1, status: 'open', ...payload }
  stores.push(newStore)
  return newStore
}

function addProduct(payload) {
  const newProduct = { id: products.length + 1, ...payload }
  products.push(newProduct)
  return newProduct
}

function updateGroupParticipants(groupId, delta) {
  const group = groupBuys.find((g) => g.id === Number(groupId))
  if (!group) return null
  group.currentParticipants += delta
  return group
}

module.exports = {
  COS_BASE_URL,
  categories,
  banners,
  merchants,
  stores,
  products,
  groupBuys,
  storeComments,
  users,
  orders,
  payments,
  addOrder,
  addPayment,
  addMerchant,
  addStore,
  addProduct,
  updateGroupParticipants
}
