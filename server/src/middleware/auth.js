const { verifyAccessToken } = require('../services/token-store')
const { findByOpenId } = require('../services/users')

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
}

const injectUser = (req) => {
  const header = req.headers['authorization'] || req.headers['Authorization']
  if (!header || !header.startsWith('Bearer ')) return null
  const token = header.replace('Bearer ', '')
  try {
    const payload = verifyAccessToken(token)
    const user = findByOpenId(payload.openid)
    if (user) {
      req.user = user
      return user
    }
  } catch (error) {
    req.authError = error.message
  }
  return null
}

const requireAuth = (req, res) => {
  if (!req.user) {
    res.writeHead(401, headers)
    res.end(JSON.stringify({ message: '未登录或登录已过期' }))
    return false
  }
  return true
}

const requireRole = (req, res, roles = []) => {
  if (!requireAuth(req, res)) return false
  if (!roles.includes(req.user.role)) {
    res.writeHead(403, headers)
    res.end(JSON.stringify({ message: '没有权限访问该接口' }))
    return false
  }
  return true
}

module.exports = {
  injectUser,
  requireAuth,
  requireRole
}
