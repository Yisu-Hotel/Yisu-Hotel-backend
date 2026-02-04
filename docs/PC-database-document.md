# 数据库文档

## 1. 数据库设计概述

- 数据库类型: PostgreSQL
- 设计原则: 规范化、一致性、可扩展性
- 命名规范: 小写字母 + 下划线（snake_case）
- 字符集: UTF-8
- 时区: UTC

## 2. 表结构设计

### 2.1 users 表

用户信息表，存储商户和管理员账号信息。

**表名:** `users`

**字段说明:**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|
| id | UUID | PRIMARY KEY | 用户ID |
| account | VARCHAR(100) | UNIQUE, NOT NULL | 账号（手机号或邮箱） |
| password | VARCHAR(255) | NOT NULL | 密码（加密存储） |
| role | VARCHAR(20) | NOT NULL | 角色：merchant（商户）、admin（管理员） |
| nickname | VARCHAR(50) | NULL | 昵称 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 更新时间 |

**索引:**
- `idx_users_account`: UNIQUE INDEX (account)
- `idx_users_role`: INDEX (role)

### 2.2 hotels 表

酒店信息表，存储酒店基本信息。

**表名:** `hotels`

**字段说明:**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|
| id | UUID | PRIMARY KEY | 酒店ID |
| hotel_name_cn | VARCHAR(100) | NOT NULL | 酒店中文名称 |
| hotel_name_en | VARCHAR(100) | NOT NULL | 酒店英文名称 |
| formatted_address | VARCHAR(255) | NOT NULL | 完整地址 |
| address_component | JSONB | NOT NULL | 地址组件（高德地图标准格式） |
| star_rating | INTEGER | NOT NULL, CHECK (star_rating >= 1 AND star_rating <= 5) | 酒店星级（1-5星） |
| opening_date | DATE | NOT NULL | 开业时间 |
| nearby_info | TEXT | NULL | 周边信息（景点、交通等） |
| promotion_scenario | VARCHAR(100) | NULL | 优惠场景 |
| status | VARCHAR(20) | NOT NULL | 状态：draft（草稿）、pending（待审核）、auditing（审核中）、approved（已通过）、rejected（已拒绝）、published（已发布）、offline（已下线） |
| created_by | UUID | NOT NULL, FOREIGN KEY (users.id) | 创建人ID |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 更新时间 |

**索引:**
- `idx_hotels_created_by`: INDEX (created_by)
- `idx_hotels_status`: INDEX (status)
- `idx_hotels_hotel_name_cn`: INDEX (hotel_name_cn) - 全文索引

### 2.3 hotel_prices 表

房型价格表，支持不同房型对应不同价格。

**表名:** `hotel_prices`

**字段说明:**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|
| id | UUID | PRIMARY KEY | 价格记录ID |
| hotel_id | UUID | NOT NULL, FOREIGN KEY (hotels.id) | 酒店ID |
| room_type | VARCHAR(50) | NOT NULL | 房型名称（如：大床房、双床房、套房） |
| price | DECIMAL(10,2) | NOT NULL | 价格（保留2位小数） |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 更新时间 |

**索引:**
- `idx_hotel_prices_hotel_id`: INDEX (hotel_id)
- `idx_hotel_prices_room_type`: INDEX (room_type)
- `idx_hotel_prices_hotel_id_room_type`: UNIQUE INDEX (hotel_id, room_type) - 复合唯一索引

### 2.4 audit_logs 表

审核日志表，记录酒店审核历史。

**表名:** `audit_logs`

**字段说明:**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|
| id | UUID | PRIMARY KEY | 审核记录ID |
| hotel_id | UUID | NOT NULL, FOREIGN KEY (hotels.id) | 酒店ID |
| auditor_id | UUID | NOT NULL, FOREIGN KEY (users.id) | 审核人ID |
| audited_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 审核时间 |
| result | VARCHAR(20) | NOT NULL | 审核结果：approved（通过）、rejected（拒绝） |
| reject_reason | TEXT | NULL | 拒绝原因（被拒绝时填写） |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 创建时间 |

**索引:**
- `idx_audit_logs_hotel_id`: INDEX (hotel_id)
- `idx_audit_logs_audited_at`: INDEX (audited_at)
- `idx_audit_logs_auditor_id`: INDEX (auditor_id)

### 2.5 hotel_history 表

酒店修改历史记录表，记录酒店信息变更历史。

**表名:** `hotel_history`

**字段说明:**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|
| id | UUID | PRIMARY KEY | 历史记录ID |
| hotel_id | UUID | NOT NULL, FOREIGN KEY (hotels.id) | 酒店ID |
| version | INTEGER | NOT NULL | 版本号 |
| modified_by | UUID | NOT NULL, FOREIGN KEY (users.id) | 修改人ID |
| modified_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 修改时间 |
| changes | JSONB | NOT NULL | 修改内容（JSON格式） |

**索引:**
- `idx_hotel_history_hotel_id`: INDEX (hotel_id)
- `idx_hotel_history_version`: INDEX (version)
- `idx_hotel_history_modified_at`: INDEX (modified_at)

## 3. 表字段详细说明

### 3.1 users 表字段

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|------|
| id | - | 用户唯一标识符 |
| account | - | 账号，支持手机号（11位数字）或邮箱格式 |
| password | - | 密码，6-20位字符，前端加密后传输 |
| role | 'merchant' | 用户角色，merchant（商户）或admin（管理员） |
| nickname | NULL | 用户昵称，可选字段 |
| created_at | NOW() | 账号创建时间 |
| updated_at | NOW() | 账号更新时间 |

### 3.2 hotels 表字段

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|------|
| id | - | 酒店唯一标识符 |
| hotel_name_cn | - | 酒店中文名称 |
| hotel_name_en | - | 酒店英文名称 |
| formatted_address | - | 完整地址字符串，由地图选点后自动填充 |
| address_component | - | 地址组件对象，包含以下字段：<br>- country: 国家<br>- province: 省份<br>- city: 城市<br>- district: 区县<br>- street: 街道<br>- street_number: 门牌号 |
| star_rating | - | 酒店星级，1-5星整数 |
| opening_date | - | 开业时间，格式：YYYY-MM-DD |
| nearby_info | NULL | 周边信息，多行文本，描述景点、交通等 |
| promotion_scenario | NULL | 优惠场景，如：节日优惠、机票+酒店套餐 |
| status | 'draft' | 酒店状态，枚举值 |
| created_by | - | 创建人ID，关联users表 |
| created_at | NOW() | 酒店创建时间 |
| updated_at | NOW() | 酒店更新时间 |

### 3.3 hotel_prices 表字段

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|------|
| id | - | 价格记录唯一标识符 |
| hotel_id | - | 关联的酒店ID |
| room_type | - | 房型名称，如：大床房、双床房、套房、家庭房 |
| price | - | 房型价格，DECIMAL类型，保留2位小数 |

### 3.4 audit_logs 表字段

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|------|
| id | - | 审核记录唯一标识符 |
| hotel_id | - | 关联的酒店ID |
| auditor_id | - | 审核人ID，关联users表 |
| audited_at | NOW() | 审核时间 |
| result | - | 审核结果，枚举值：approved（通过）、rejected（拒绝） |
| reject_reason | NULL | 拒绝原因，仅result为rejected时有值 |
| created_at | NOW() | 审核记录创建时间 |

### 3.5 hotel_history 表字段

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|------|
| id | - | 历史记录唯一标识符 |
| hotel_id | - | 关联的酒店ID |
| version | - | 版本号，每次修改递增 |
| modified_by | - | 修改人ID，关联users表 |
| modified_at | NOW() | 修改时间 |
| changes | - | 修改内容，JSON格式，记录变更的字段和新值 |

## 4. 索引设计和关系设计

### 4.1 索引设计

**users 表索引:**
- `idx_users_account`: 唯一索引，用于账号唯一性校验和登录查询
- `idx_users_role`: 普通索引，用于按角色筛选用户

**hotels 表索引:**
- `idx_hotels_created_by`: 普通索引，用于查询商户创建的酒店列表
- `idx_hotels_status`: 普通索引，用于按状态筛选酒店
- `idx_hotels_hotel_name_cn`: 全文索引，支持酒店名称模糊搜索

**hotel_prices 表索引:**
- `idx_hotel_prices_hotel_id`: 普通索引，用于查询酒店的所有房型价格
- `idx_hotel_prices_room_type`: 普通索引，用于按房型筛选价格
- `idx_hotel_prices_hotel_id_room_type`: 复合唯一索引，确保同一酒店同一房型只存在一条价格记录

**audit_logs 表索引:**
- `idx_audit_logs_hotel_id`: 普通索引，用于查询酒店的审核历史
- `idx_audit_logs_audited_at`: 普通索引，用于按审核时间排序
- `idx_audit_logs_auditor_id`: 普通索引，用于查询审核人的审核记录

**hotel_history 表索引:**
- `idx_hotel_history_hotel_id`: 普通索引，用于查询酒店的修改历史
- `idx_hotel_history_version`: 普通索引，用于按版本号排序
- `idx_hotel_history_modified_at`: 普通索引，用于按修改时间排序

### 4.2 关系设计

**用户与酒店关系:**
- 一个用户（merchant角色）可以创建多个酒店
- 一个用户（admin角色）可以审核多个酒店
- 外键约束：hotels.created_by → users.id

**酒店与价格关系:**
- 一个酒店可以有多个房型价格
- 外键约束：hotel_prices.hotel_id → hotels.id
- 复合唯一约束：(hotel_id, room_type)

**酒店与审核日志关系:**
- 一个酒店可以有多个审核记录
- 外键约束：audit_logs.hotel_id → hotels.id
- 外键约束：audit_logs.auditor_id → users.id

**酒店与历史记录关系:**
- 一个酒店可以有多个修改历史记录
- 外键约束：hotel_history.hotel_id → hotels.id
- 外键约束：hotel_history.modified_by → users.id

## 5. 数据类型定义

### 5.1 用户角色枚举

```sql
CREATE TYPE user_role AS ENUM ('merchant', 'admin');
```

**说明:**
- `merchant`: 商户角色，可以创建和管理自己的酒店
- `admin`: 管理员角色，可以审核所有酒店

### 5.2 酒店状态枚举

```sql
CREATE TYPE hotel_status AS ENUM (
  'draft',      -- 草稿
  'pending',    -- 待审核
  'auditing',   -- 审核中
  'approved',   -- 已通过
  'rejected',   -- 已拒绝
  'published',  -- 已发布
  'offline'     -- 已下线
);
```

**状态流转:**
- draft → pending → auditing → approved/rejected → published → offline
- 草稿和已下线状态可以恢复为 published

### 5.3 审核结果枚举

```sql
CREATE TYPE audit_result AS ENUM ('approved', 'rejected');
```

**说明:**
- `approved`: 审核通过
- `rejected`: 审核拒绝

## 6. SQL 示例

### 6.1 建表语句

```sql
-- 创建用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'merchant',
  nickname VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 创建酒店表
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_name_cn VARCHAR(100) NOT NULL,
  hotel_name_en VARCHAR(100) NOT NULL,
  formatted_address VARCHAR(255) NOT NULL,
  address_component JSONB NOT NULL,
  star_rating INTEGER NOT NULL CHECK (star_rating >= 1 AND star_rating <= 5),
  opening_date DATE NOT NULL,
  nearby_info TEXT,
  promotion_scenario VARCHAR(100),
  status hotel_status NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 创建房型价格表
CREATE TABLE hotel_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  room_type VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT uk_hotel_room_type UNIQUE (hotel_id, room_type)
);

-- 创建审核日志表
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  auditor_id UUID NOT NULL REFERENCES users(id),
  audited_at TIMESTAMP NOT NULL DEFAULT NOW(),
  result audit_result NOT NULL,
  reject_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 创建酒店历史记录表
CREATE TABLE hotel_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  modified_by UUID NOT NULL REFERENCES users(id),
  modified_at TIMESTAMP NOT NULL DEFAULT NOW(),
  changes JSONB NOT NULL
);
```

### 6.2 插入数据示例

```sql
-- 插入商户用户
INSERT INTO users (id, account, password, role, nickname, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '13800138000',
  '$2a$10$N7Z8Q8...（加密后的密码）',
  'merchant',
  '张三',
  NOW(),
  NOW()
);

-- 插入酒店信息（含房型价格）
WITH hotel_data AS (
  INSERT INTO hotels (
    id, hotel_name_cn, hotel_name_en, formatted_address, address_component,
    star_rating, opening_date, nearby_info, promotion_scenario,
    status, created_by, created_at, updated_at
  VALUES (
      '550e8400-e29b-41d4-a716-446655440001',
      '易宿酒店',
      'Yisu Hotel',
      '北京市朝阳区建国路88号',
      '{"country": "中国", "province": "北京市", "city": "北京市", "district": "朝阳区", "street": "建国路", "street_number": "88号"}',
      4,
      '2020-01-01',
      '距离地铁站500米，周边有商场、餐厅',
      '节日优惠',
      'draft',
      '550e8400-e29b-41d4-a716-446655440000',
      NOW(),
      NOW()
    ) RETURNING id
)
INSERT INTO hotel_prices (id, hotel_id, room_type, price, created_at, updated_at)
SELECT
  gen_random_uuid(),
  hotel_data.id,
  '大床房',
  299.00,
  NOW(),
  NOW();

INSERT INTO hotel_prices (id, hotel_id, room_type, price, created_at, updated_at)
SELECT
  gen_random_uuid(),
  hotel_data.id,
  '双床房',
  329.00,
  NOW(),
  NOW();

INSERT INTO hotel_prices (id, hotel_id, room_type, price, created_at, updated_at)
SELECT
  gen_random_uuid(),
  hotel_data.id,
  '套房',
  599.00,
  NOW(),
  NOW();

-- 插入审核日志
INSERT INTO audit_logs (id, hotel_id, auditor_id, audited_at, result, reject_reason, created_at)
VALUES (
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  NOW(),
  'approved',
  NULL,
  NOW()
);

-- 插入酒店历史记录
INSERT INTO hotel_history (id, hotel_id, version, modified_by, modified_at, changes)
VALUES (
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001',
  1,
  '550e8400-e29b-41d4-a716-446655440000',
  NOW(),
  '{"star_rating": 5, "price": 399.00}'
);
```

### 6.3 查询数据示例

```sql
-- 查询商户的酒店列表（分页）
SELECT h.id, h.hotel_name_cn, h.hotel_name_en, h.formatted_address,
       h.star_rating, h.status, h.created_at, h.updated_at,
       u.nickname as created_by_nickname
FROM hotels h
LEFT JOIN users u ON h.created_by = u.id
WHERE h.created_by = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY h.created_at DESC
LIMIT 10 OFFSET 0;

-- 查询酒店的所有房型价格
SELECT hp.room_type, hp.price
FROM hotel_prices hp
WHERE hp.hotel_id = '550e8400-e29b-41d4-a716-446655440001'
ORDER BY hp.room_type;

-- 查询酒店的审核日志（最近3次）
SELECT al.id, al.audited_at, u.nickname as auditor_nickname,
       al.result, al.reject_reason
FROM audit_logs al
LEFT JOIN users u ON al.auditor_id = u.id
WHERE al.hotel_id = '550e8400-e29b-41d4-a716-446655440001'
ORDER BY al.audited_at DESC
LIMIT 3;

-- 查询酒店状态为待审核的数量
SELECT COUNT(*) as pending_count
FROM hotels
WHERE status = 'pending';

-- 全文搜索酒店（支持中文）
SELECT h.id, h.hotel_name_cn, h.hotel_name_en, h.formatted_address
FROM hotels h
WHERE h.hotel_name_cn LIKE '%酒店%'
  OR h.hotel_name_en LIKE '%hotel%';
```

### 6.4 创建索引语句

```sql
-- 创建唯一索引
CREATE UNIQUE INDEX idx_users_account ON users(account);

-- 创建普通索引
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_hotels_created_by ON hotels(created_by);
CREATE INDEX idx_hotels_status ON hotels(status);
CREATE INDEX idx_hotels_hotel_name_cn ON hotels USING gin(hotel_name_cn gin_trgm_ops);
CREATE INDEX idx_hotel_prices_hotel_id ON hotel_prices(hotel_id);
CREATE INDEX idx_hotel_prices_room_type ON hotel_prices(room_type);
CREATE INDEX idx_hotel_prices_hotel_id_room_type ON hotel_prices(hotel_id, room_type);
CREATE INDEX idx_audit_logs_hotel_id ON audit_logs(hotel_id);
CREATE INDEX idx_audit_logs_audited_at ON audit_logs(audited_at);
CREATE INDEX idx_audit_logs_auditor_id ON audit_logs(auditor_id);
CREATE INDEX idx_hotel_history_hotel_id ON hotel_history(hotel_id);
CREATE INDEX idx_hotel_history_version ON hotel_history(version);
CREATE INDEX idx_hotel_history_modified_at ON hotel_history(modified_at);
```

## 7. 数据库设计说明

### 7.1 设计原则

1. **规范化**: 所有表使用 UUID 作为主键，避免自增ID的分布式问题
2. **一致性**: 统一使用 TIMESTAMP WITH TIME ZONE 存储时间
3. **可扩展性**: 使用 JSONB 类型存储灵活数据（如 address_component、changes）
4. **性能优化**: 合理创建索引，避免全表扫描
5. **数据完整性**: 使用外键约束和唯一约束保证数据一致性
6. **软删除**: 重要数据（如酒店）使用 status 字段标记状态，而非物理删除

### 7.2 特殊说明

1. **用户不具有虚拟形象**: users 表不包含 avatar 字段，用户资料仅存储昵称
2. **地址标准化**: 使用 formatted_address + address_component 结构，符合高德地图 API 标准
3. **价格结构**: hotel_prices 表支持多房型不同价格，每个酒店可以有多个房型价格记录
4. **审核流程**: 酒店状态从 draft → pending → auditing → approved/rejected → published → offline，audit_logs 表记录每次审核
5. **历史记录**: hotel_history 表记录每次修改，changes 字段使用 JSONB 存储变更内容
6. **权限控制**: 通过 role 字段区分商户和管理员，created_by 和 auditor_id 关联到 users 表
7. **全文搜索**: 使用 PostgreSQL 的 gin 索引支持酒店名称中文搜索