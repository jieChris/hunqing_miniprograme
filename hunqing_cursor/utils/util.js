// util.js - 通用工具函数

const app = getApp()

/**
 * 获取完整的图片URL（支持本地和COS）
 * @param {String} path 图片路径，如 '/images/xxx.png'
 * @returns {String} 完整的图片URL
 */
export function getImageUrl(path) {
  if (!path) return ''
  // 如果已经是完整URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  // 如果是本地路径，转换为COS URL
  const cosUrl = app.globalData.cosUrl || 'https://59-1302292078.cos.ap-nanjing.myqcloud.com'
  // 确保路径以 / 开头
  const imagePath = path.startsWith('/') ? path : '/' + path
  return cosUrl + imagePath
}

/**
 * 格式化价格
 * @param {Number} price 价格（分）
 * @returns {String} 格式化后的价格
 */
export function formatPrice(price) {
  if (!price && price !== 0) return '0.00'
  const yuan = price / 100
  return yuan.toFixed(2)
}

/**
 * 格式化日期
 * @param {Date|String|Number} date 日期
 * @param {String} format 格式，默认 'YYYY-MM-DD'
 * @returns {String} 格式化后的日期
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 计算距离
 * @param {Number} lat1 纬度1
 * @param {Number} lng1 经度1
 * @param {Number} lat2 纬度2
 * @param {Number} lng2 经度2
 * @returns {String} 格式化后的距离
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  if (!lat1 || !lng1 || !lat2 || !lng2) return '未知'
  
  const R = 6371 // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  if (distance < 1) {
    return Math.round(distance * 1000) + 'm'
  }
  return distance.toFixed(1) + 'km'
}

/**
 * 防抖函数
 * @param {Function} func 要执行的函数
 * @param {Number} wait 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = 300) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func 要执行的函数
 * @param {Number} wait 等待时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, wait = 300) {
  let timeout
  return function(...args) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, args)
      }, wait)
    }
  }
}

