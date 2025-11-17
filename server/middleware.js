const { users } = require('./mockData')

function attachUser(req, _res, next) {
  const userId = Number(req.header('x-user-id'))
  if (userId) {
    const currentUser = users.find((user) => user.id === userId)
    if (currentUser) {
      req.user = currentUser
    }
  }
  next()
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: '无权访问该资源' })
    }
    next()
  }
}

module.exports = {
  attachUser,
  requireRole
}
