const crypto = require('crypto')
const config = require('../config')
const { sign, verify } = require('../utils/jwt')

const refreshTokens = new Map()

const createTokenPair = (user) => {
  const payload = {
    openid: user.openid,
    role: user.role,
    nickname: user.nickname
  }
  const accessToken = sign(payload, config.jwtSecret, config.accessTokenTTL)
  const refreshToken = crypto.randomBytes(32).toString('hex')
  const expiresAt = Date.now() + config.refreshTokenTTL * 1000
  refreshTokens.set(refreshToken, { openid: user.openid, expiresAt })

  return {
    accessToken,
    refreshToken,
    expiresIn: config.accessTokenTTL
  }
}

const verifyAccessToken = (token) => verify(token, config.jwtSecret)

const verifyRefreshToken = (token) => {
  const session = refreshTokens.get(token)
  if (!session) return null
  if (session.expiresAt < Date.now()) {
    refreshTokens.delete(token)
    return null
  }
  return session
}

const revokeRefreshToken = (token) => {
  if (token) {
    refreshTokens.delete(token)
  }
}

const revokeByOpenId = (openid) => {
  Array.from(refreshTokens.entries()).forEach(([token, session]) => {
    if (session.openid === openid) {
      refreshTokens.delete(token)
    }
  })
}

module.exports = {
  createTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeByOpenId
}
