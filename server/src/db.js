const fs = require('fs')
const path = require('path')
const { LowSync } = require('lowdb')
const { JSONFileSync } = require('lowdb/node')
const config = require('./config')

const dbFile = config.dbFile
const dbDir = path.dirname(dbFile)

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const adapter = new JSONFileSync(dbFile)
const db = new LowSync(adapter)
db.read()

db.data = db.data || {
  orders: [],
  groups: []
}

function write() {
  db.write()
}

function findOrderById(orderId) {
  db.read()
  return db.data.orders.find((order) => order.id === orderId)
}

function updateOrder(orderId, updates) {
  db.read()
  const target = db.data.orders.find((order) => order.id === orderId)
  if (target) {
    Object.assign(target, updates, { updatedAt: new Date().toISOString() })
    write()
  }
  return target
}

module.exports = {
  db,
  write,
  findOrderById,
  updateOrder
}
