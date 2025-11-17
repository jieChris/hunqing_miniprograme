# 婚庆小程序实训项目

实训课程，代码完全由 cursor 编写。在此基础上增加了基于微信登录的鉴权链路与角色控制。

## 登录 & 鉴权

- `server/` 目录提供基于 Node.js（原生 http 模块）的轻量后台，启动方式：
  ```bash
  node server/src/index.js
  ```
- `/auth/login` 使用 `wx.login` 返回的 `code` 交换 `openid/session_key`（若缺少正式 AppID/Secret，会退化为 mock openid），并签发 access token / refresh token。
- `/auth/refresh` 用于续期，`/auth/logout` 会销毁 refresh token。
- `/users/me` 返回用户及角色信息；`/merchant/overview`、`/admin/reviews` 仅允许商家/管理员访问。
- 本地用户/角色存放于 `server/data/users.json`，可直接编辑以模拟不同账号。

小程序启动时会在 `app.js` 中调用 `wx.login`，登录态保存到 `wx.setStorageSync`，`utils/request.js` 会自动把 token 放入 `Authorization` 头并在 401 时尝试刷新，`app.logout()` 会调用 `/auth/logout` 后清理前端缓存。

更多页面结构、UI 说明参见 `hunqing_cursor/README.md`。
