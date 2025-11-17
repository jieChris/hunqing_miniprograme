const crypto = require('crypto')

const base64UrlEncode = (input) =>
  Buffer.from(JSON.stringify(input))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

const base64UrlDecode = (input) => {
  const pad = 4 - (input.length % 4)
  const normalized = input + (pad < 4 ? '='.repeat(pad) : '')
  const base64 = normalized.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(Buffer.from(base64, 'base64').toString())
}

const sign = (payload, secret, expiresInSeconds) => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + expiresInSeconds }
  const headerSeg = base64UrlEncode(header)
  const payloadSeg = base64UrlEncode(body)
  const signingInput = `${headerSeg}.${payloadSeg}`
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signingInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  return `${signingInput}.${signature}`
}

const verify = (token, secret) => {
  if (!token) throw new Error('Missing token')
  const [headerSeg, payloadSeg, signature] = token.split('.')
  if (!headerSeg || !payloadSeg || !signature) {
    throw new Error('Invalid token structure')
  }
  const signingInput = `${headerSeg}.${payloadSeg}`
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(signingInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  if (expectedSig !== signature) {
    throw new Error('Invalid signature')
  }
  const payload = base64UrlDecode(payloadSeg)
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired')
  }
  return payload
}

module.exports = { sign, verify }
