const http = require('http')
const { URL } = require('url')
const config = require('./config')
const { exchangeCodeForSession } = require('./services/wechat')
const { findOrCreateByOpenId, findByOpenId } = require('./services/users')
const {
  createTokenPair,
  verifyRefreshToken,
  revokeRefreshToken
} = require('./services/token-store')
const { injectUser, requireAuth, requireRole } = require('./middleware/auth')

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
}

const send = (res, statusCode, data) => {
  res.writeHead(statusCode, jsonHeaders)
  res.end(JSON.stringify(data))
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, jsonHeaders)
    res.end()
    return
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })

  req.on('end', async () => {
    if (body) {
      try {
        req.body = JSON.parse(body)
      } catch (error) {
        req.body = null
      }
    }

    injectUser(req)
    const requestUrl = new URL(req.url, `http://${req.headers.host}`)

    try {
      if (req.method === 'POST' && requestUrl.pathname === '/auth/login') {
        const { code } = req.body || {}
        if (!code) {
          send(res, 400, { message: 'code不能为空' })
          return
        }
        const session = await exchangeCodeForSession(code)
        console.log(`[auth] 登录 code=${code} openid=${session.openid}`)
        const user = findOrCreateByOpenId(session.openid)
        const tokens = createTokenPair(user)
        send(res, 200, {
          user,
          ...tokens,
          sessionKey: session.session_key
        })
        return
      }

      if (req.method === 'POST' && requestUrl.pathname === '/auth/refresh') {
        const { refreshToken } = req.body || {}
        if (!refreshToken) {
          send(res, 400, { message: '缺少refreshToken' })
          return
        }
        const session = verifyRefreshToken(refreshToken)
        if (!session) {
          send(res, 401, { message: 'refreshToken已失效' })
          return
        }
        const user = findByOpenId(session.openid)
        if (!user) {
          revokeRefreshToken(refreshToken)
          send(res, 401, { message: '用户不存在' })
          return
        }
        revokeRefreshToken(refreshToken)
        const tokens = createTokenPair(user)
        send(res, 200, { user, ...tokens })
        return
      }

      if (req.method === 'POST' && requestUrl.pathname === '/auth/logout') {
        const { refreshToken } = req.body || {}
        revokeRefreshToken(refreshToken)
        send(res, 200, { message: '已退出登录' })
        return
      }

      if (req.method === 'GET' && requestUrl.pathname === '/users/me') {
        if (!requireAuth(req, res)) return
        send(res, 200, { user: req.user })
        return
      }

      if (req.method === 'GET' && requestUrl.pathname === '/merchant/overview') {
        if (!requireRole(req, res, ['merchant', 'admin'])) return
        send(res, 200, {
          storeName: req.user.nickname,
          stats: {
            pendingOrders: 3,
            todayVisitors: 58,
            refundRequests: 1
          },
          suggestions: [
            '完善商家资料可提升曝光',
            '每天保持至少一条动态更新'
          ]
        })
        return
      }

      if (req.method === 'GET' && requestUrl.pathname === '/admin/reviews') {
        if (!requireRole(req, res, ['admin'])) return
        send(res, 200, {
          pendingMerchants: [
            { id: 101, name: '幸福花园婚庆', submittedAt: '2024-05-01 10:00' },
            { id: 102, name: '花漾年华摄影', submittedAt: '2024-05-02 09:40' }
          ],
          pendingActivities: [
            { id: 501, title: '520浪漫套餐', type: '团购', submittedAt: '2024-05-01 08:20' }
          ]
        })
        return
      }

      send(res, 404, { message: '未找到接口' })
    } catch (error) {
      console.error('[server] error', error)
      send(res, 500, { message: '服务器异常', detail: error.message })
    }
  })
})

server.listen(config.port, () => {
  console.log(`API server listening on port ${config.port}`)
})
