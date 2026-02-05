# 手机端 API 接口文档

## 目录

- [基础信息](#基础信息)
- [注册管理](#注册管理)
- [第三方登录/注册](#第三方登录注册)
- [用户信息](#用户信息)
- [收藏管理](#收藏管理)
- [酒店预订](#酒店预订)
- [优惠管理](#优惠管理)

## 1. 基础信息

- 基础URL: `http://localhost:{PORT}`
- 认证方式: Bearer Token（登录后的接口需在请求头中携带 `Authorization: Bearer {token}`）
- 字符集: UTF-8
- 时区: UTC

## 2. 注册管理

### 2.1 发送验证码

**接口地址:** `POST /mobile/auth/send-code`

**描述:** 发送手机验证码（60秒冷却）

**请求参数:** 无

**请求体:**
```json
{
  "phone": "13800138000"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号，11位数字 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "验证码已发送",
  "data": {
    "expires_in": 60
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| expires_in | int | 验证码有效期（秒） |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 3001 | 手机号格式不正确 |
| 3002 | 验证码发送频率限制（60秒内只能发送一次） |
| 3007 | 验证码发送失败，请稍后重试 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/auth/send-code" \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000"}'
```

---

### 2.2 校验手机号

**接口地址:** `POST /mobile/auth/check-phone`

**描述:** 校验手机号是否已注册

**请求参数:** 无

**请求体:**
```json
{
  "phone": "13800138000"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号，11位数字 |

**响应示例（手机号可用）:**
```json
{
  "code": 0,
  "msg": "手机号可用",
  "data": {
    "available": true
  }
}
```

**响应示例（手机号已注册）:**
```json
{
  "code": 0,
  "msg": "该手机号已注册，请直接登录",
  "data": {
    "available": false
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| available | boolean | 手机号是否可用，true 表示可用，false 表示已被注册 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 3001 | 手机号格式不正确 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/auth/check-phone" \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000"}'
```

---

### 2.3 手机号注册

**接口地址:** `POST /mobile/auth/register`

**描述:** 手机号注册（验证码+密码+协议）

**请求参数:** 无

**请求体:**
```json
{
  "phone": "13800138000",
  "code": "123456",
  "password": "abc123456",
  "agreed": true
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号，11位数字 |
| code | string | 是 | 验证码，6位数字 |
| password | string | 是 | 密码，6-16位字符，包含数字+字母 |
| agreed | boolean | 是 | 是否同意用户协议与隐私政策 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phone": "13800138000",
      "role": "mobile",
      "is_new_user": true
    },
    "promotions": [
      {
        "id": "promo_001",
        "title": "新人立减 10 元",
        "description": "首次预订可享新人立减 10 元",
        "discount": 10,
        "valid_until": "2026-03-31T23:59:59Z"
      }
    ],
    "quick_access": [
      {
        "id": "profile",
        "title": "完善个人信息",
        "icon": "user",
        "path": "/mobile/profile/edit"
      },
      {
        "id": "favorites",
        "title": "查看我的收藏",
        "icon": "heart",
        "path": "/mobile/favorites/list"
      },
      {
        "id": "booking",
        "title": "开始预订酒店",
        "icon": "hotel",
        "path": "/mobile/hotels/search"
      }
    ],
    "buttons": [
      {
        "id": "home",
        "title": "进入首页",
        "path": "/mobile/hotels/search"
      },
      {
        "id": "profile",
        "title": "进入个人中心",
        "path": "/mobile/profile"
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| token | string | JWT 认证令牌 |
| user | object | 用户信息 |
| user.id | string | 用户ID（UUID） |
| user.phone | string | 手机号 |
| user.role | string | 角色：mobile（手机端用户） |
| user.is_new_user | boolean | 是否新用户，true 表示首次注册 |
| promotions | array | 优惠信息列表 |
| promotions[].id | string | 优惠ID |
| promotions[].title | string | 优惠标题 |
| promotions[].description | string | 优惠描述 |
| promotions[].discount | number | 优惠金额 |
| promotions[].valid_until | string | 优惠有效期 |
| quick_access | array | 快捷入口列表 |
| quick_access[].id | string | 入口ID |
| quick_access[].title | string | 入口标题 |
| quick_access[].icon | string | 入口图标 |
| quick_access[].path | string | 跳转路径 |
| buttons | array | 跳转按钮列表 |
| buttons[].id | string | 按钮ID |
| buttons[].title | string | 按钮标题 |
| buttons[].path | string | 跳转路径 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 3001 | 手机号格式不正确 |
| 3003 | 验证码错误或已过期 |
| 3004 | 未同意用户协议 |
| 3005 | 手机号已注册 |
| 3006 | 密码格式不正确 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000", "code": "123456", "password": "abc123456", "agreed": true}'
```

## 3. 第三方注册/登录

### 3.1 微信注册/登录

**接口地址:** `POST /mobile/auth/wechat-login`

**描述:** 微信授权注册/登录（跳转至微信授权页面，授权完成后自动完成注册并登录）

**请求参数:** 无

**请求体:**
```json
{
  "open_id": "oXXXX-XXXX-XXXX-XXXX-XXXXX",
  "nickname": "张三"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| open_id | string | 是 | 微信开放ID |
| nickname | string | 否 | 昵称 |

**响应示例（首次登录/注册）:**
```json
{
  "code": 0,
  "msg": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phone": "13800138000",
      "open_id": "oXXXX-XXXX-XXXX-XXXX-XXXXX",
      "role": "mobile",
      "is_first_time": true,
      "is_new_user": true,
      "profile": {
        "nickname": "张三"
      }
    },
    "promotions": [
      {
        "id": "promo_001",
        "title": "新人立减 10 元",
        "description": "首次预订可享新人立减 10 元",
        "discount": 10,
        "valid_until": "2026-03-31T23:59:59Z"
      }
    ],
    "quick_access": [
      {
        "id": "profile",
        "title": "完善个人信息",
        "icon": "user",
        "path": "/mobile/profile/edit"
      },
      {
        "id": "favorites",
        "title": "查看我的收藏",
        "icon": "heart",
        "path": "/mobile/favorites/list"
      },
      {
        "id": "booking",
        "title": "开始预订酒店",
        "icon": "hotel",
        "path": "/mobile/hotels/search"
      }
    ],
    "buttons": [
      {
        "id": "home",
        "title": "进入首页",
        "path": "/mobile/hotels/search"
      },
      {
        "id": "profile",
        "title": "进入个人中心",
        "path": "/mobile/profile"
      }
    ]
  }
}
```

**响应示例（再次登录）:**
```json
{
  "code": 0,
  "msg": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phone": "13800138000",
      "open_id": "oXXXX-XXXX-XXXX-XXXX-XXXXX",
      "role": "mobile",
      "is_first_time": false,
      "is_new_user": false,
      "profile": {
        "nickname": "张三"
      }
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| token | string | JWT 认证令牌 |
| user | object | 用户信息 |
| user.id | string | 用户ID（UUID） |
| user.phone | string | 手机号 |
| user.open_id | string | 微信开放ID |
| user.role | string | 角色：mobile（手机端用户） |
| user.is_first_time | boolean | 是否首次登录，true 表示首次，false 表示再次登录 |
| user.is_new_user | boolean | 是否新用户，true 表示首次注册 |
| user.profile | object | 用户资料 |
| user.profile.nickname | string | 昵称 |
| promotions | array | 优惠信息列表（仅首次注册返回） |
| promotions[].id | string | 优惠ID |
| promotions[].title | string | 优惠标题 |
| promotions[].description | string | 优惠描述 |
| promotions[].discount | number | 优惠金额 |
| promotions[].valid_until | string | 优惠有效期 |
| quick_access | array | 快捷入口列表（仅首次注册返回） |
| quick_access[].id | string | 入口ID |
| quick_access[].title | string | 入口标题 |
| quick_access[].icon | string | 入口图标 |
| quick_access[].path | string | 跳转路径 |
| buttons | array | 跳转按钮列表（仅首次注册返回） |
| buttons[].id | string | 按钮ID |
| buttons[].title | string | 按钮标题 |
| buttons[].path | string | 跳转路径 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 3008 | 第三方授权失败，请重新尝试 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/auth/wechat-login" \
  -H "Content-Type: application/json" \
  -d '{"open_id": "oXXXX-XXXX-XXXX-XXXX-XXXXX", "nickname": "张三"}'
```

---

### 3.2 支付宝注册/登录

**接口地址:** `POST /mobile/auth/alipay-login`

**描述:** 支付宝授权注册/登录（跳转至支付宝授权页面，授权完成后自动完成注册并登录）

**请求参数:** 无

**请求体:**
```json
{
  "auth_code": "auth_code_xxxxx",
  "nickname": "李四"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| auth_code | string | 是 | 支付宝授权码 |
| nickname | string | 否 | 昵称 |

**响应示例（首次登录/注册）:**
```json
{
  "code": 0,
  "msg": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phone": "13800138000",
      "auth_code": "auth_code_xxxxx",
      "role": "mobile",
      "is_first_time": true,
      "is_new_user": true,
      "profile": {
        "nickname": "李四"
      }
    },
    "promotions": [
      {
        "id": "promo_001",
        "title": "新人立减 10 元",
        "description": "首次预订可享新人立减 10 元",
        "discount": 10,
        "valid_until": "2026-03-31T23:59:59Z"
      }
    ],
    "quick_access": [
      {
        "id": "profile",
        "title": "完善个人信息",
        "icon": "user",
        "path": "/mobile/profile/edit"
      },
      {
        "id": "favorites",
        "title": "查看我的收藏",
        "icon": "heart",
        "path": "/mobile/favorites/list"
      },
      {
        "id": "booking",
        "title": "开始预订酒店",
        "icon": "hotel",
        "path": "/mobile/hotels/search"
      }
    ],
    "buttons": [
      {
        "id": "home",
        "title": "进入首页",
        "path": "/mobile/hotels/search"
      },
      {
        "id": "profile",
        "title": "进入个人中心",
        "path": "/mobile/profile"
      }
    ]
  }
}
```

**响应示例（再次登录）:**
```json
{
  "code": 0,
  "msg": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phone": "13800138000",
      "auth_code": "auth_code_xxxxx",
      "role": "mobile",
      "is_first_time": false,
      "is_new_user": false,
      "profile": {
        "nickname": "李四"
      }
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| token | string | JWT 认证令牌 |
| user | object | 用户信息 |
| user.id | string | 用户ID（UUID） |
| user.phone | string | 手机号 |
| user.auth_code | string | 支付宝授权码 |
| user.role | string | 角色：mobile（手机端用户） |
| user.is_first_time | boolean | 是否首次登录，true 表示首次，false 表示再次登录 |
| user.is_new_user | boolean | 是否新用户，true 表示首次注册 |
| user.profile | object | 用户资料 |
| user.profile.nickname | string | 昵称 |
| promotions | array | 优惠信息列表（仅首次注册返回） |
| promotions[].id | string | 优惠ID |
| promotions[].title | string | 优惠标题 |
| promotions[].description | string | 优惠描述 |
| promotions[].discount | number | 优惠金额 |
| promotions[].valid_until | string | 优惠有效期 |
| quick_access | array | 快捷入口列表（仅首次注册返回） |
| quick_access[].id | string | 入口ID |
| quick_access[].title | string | 入口标题 |
| quick_access[].icon | string | 入口图标 |
| quick_access[].path | string | 跳转路径 |
| buttons | array | 跳转按钮列表（仅首次注册返回） |
| buttons[].id | string | 按钮ID |
| buttons[].title | string | 按钮标题 |
| buttons[].path | string | 跳转路径 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 3008 | 第三方授权失败，请重新尝试 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/auth/alipay-login" \
  -H "Content-Type: application/json" \
  -d '{"auth_code": "auth_code_xxxxx", "nickname": "李四"}'
```

## 4. 用户信息

### 4.1 获取用户信息

**接口地址:** `GET /mobile/user/info`

**描述:** 获取当前登录用户的详细信息

**请求参数:** 无

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
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phone": "13800138000",
    "role": "mobile",
    "profile": {
      "nickname": "张三",
      "gender": "男",
      "birthday": "1990-01-01"
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 用户ID（UUID） |
| phone | string | 手机号 |
| role | string | 角色：mobile（手机端用户） |
| profile | object | 用户资料 |
| profile.nickname | string | 昵称 |
| profile.gender | string | 性别 |
| profile.birthday | string | 生日 |
| created_at | string | 创建时间 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/user/info" \
  -H "Authorization: Bearer {token}"
```

---

### 4.2 更新用户信息

**接口地址:** `PUT /mobile/user/update`

**描述:** 更新用户个人资料信息

**请求参数:** 无

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |

**请求体:**
```json
{
  "nickname": "张三",
  "gender": "男",
  "birthday": "1990-01-01"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| nickname | string | 否 | 昵称 |
| gender | string | 否 | 性别（男/女） |
| birthday | string | 否 | 生日（YYYY-MM-DD） |

**响应示例:**
```json
{
  "code": 0,
  "msg": "更新成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phone": "13800138000",
    "role": "mobile",
    "profile": {
      "nickname": "张三",
      "gender": "男",
      "birthday": "1990-01-01"
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 用户ID（UUID） |
| phone | string | 手机号 |
| role | string | 角色：mobile（手机端用户） |
| profile | object | 更新后的用户资料 |
| profile.nickname | string | 昵称 |
| profile.gender | string | 性别 |
| profile.birthday | string | 生日 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 400 | 请求参数错误 |

**curl 示例:**
```bash
curl -X PUT "http://localhost:{PORT}/mobile/user/update" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"nickname": "张三", "gender": "男", "birthday": "1990-01-01"}'
```

## 5. 收藏管理

### 5.1 获取收藏列表

**接口地址:** `GET /mobile/favorites/list`

**描述:** 获取用户收藏的酒店列表

**请求参数:** 无

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
    "favorites": [
      {
        "id": "fav_001",
        "hotel_id": "hotel_001",
        "hotel_name": "如家酒店",
        "hotel_address": "北京市朝阳区建国路88号",
        "hotel_star": 3,
        "min_price": 299,
        "image_url": "https://example.com/hotel1.jpg",
        "collected_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 1
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| favorites | array | 收藏列表 |
| favorites[].id | string | 收藏ID |
| favorites[].hotel_id | string | 酒店ID |
| favorites[].hotel_name | string | 酒店名称 |
| favorites[].hotel_address | string | 酒店地址 |
| favorites[].hotel_star | number | 酒店星级 |
| favorites[].min_price | number | 最低价格 |
| favorites[].image_url | string | 酒店图片URL |
| favorites[].collected_at | string | 收藏时间 |
| total | number | 总收藏数 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/favorites/list" \
  -H "Authorization: Bearer {token}"
```

## 6. 酒店预订

### 6.1 搜索酒店

**接口地址:** `GET /mobile/hotels/search`

**描述:** 搜索酒店（首页酒店查询）

**请求参数:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| city | string | 否 | 城市 |
| check_in | string | 否 | 入住日期（YYYY-MM-DD） |
| check_out | string | 否 | 离店日期（YYYY-MM-DD） |
| min_price | number | 否 | 最低价格 |
| max_price | number | 否 | 最高价格 |
| star | number | 否 | 酒店星级 |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |

**响应示例:**
```json
{
  "code": 0,
  "msg": "搜索成功",
  "data": {
    "hotels": [
      {
        "id": "hotel_001",
        "name": "如家酒店",
        "address": "北京市朝阳区建国路88号",
        "star": 3,
        "min_price": 299,
        "image_url": "https://example.com/hotel1.jpg",
        "distance": "2.5km",
        "rating": 4.5
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 20
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotels | array | 酒店列表 |
| hotels[].id | string | 酒店ID |
| hotels[].name | string | 酒店名称 |
| hotels[].address | string | 酒店地址 |
| hotels[].star | number | 酒店星级 |
| hotels[].min_price | number | 最低价格 |
| hotels[].image_url | string | 酒店图片URL |
| hotels[].distance | string | 距离 |
| hotels[].rating | number | 评分 |
| total | number | 总酒店数 |
| page | number | 当前页码 |
| page_size | number | 每页大小 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/search?city=北京&check_in=2024-01-01&check_out=2024-01-02" \
  -H "Authorization: Bearer {token}"
```

## 7. 优惠管理

### 7.1 获取新人优惠

**接口地址:** `GET /mobile/promotions/new-user`

**描述:** 获取新用户专属优惠

**请求参数:** 无

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
    "promotions": [
      {
        "id": "promo_001",
        "title": "新人立减 10 元",
        "description": "首次预订可享新人立减 10 元",
        "discount": 10,
        "valid_until": "2026-03-31T23:59:59Z",
        "rules": "1. 仅限首次预订使用\n2. 适用于所有酒店\n3. 不可与其他优惠叠加"
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| promotions | array | 新人优惠列表 |
| promotions[].id | string | 优惠ID |
| promotions[].title | string | 优惠标题 |
| promotions[].description | string | 优惠描述 |
| promotions[].discount | number | 优惠金额 |
| promotions[].valid_until | string | 优惠有效期 |
| promotions[].rules | string | 优惠规则 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/promotions/new-user" \
  -H "Authorization: Bearer {token}"
```