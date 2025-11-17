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
# 婚庆拼团小程序及示例后端

实训课程，代码完全由cursor编写。现已补充可运行的示例后端、RBAC 访问控制以及基础管理端，便于联调。

## 目录结构

```
├── admin                 # 极简管理端页面
├── hunqing_cursor        # 小程序源代码
└── server                # Node.js 示例后端（Express）
```

## 启动示例后端

1. 安装依赖
   ```bash
   cd server
   npm install
   ```
2. 启动服务
   ```bash
   npm start
   ```
3. 默认监听 `http://localhost:4000/api`，并包含 `/admin`、`/merchant`、`/user` 三套路由模块。

> **提示**：示例后端仅用于联调，数据存储在内存中。正式环境可根据 `server/db/schema.sql` 中的 MySQL/PostgreSQL 建模脚本搭建真实数据库。

## 角色与权限

| 角色     | 可访问 API                             | 权限说明 |
| -------- | -------------------------------------- | -------- |
| 管理员   | `/api/admin/*`                         | 审核/管理商户、发布拼团活动 |
| 商户     | `/api/merchant/*`（需 `x-user-id=2`）  | 维护自有门店、商品、查看订单 |
| 普通用户 | `/api/user/*`                          | 浏览、下单、参与拼团 |

示例后端使用请求头 `x-user-id` 指定当前用户，方便在开发阶段模拟不同角色。

## 小程序改动要点

- `app.js` 中已经将 `baseUrl` 指向 `http://localhost:4000/api`。
- 新增 `utils/request.js` 封装微信 `wx.request`，所有 API 走统一出口。
- `utils/api.js` 会优先请求后端接口，若网络不可用自动回退到内置示例数据。

## 管理端

`admin/index.html` 为极简后台，可在浏览器直接打开。该页面会以管理员身份调用 `/api/admin/merchants`、`/api/admin/activities`，用于演示商户创建与拼团发布流程。
# -
实训课程，代码完全由cursor编写。
不完全由cursor编写了，因为用codex完善了其他需求。
