# GoBuy 支付服务端

该目录提供一个可直接运行的 Express 服务，负责下单、调用微信支付统一下单接口以及处理支付/退款通知，配合 `hunqing_cursor` 小程序完成拼团支付流程。

## 功能概览
- 创建订单：接收团购商品与用户信息，生成订单号并存储到 LowDB。
- 微信支付：支持真实证书调用，也支持默认的 `MOCK_WECHATPAY=true` 模式直接返回虚拟 `prepay_id`。
- 支付通知：校验微信支付签名并解密报文，更新订单状态。
- 退款接口：发生支付异常或用户取消时可触发退款，保持订单状态与微信一致。

## 快速开始
```bash
cd server
cp .env.example .env          # 根据需要填写微信支付参数
npm install
npm run dev                   # 默认监听 8787 端口
```

> 默认启动在 Mock 模式，不会真正向微信发起网络请求，方便联调。如果已经在商户平台配置完成证书，可将 `.env` 中的 `MOCK_WECHATPAY` 设置为 `false` 并提供正确的私钥、平台证书路径。

## 主要配置
- `WECHAT_APP_ID` / `WECHAT_MCH_ID` / `WECHAT_SERIAL_NO`：商户平台内获取。
- `WECHAT_PRIVATE_KEY_PATH`：`apiclient_key.pem` 文件的绝对或相对路径。
- `WECHAT_PLATFORM_CERT_PATH`：微信支付平台证书路径，用于验签通知。
- `WECHAT_API_V3_KEY`：32 位 API v3 密钥，用于解密回调资源。
- `WECHAT_NOTIFY_URL`：微信通知地址，需要在商户平台同步配置，通常是公网可访问地址。

## API
- `POST /api/orders`：创建订单并返回前端唤起支付所需参数。
- `GET /api/orders/:id`：查询订单详情与状态。
- `POST /api/orders/:id/refund`：发起退款，异常时可兜底。
- `POST /api/wechatpay/notify`：接收微信支付回调（服务器内部使用）。

## 数据存储
默认将订单保存在 `data/db.json`。生产环境可改造为 MySQL/Redis，只需修改 `src/db.js` 内的实现。

