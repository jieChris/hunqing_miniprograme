const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {
  categories,
  banners,
  merchants,
  stores,
  products,
  groupBuys,
  storeComments,
  addMerchant,
  addStore,
  addProduct,
  addOrder,
  addPayment,
  updateGroupParticipants
} = require('./mockData')
const { attachUser, requireRole } = require('./middleware')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const apiRouter = express.Router()
apiRouter.use(attachUser)

// ============== 用户模块 ==================
const userRouter = express.Router()

userRouter.get('/categories', (_req, res) => {
  res.json({ success: true, data: categories })
})

userRouter.get('/banners', (_req, res) => {
  res.json({ success: true, data: banners })
})

userRouter.get('/recommendations', (_req, res) => {
  const recommended = products
    .slice(0, 3)
    .map((product) => ({ ...product, store: stores.find((store) => store.id === product.storeId)?.name }))
  res.json({ success: true, data: recommended })
})

userRouter.get('/stores', (req, res) => {
  const { category, sort = 'popular' } = req.query
  let filtered = stores.filter((store) => store.status === 'open')
  if (category) {
    filtered = filtered.filter((store) => store.category === category)
  }
  if (sort === 'distance') {
    filtered = filtered.sort((a, b) => a.distance - b.distance)
  } else {
    filtered = filtered.sort((a, b) => b.popularity - a.popularity)
  }
  res.json({ success: true, data: filtered })
})

userRouter.get('/stores/:id', (req, res) => {
  const storeId = Number(req.params.id)
  const store = stores.find((item) => item.id === storeId)
  if (!store) {
    return res.status(404).json({ success: false, message: '门店不存在' })
  }
  const merchant = merchants.find((m) => m.id === store.merchantId)
  res.json({ success: true, data: { ...store, merchantName: merchant?.name } })
})

userRouter.get('/stores/:id/products', (req, res) => {
  const storeId = Number(req.params.id)
  const storeProducts = products.filter((product) => product.storeId === storeId)
  res.json({ success: true, data: storeProducts })
})

userRouter.get('/stores/:id/comments', (req, res) => {
  const storeId = Number(req.params.id)
  res.json({ success: true, data: storeComments[storeId] || [] })
})

userRouter.get('/group-buys/:id', (req, res) => {
  const groupId = Number(req.params.id)
  const group = groupBuys.find((item) => item.id === groupId)
  if (!group) {
    return res.status(404).json({ success: false, message: '拼团活动不存在' })
  }
  const product = products.find((p) => p.id === group.productId)
  res.json({ success: true, data: { ...group, product } })
})

userRouter.post('/orders', (req, res) => {
  const { productId, quantity = 1, customerName } = req.body
  const product = products.find((item) => item.id === Number(productId))
  if (!product) {
    return res.status(400).json({ success: false, message: '商品不存在' })
  }
  const order = addOrder({
    productId: product.id,
    quantity,
    amount: product.price * quantity,
    customerName: customerName || '匿名用户',
    userId: req.user?.id || null
  })
  const payment = addPayment({ orderId: order.id, amount: order.amount, channel: 'wechat_pay' })
  res.json({ success: true, data: { order, payment } })
})

userRouter.post('/group-buys/:id/join', (req, res) => {
  const groupId = Number(req.params.id)
  const { quantity = 1 } = req.body
  const group = updateGroupParticipants(groupId, quantity)
  if (!group) {
    return res.status(404).json({ success: false, message: '拼团不存在' })
  }
  res.json({ success: true, data: group })
})

// ============== 商户模块 ==================
const merchantRouter = express.Router()
merchantRouter.use(requireRole(['merchant']))

merchantRouter.get('/stores', (req, res) => {
  const merchantStores = stores.filter((store) => store.merchantId === req.user.merchantId)
  res.json({ success: true, data: merchantStores })
})

merchantRouter.post('/stores', (req, res) => {
  const payload = {
    ...req.body,
    merchantId: req.user.merchantId,
    status: 'open'
  }
  const store = addStore(payload)
  res.json({ success: true, data: store })
})

merchantRouter.post('/stores/:id/products', (req, res) => {
  const storeId = Number(req.params.id)
  const store = stores.find((item) => item.id === storeId && item.merchantId === req.user.merchantId)
  if (!store) {
    return res.status(404).json({ success: false, message: '门店不存在或无权限' })
  }
  const product = addProduct({ ...req.body, storeId })
  res.json({ success: true, data: product })
})

merchantRouter.get('/orders', (_req, res) => {
  const merchantOrders = stores
    .filter((store) => store.merchantId === _req.user.merchantId)
    .flatMap((store) =>
      products
        .filter((product) => product.storeId === store.id)
        .map((product) => ({ productId: product.id, productName: product.name }))
    )
  res.json({ success: true, data: merchantOrders })
})

// ============== 管理员模块 ==================
const adminRouter = express.Router()
adminRouter.use(requireRole(['admin']))

adminRouter.get('/merchants', (_req, res) => {
  res.json({ success: true, data: merchants })
})

adminRouter.post('/merchants', (req, res) => {
  const merchant = addMerchant(req.body)
  res.json({ success: true, data: merchant })
})

adminRouter.post('/activities', (req, res) => {
  const group = {
    id: groupBuys.length + 1,
    ...req.body,
    status: 'scheduled',
    currentParticipants: 0
  }
  groupBuys.push(group)
  res.json({ success: true, data: group })
})

apiRouter.use('/user', userRouter)
apiRouter.use('/merchant', merchantRouter)
apiRouter.use('/admin', adminRouter)

app.use('/api', apiRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Wedding backend listening on port ${PORT}`)
})
