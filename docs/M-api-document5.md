# 手机端 API 接口文档 - 预订确认页和支付页

## 目录

- [基础信息](#基础信息)
- [预订确认页API](#预订确认页API)
- [支付页API](#支付页API)
- [错误码](#错误码)

## 1. 基础信息

- 基础URL: `http://localhost:{PORT}`
- 认证方式: Bearer Token（所有接口需在请求头中携带 `Authorization: Bearer {token}`）
- 字符集: UTF-8
- 时区: UTC

## 2. 预订确认页API

### 2.1 获取预订信息

**接口地址:** `GET /mobile/bookings/confirm/{booking_token}`

**描述:** 获取预订确认页所需的完整信息，包括酒店详情、房型信息、价格明细等

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| booking_token | string | 是 | 预订令牌（从酒店详情页传递） |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |

**响应示例:**
```json
{
  "code": 0,
  "msg": "获取成功",
  "data": {
    "booking_token": "booking_123456",
    "hotel_info": {
      "hotel_id": "hotel_001",
      "hotel_name": "易宿酒店",
      "hotel_address": "北京市朝阳区建国路88号",
      "main_image_url": "https://example.com/hotel1.jpg"
    },
    "room_info": {
      "room_type_id": "room_002",
      "room_name": "豪华大床房",
      "bed_type": "king",
      "area": 35,
      "max_occupancy": 2
    },
    "booking_info": {
      "check_in": "2026-02-01",
      "check_out": "2026-02-02",
      "nights": 1,
      "room_count": 1
    },
    "guest_info": {
      "name": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com"
    },
    "price_details": {
      "room_price": 299,
      "service_fee": 20,
      "tax": 15,
      "discount": 50,
      "total": 284
    },
    "price_breakdown": [
      {
        "item": "房费",
        "amount": 299,
        "type": "charge"
      },
      {
        "item": "服务费",
        "amount": 20,
        "type": "charge"
      },
      {
        "item": "税费",
        "amount": 15,
        "type": "charge"
      },
      {
        "item": "新人优惠",
        "amount": 50,
        "type": "discount"
      }
    ],
    "policies": {
      "booking_terms": "https://example.com/terms",
      "cancellation_policy": "入住前1天18:00前取消可免费退款",
      "cancellation_url": "https://example.com/cancellation"
    },
    "remark": "",
    "agreed": false
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| booking_token | string | 预订令牌 |
| hotel_info | object | 酒店信息 |
| room_info | object | 房型信息 |
| booking_info | object | 预订日期信息 |
| guest_info | object | 入住人信息 |
| price_details | object | 价格详情 |
| price_breakdown | array | 价格明细 |
| policies | object | 政策信息 |
| remark | string | 备注信息 |
| agreed | boolean | 是否已同意协议 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |
| 4010 | 房型不存在 |
| 4018 | 预订令牌无效或已过期 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/bookings/confirm/booking_123456" \
  -H "Authorization: Bearer {token}"
```

---

### 2.2 验证入住人信息

**接口地址:** `POST /mobile/bookings/validate-guest`

**描述:** 验证入住人信息格式是否正确

**请求参数:** 无

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "name": "张三",
  "phone": "13800138000"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 入住人姓名 |
| phone | string | 是 | 入住人手机号 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "验证成功",
  "data": {
    "valid": true,
    "errors": []
  }
}
```

**响应示例（验证失败）:**
```json
{
  "code": 400,
  "msg": "验证失败",
  "data": {
    "valid": false,
    "errors": [
      {
        "field": "phone",
        "message": "请输入正确的手机号"
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| valid | boolean | 是否验证通过 |
| errors | array | 错误信息列表 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 400 | 请求参数错误 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/bookings/validate-guest" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "张三", "phone": "13800138000"}'
```

---

### 2.3 提交预订订单

**接口地址:** `POST /mobile/bookings/submit`

**描述:** 提交预订订单并进入支付流程

**请求参数:** 无

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "booking_token": "booking_123456",
  "guest_info": {
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com"
  },
  "remark": "需要高楼层，安静的房间",
  "agreed": true
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| booking_token | string | 是 | 预订令牌 |
| guest_info | object | 是 | 入住人信息 |
| guest_info.name | string | 是 | 入住人姓名 |
| guest_info.phone | string | 是 | 入住人手机号 |
| guest_info.email | string | 否 | 入住人邮箱 |
| remark | string | 否 | 备注信息 |
| agreed | boolean | 是 | 是否已同意协议 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "提交成功",
  "data": {
    "booking_id": "booking_001",
    "order_number": "YS202602010001",
    "total_amount": 284,
    "payment_url": "/mobile/payments/booking_001",
    "payment_expire": 900,
    "message": "订单提交成功，请在15分钟内完成支付"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| booking_id | string | 预订ID |
| order_number | string | 订单编号 |
| total_amount | number | 总金额 |
| payment_url | string | 支付页面URL |
| payment_expire | number | 支付过期时间（秒） |
| message | string | 提示信息 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 400 | 请求参数错误 |
| 4018 | 预订令牌无效或已过期 |
| 4019 | 未同意协议 |
| 4012 | 预订失败，请稍后重试 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/bookings/submit" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"booking_token": "booking_123456", "guest_info": {"name": "张三", "phone": "13800138000"}, "remark": "需要高楼层", "agreed": true}'
```

---

## 3. 支付页API

### 3.1 获取支付信息

**接口地址:** `GET /mobile/payments/{booking_id}/info`

**描述:** 获取支付页面所需信息，包括订单概览、支付方式、倒计时等

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| booking_id | string | 是 | 预订ID（从预订确认页传递） |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |

**响应示例:**
```json
{
  "code": 0,
  "msg": "获取成功",
  "data": {
    "booking_id": "booking_001",
    "order_number": "YS202602010001",
    "order_info": {
      "hotel_name": "易宿酒店",
      "room_name": "豪华大床房",
      "check_in": "2026-02-01",
      "check_out": "2026-02-02",
      "nights": 1
    },
    "payment_info": {
      "total_amount": 284,
      "currency": "CNY",
      "expire_time": "2026-01-20T11:00:00Z",
      "remaining_seconds": 900,
      "status": "pending"
    },
    "payment_methods": [
      {
        "id": "wechat",
        "name": "微信支付",
        "icon": "wechat.png",
        "selected": false
      },
      {
        "id": "alipay",
        "name": "支付宝支付",
        "icon": "alipay.png",
        "selected": false
      }
    ],
    "order_url": "/mobile/bookings/booking_001",
    "home_url": "/mobile/home"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| booking_id | string | 预订ID |
| order_number | string | 订单编号 |
| order_info | object | 订单基本信息 |
| payment_info | object | 支付信息 |
| payment_methods | array | 支付方式列表 |
| order_url | string | 订单详情页面URL |
| home_url | string | 首页URL |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 订单不存在 |
| 4020 | 订单状态不支持支付 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/payments/booking_001/info" \
  -H "Authorization: Bearer {token}"
```

---

### 3.2 选择支付方式

**接口地址:** `POST /mobile/payments/{booking_id}/select-method`

**描述:** 选择支付方式

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| booking_id | string | 是 | 预订ID |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "payment_method": "wechat"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| payment_method | string | 是 | 支付方式：wechat（微信支付）, alipay（支付宝支付） |

**响应示例:**
```json
{
  "code": 0,
  "msg": "选择成功",
  "data": {
    "booking_id": "booking_001",
    "payment_method": "wechat",
    "payment_method_name": "微信支付",
    "selected": true
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| booking_id | string | 预订ID |
| payment_method | string | 支付方式 |
| payment_method_name | string | 支付方式名称 |
| selected | boolean | 是否选择成功 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 订单不存在 |
| 4021 | 支付方式无效 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/payments/booking_001/select-method" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"payment_method": "wechat"}'
```

---

### 3.3 发起支付

**接口地址:** `POST /mobile/payments/{booking_id}/create`

**描述:** 发起支付请求，获取支付链接或参数

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| booking_id | string | 是 | 预订ID |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "payment_method": "wechat"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| payment_method | string | 是 | 支付方式：wechat（微信支付）, alipay（支付宝支付） |

**响应示例:**
```json
{
  "code": 0,
  "msg": "发起支付成功",
  "data": {
    "booking_id": "booking_001",
    "payment_method": "wechat",
    "payment_url": "weixin://wxpay/bizpayurl?pr=123456",
    "payment_params": {
      "appid": "wx1234567890",
      "partnerid": "1234567890",
      "prepayid": "wx201410272009395522657a690389285100",
      "noncestr": "1add1a30ac87aa2db72f57a2375d8fec",
      "timestamp": "1414353553",
      "sign": "0CB01533B8C1EF103065174F50BCA001"
    },
    "expire_time": "2026-01-20T11:00:00Z",
    "message": "请跳转至微信完成支付"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| booking_id | string | 预订ID |
| payment_method | string | 支付方式 |
| payment_url | string | 支付链接 |
| payment_params | object | 支付参数 |
| expire_time | string | 支付过期时间 |
| message | string | 提示信息 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 订单不存在 |
| 4021 | 支付方式无效 |
| 4022 | 支付发起失败 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/payments/booking_001/create" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"payment_method": "wechat"}'
```

---

### 3.4 查询支付状态

**接口地址:** `GET /mobile/payments/{booking_id}/status`

**描述:** 查询支付状态

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| booking_id | string | 是 | 预订ID |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |

**响应示例（支付成功）:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "booking_id": "booking_001",
    "status": "success",
    "status_text": "支付成功",
    "paid_at": "2026-01-20T10:50:30Z",
    "payment_method": "wechat",
    "next_url": "/mobile/payments/success"
  }
}
```

**响应示例（支付失败）:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "booking_id": "booking_001",
    "status": "failed",
    "status_text": "支付失败",
    "error_message": "余额不足",
    "payment_method": "wechat",
    "retry_url": "/mobile/payments/booking_001/retry"
  }
}
```

**响应示例（支付中）:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "booking_id": "booking_001",
    "status": "pending",
    "status_text": "支付处理中",
    "remaining_seconds": 600,
    "message": "请稍后刷新查看支付结果"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| booking_id | string | 预订ID |
| status | string | 支付状态：pending（处理中）, success（成功）, failed（失败）, cancelled（已取消） |
| status_text | string | 状态文本 |
| paid_at | string | 支付时间（成功时返回） |
| payment_method | string | 支付方式 |
| next_url | string | 下一步页面URL |
| error_message | string | 错误信息（失败时返回） |
| retry_url | string | 重试支付页面URL（失败时返回） |
| remaining_seconds | number | 剩余支付时间（处理中时返回） |
| message | string | 提示信息 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 订单不存在 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/payments/booking_001/status" \
  -H "Authorization: Bearer {token}"
```

---

### 3.5 取消支付

**接口地址:** `POST /mobile/payments/{booking_id}/cancel`

**描述:** 取消支付

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| booking_id | string | 是 | 预订ID |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "reason": "用户取消支付"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| reason | string | 否 | 取消原因 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "取消成功",
  "data": {
    "booking_id": "booking_001",
    "status": "cancelled",
    "status_text": "支付已取消",
    "cancelled_at": "2026-01-20T10:55:00Z",
    "return_url": "/mobile/hotels/hotel_001/detail"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| booking_id | string | 预订ID |
| status | string | 订单状态 |
| status_text | string | 状态文本 |
| cancelled_at | string | 取消时间 |
| return_url | string | 返回页面URL |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 订单不存在 |
| 4023 | 订单状态不支持取消 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/payments/booking_001/cancel" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"reason": "用户取消支付"}'
```

---

## 4. 错误码

### 4.1 通用错误码

| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 503 | 服务暂时不可用 |

### 4.2 业务错误码

| 错误码 | 说明 |
|--------|------|
| 4006 | 酒店/订单不存在 |
| 4010 | 房型不存在 |
| 4012 | 预订失败，请稍后重试 |
| 4018 | 预订令牌无效或已过期 |
| 4019 | 未同意协议 |
| 4020 | 订单状态不支持支付 |
| 4021 | 支付方式无效 |
| 4022 | 支付发起失败 |
| 4023 | 订单状态不支持取消 |

### 4.3 输入验证错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 3001 | 手机号格式不正确 |

### 4.4 支付错误码

| 错误码 | 说明 |
|--------|------|
| 5001 | 支付超时 |
| 5002 | 支付金额不匹配 |
| 5003 | 支付渠道错误 |
| 5004 | 支付账户异常 |
