-- 用户与角色
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    openid VARCHAR(64) UNIQUE,
    phone VARCHAR(20),
    nickname VARCHAR(64),
    password_hash VARCHAR(128),
    role VARCHAR(32) NOT NULL DEFAULT 'user', -- admin, merchant, user
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    merchant_id BIGINT REFERENCES merchants(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE merchants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    contact VARCHAR(64),
    license_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'pending', -- pending/active/suspended
    owner_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stores (
    id BIGSERIAL PRIMARY KEY,
    merchant_id BIGINT NOT NULL REFERENCES merchants(id),
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    logo_url TEXT,
    address TEXT,
    geo JSONB,
    description TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'open',
    rating NUMERIC(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES stores(id),
    title VARCHAR(128) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2),
    cover_url TEXT,
    stock INT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'on_shelf',
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE group_buy_events (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    title VARCHAR(128) NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    min_participants INT NOT NULL,
    max_participants INT,
    joined_participants INT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'scheduled', -- scheduled/ongoing/completed/canceled
    group_price NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_no VARCHAR(64) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    store_id BIGINT REFERENCES stores(id),
    group_buy_id BIGINT REFERENCES group_buy_events(id),
    status VARCHAR(32) DEFAULT 'pending', -- pending/paid/shipped/completed/refunded
    total_amount NUMERIC(10,2) NOT NULL,
    actual_amount NUMERIC(10,2),
    remark TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    channel VARCHAR(32) NOT NULL, -- wechat_pay/alipay
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(32) DEFAULT 'created', -- created/success/failed/refunded
    transaction_no VARCHAR(128),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
