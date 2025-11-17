const fs = require('fs')
const config = require('../config')

const readUsers = () => {
  const raw = fs.readFileSync(config.dataPaths.users, 'utf-8')
  return JSON.parse(raw)
}

const writeUsers = (users) => {
  fs.writeFileSync(config.dataPaths.users, JSON.stringify(users, null, 2))
}

const findByOpenId = (openid) => readUsers().find((user) => user.openid === openid)

const findOrCreateByOpenId = (openid) => {
  const users = readUsers()
  let existing = users.find((user) => user.openid === openid)
  if (existing) return existing
  existing = {
    openid,
    nickname: `用户${openid.slice(-4)}`,
    role: 'user'
  }
  users.push(existing)
  writeUsers(users)
  return existing
}

const updateUser = (updated) => {
  const users = readUsers()
  const index = users.findIndex((user) => user.openid === updated.openid)
  if (index !== -1) {
    users[index] = { ...users[index], ...updated }
    writeUsers(users)
    return users[index]
  }
  return null
}

module.exports = {
  readUsers,
  writeUsers,
  findByOpenId,
  findOrCreateByOpenId,
  updateUser
}
