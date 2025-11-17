# GoBuy 拼团小程序 & 支付服务

实训课程项目，包含婚庆行业主题的小程序前端（`hunqing_cursor`）以及新增的 Node.js 服务端（`server`）。服务端负责创建订单、对接微信支付并处理支付/退款通知，前端的 `gobuy` 流程可直接调用后端下单并发起 `wx.requestPayment`。

## 目录说明
- `hunqing_cursor/`：小程序源码，可直接导入微信开发者工具。
- `server/`：Express 支付服务，默认以 Mock 模式模拟 `prepay_id`，配置证书后即可对接真实微信支付。

## 本地联调
1. 复制 `server/.env.example` 为 `.env`，如无需真实支付，可保持 `MOCK_WECHATPAY=true`。
2. 在 `server` 目录执行 `npm install && npm run dev`（如受限可手动安装依赖）。
3. 修改/确认 `hunqing_cursor/app.js` 中的 `baseUrl` 指向 `http://127.0.0.1:8787/api`。
4. 在小程序团购详情页点击“立即抢购”，即可体验下单、支付、订单状态轮询的完整链路。

