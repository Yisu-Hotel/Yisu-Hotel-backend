# TapBuddy API 接口文档

## 文档说明

本文档描述 TapBuddy 后端 API 接口规范。

**Base URL**: `http://localhost:8080/api/v1`

**通用响应格式**:

成功响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

错误响应：
```json
{
  "code": 1001,
  "message": "错误描述",
  "data": null
}
```

**认证方式**: 使用 Bearer Token (JWT)

```
Authorization: Bearer <token>
```

---

## 目录

1. [NFC 标签解析](#1-nfc-标签解析)
2. [用户认证](#2-用户认证)
3. [用户资料](#3-用户资料)
4. [空间管理](#4-空间管理)
5. [空间成员](#5-空间成员)
6. [空间公告](#6-空间公告)
7. [内容/帖子](#7-内容帖子)
8. [勋章系统](#8-勋章系统)
9. [联系方式交换](#9-联系方式交换)
10. [举报系统](#10-举报系统)

---

## 1. NFC 标签解析

### 1.1 解析 NFC 标签

**接口名称**: 解析 NFC 标签并获取目标信息

**路径**: `/nfc/resolve`

**方法**: `GET`

**请求参数** (Query):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| tag_id | string | 是 | NFC 标签的唯一标识 |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "tag_id": "NFC1234567890",
    "target_type": "space",
    "target_id": "550e8400-e29b-41d4-a716-446655440000",
    "space_name": "27-508 寝室",
    "space_type": "dorm",
    "short_link": "https://tapbuddy.app/s/abc123"
  }
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| target_type | string | 目标类型：space（空间）、contact_exchange（交换名片）、custom（自定义） |
| target_id | string | 目标对象的 ID，如空间 ID |
| space_name | string | 空间名称（仅当 target_type=space 时返回） |
| space_type | string | 空间类型：dorm（寝室）、activity（活动） |
| short_link | string | 二维码备用短链接 |

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 2001 | NFC 标签不存在 |
| 2002 | NFC 标签已停用 |

**curl 示例**:
```bash
curl -X GET "http://localhost:8080/api/v1/nfc/resolve?tag_id=NFC1234567890"
```

---

## 2. 用户认证

### 2.1 发送验证码

**接口名称**: 发送登录验证码到手机

**路径**: `/auth/send-code`

**方法**: `POST`

**请求体**:
```json
{
  "phone": "13800138000"
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号，11 位数字 |

**响应示例**:
```json
{
  "code": 0,
  "message": "验证码已发送",
  "data": {
    "expires_in": 300
  }
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| expires_in | int | 验证码有效期（秒） |

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 3001 | 手机号格式不正确 |
| 3002 | 验证码发送频率限制 |

**curl 示例**:
```bash
curl -X POST "http://localhost:8080/api/v1/auth/send-code" \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000"}'
```

---

### 2.2 手机号登录/注册

**接口名称**: 使用手机号验证码登录或注册

**路径**: `/auth/login`

**方法**: `POST`

**请求体**:
```json
{
  "phone": "13800138000",
  "code": "123456",
  "agreed": true
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号 |
| code | string | 是 | 验证码，6 位数字 |
| agreed | boolean | 是 | 是否同意用户协议与隐私政策 |

**响应示例**（首次登录）:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phone": "13800138000",
      "is_first_time": true
    }
  }
}
```

**响应示例**（已有用户）:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phone": "13800138000",
      "profile": {
        "nickname": "张三",
        "avatar": "https://cdn.tapbuddy.app/avatars/default.png"
      },
      "is_first_time": false
    }
  }
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| token | string | JWT 认证令牌 |
| user | object | 用户信息 |
| user.id | string | 用户 ID（UUID） |
| user.phone | string | 手机号 |
| user.profile | object | 用户资料（仅非首次登录时返回） |
| user.is_first_time | boolean | 是否首次登录（需要建档） |

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 3003 | 验证码错误或已过期 |
| 3004 | 未同意用户协议 |

**curl 示例**:
```bash
curl -X POST "http://localhost:8080/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000", "code": "123456", "agreed": true}'
```

---

### 2.3 学号统一认证登录

**接口名称**: 使用学号和密码登录

**路径**: `/auth/login/student`

**方法**: `POST`

**请求体**:
```json
{
  "student_id": "2023001",
  "password": "password123",
  "agreed": true
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| student_id | string | 是 | 学号 |
| password | string | 是 | 密码 |
| agreed | boolean | 是 | 是否同意用户协议与隐私政策 |

**响应**: 同手机号登录

**curl 示例**:
```bash
curl -X POST "http://localhost:8080/api/v1/auth/login/student" \
  -H "Content-Type: application/json" \
  -d '{"student_id": "2023001", "password": "password123", "agreed": true}'
```

---

## 3. 用户资料

### 3.1 完成首次建档

**接口名称**: 首次登录后完善个人资料

**路径**: `/profile/complete`

**方法**: `POST`

**认证**: 需要登录

**请求体**:
```json
{
  "nickname": "张三",
  "avatar": "https://cdn.tapbuddy.app/avatars/user123.png",
  "department": "计算机学院",
  "major": "软件工程",
  "grade": "2023 级",
  "interest_tags": ["篮球", "摄影", "旅行", "编程"],
  "bio": "热爱技术的计算机专业学生"
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| nickname | string | 是 | 昵称，2-50 个字符 |
| avatar | string | 否 | 头像 URL |
| department | string | 否 | 院系 |
| major | string | 否 | 专业 |
| grade | string | 否 | 年级 |
| interest_tags | string[] | 是 | 兴趣标签数组，至少 3 个 |
| bio | string | 否 | 个人简介 |

**响应示例**:
```json
{
  "code": 0,
  "message": "建档成功",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "profile_complete": true
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 4001 | 昵称不能为空 |
| 4002 | 兴趣标签至少选择 3 个 |

**curl 示例**:
```bash
curl -X POST "http://localhost:8080/api/v1/profile/complete" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "nickname": "张三",
    "interest_tags": ["篮球", "摄影", "旅行"]
  }'
```

---

### 3.2 获取个人空间信息

**接口名称**: 获取用户个人空间资料（支持查看他人）

**路径**: `/profile/:user_id`

**方法**: `GET`

**认证**:
- 查看自己：需要登录
- 查看他人：需要登录，且受隐私设置控制

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| user_id | string | 用户 ID |

**响应示例**（查看自己的完整信息）:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nickname": "张三",
      "avatar": "https://cdn.tapbuddy.app/avatars/user123.png",
      "department": "计算机学院",
      "major": "软件工程",
      "grade": "2023 级",
      "interest_tags": ["篮球", "摄影", "旅行"],
      "bio": "热爱技术的计算机专业学生"
    },
    "contact": {
      "phone": "138****8000",
      "wechat": "未公开",
      "email": "未公开",
      "extra_links": {
        "github": "https://github.com/zhangsan",
        "blog": "https://zhangsan.blog.com"
      }
    },
    "badges": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "name": "迎新晚会参与者",
        "icon": "https://cdn.tapbuddy.app/badges/party.png",
        "collected_at": "2024-01-15T10:30:00Z"
      }
    ],
    "is_owner": true
  }
}
```

**响应示例**（查看他人，受隐私控制）:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nickname": "张三",
      "avatar": "https://cdn.tapbuddy.app/avatars/user123.png",
      "department": "计算机学院",
      "major": "软件工程",
      "grade": "2023 级",
      "interest_tags": ["篮球", "摄影", "旅行"],
      "bio": "热爱技术的计算机专业学生"
    },
    "contact": {
      "phone": "未公开",
      "wechat": "未公开",
      "email": "未公开",
      "extra_links": {
        "github": "https://github.com/zhangsan"
      }
    },
    "badges": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "name": "迎新晚会参与者",
        "icon": "https://cdn.tapbuddy.app/badges/party.png",
        "collected_at": "2024-01-15T10:30:00Z"
      }
    ],
    "is_owner": false,
    "exchanged": false
  }
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| contact | object | 联系方式（根据隐私设置决定是否显示） |
| contact.extra_links | object | 扩展链接（JSON 对象），根据隐私设置决定显示哪些字段 |
| badges | array | 勋章列表 |
| is_owner | boolean | 是否查看自己的资料 |
| exchanged | boolean | 是否已交换联系方式（仅查看他人时有此字段） |

**curl 示例**:
```bash
curl -X GET "http://localhost:8080/api/v1/profile/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3.3 更新个人资料

**接口名称**: 更新个人资料

**路径**: `/profile`

**方法**: `PUT`

**认证**: 需要登录

**请求体**:
```json
{
  "nickname": "李四",
  "avatar": "https://cdn.tapbuddy.app/avatars/new.png",
  "department": "信息学院",
  "major": "计算机科学",
  "grade": "2022 级",
  "interest_tags": ["编程", "阅读"],
  "bio": "新的简介"
}
```

**所有字段均为可选，只更新提供的字段**

**响应示例**:
```json
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nickname": "李四",
    "avatar": "https://cdn.tapbuddy.app/avatars/new.png",
    "department": "信息学院",
    "major": "计算机科学",
    "grade": "2022 级",
    "interest_tags": ["编程", "阅读"],
    "bio": "新的简介"
  }
}
```

**curl 示例**:
```bash
curl -X PUT "http://localhost:8080/api/v1/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"nickname": "李四", "interest_tags": ["编程", "阅读"]}'
```

---

### 3.4 更新联系方式

**接口名称**: 更新联系方式

**路径**: `/profile/contact`

**方法**: `PUT`

**认证**: 需要登录

**请求体**:
```json
{
  "phone": "13900139000",
  "wechat": "wx_id_123",
  "email": "user@example.com",
  "extra_links": {
    "github": "https://github.com/zhangsan",
    "blog": "https://zhangsan.blog.com",
    "linkedin": "https://linkedin.com/in/zhangsan"
  }
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 否 | 手机号 |
| wechat | string | 否 | 微信号 |
| email | string | 否 | 邮箱地址 |
| extra_links | object | 否 | 扩展链接对象，支持任意键值对 |

**所有字段均为可选，只更新提供的字段**

**extra_links 说明**：
- extra_links 是一个 JSON 对象，可以包含任意数量的键值对
- 键名建议使用小写字母和下划线，如：`github`、`personal_blog`、`wechat_mp`
- 要删除某个扩展链接，可将该字段设置为 `null`
- 示例：`{"github": "https://github.com/user", "blog": null}` 会更新 GitHub 链接并删除博客链接

**响应示例**:
```json
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "phone": "139****9000",
    "wechat": "wx_id_123",
    "email": "user@example.com",
    "extra_links": {
      "github": "https://github.com/zhangsan",
      "blog": "https://zhangsan.blog.com",
      "linkedin": "https://linkedin.com/in/zhangsan"
    }
  }
}
```

**curl 示例**:
```bash
# 更新基本联系方式
curl -X PUT "http://localhost:8080/api/v1/profile/contact" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"phone": "13900139000", "wechat": "wx_id_123"}'

# 更新扩展链接
curl -X PUT "http://localhost:8080/api/v1/profile/contact" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "extra_links": {
      "github": "https://github.com/zhangsan",
      "blog": "https://zhangsan.blog.com"
    }
  }'

# 删除某个扩展链接
curl -X PUT "http://localhost:8080/api/v1/profile/contact" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"extra_links": {"blog": null}}'
```

---

### 3.5 更新隐私设置

**接口名称**: 更新隐私设置

**路径**: `/profile/privacy`

**方法**: `PUT`

**认证**: 需要登录

**请求体**:
```json
{
  "phone_visibility": "member",
  "wechat_visibility": "exchanged",
  "email_visibility": "private",
  "profile_visibility": "school"
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| phone_visibility | string | 手机号可见范围：private/school/member/exchanged/public |
| wechat_visibility | string | 微信可见范围 |
| email_visibility | string | 邮箱可见范围 |
| profile_visibility | string | 名片可见范围 |

**所有字段均为可选**

**响应示例**:
```json
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "phone_visibility": "member",
    "wechat_visibility": "exchanged",
    "email_visibility": "private",
    "profile_visibility": "school"
  }
}
```

**curl 示例**:
```bash
curl -X PUT "http://localhost:8080/api/v1/profile/privacy" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"phone_visibility": "member"}'
```

---

## 4. 空间管理

### 4.1 获取空间详情

**接口名称**: 获取空间详细信息

**路径**: `/spaces/:space_id`

**方法**: `GET`

**认证**:
- 未登录：可查看空间基本信息
- 已登录：根据成员状态查看更多内容

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |

**响应示例**（未加入成员）:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "27-508 寝室",
    "type": "dorm",
    "description": "快乐的 508 寝室",
    "cover_image": "https://cdn.tapbuddy.app/covers/dorm508.jpg",
    "location": "27 号楼 508 室",
    "member_count": 5,
    "max_members": 50,
    "is_member": false
  }
}
```

**响应示例**（已加入成员）:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "27-508 寝室",
    "type": "dorm",
    "description": "快乐的 508 寝室",
    "cover_image": "https://cdn.tapbuddy.app/covers/dorm508.jpg",
    "location": "27 号楼 508 室",
    "member_count": 5,
    "max_members": 50,
    "status": "active",
    "event_time": null,
    "creator": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nickname": "寝室长"
    },
    "is_member": true,
    "role": "member",
    "announcements": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440000",
        "content": "欢迎来到 508 寝室！",
        "pinned": true,
        "created_at": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| type | string | 空间类型：dorm（寝室）、activity（活动） |
| status | string | 空间状态：active（活跃中）、ended（已结束）、archived（已归档） |
| event_time | string | 活动时间（仅活动空间） |
| is_member | boolean | 当前用户是否为成员 |
| role | string | 用户角色：member（成员）、admin（管理员） |

**curl 示例**:
```bash
curl -X GET "http://localhost:8080/api/v1/spaces/770e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4.2 获取我的空间列表

**接口名称**: 获取当前用户加入的空间列表

**路径**: `/spaces/my`

**方法**: `GET`

**认证**: 需要登录

**请求参数** (Query):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 筛选空间类型：dorm/activity |
| page | int | 否 | 页码，默认 1 |
| page_size | int | 否 | 每页数量，默认 20 |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 2,
    "page": 1,
    "page_size": 20,
    "spaces": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "name": "27-508 寝室",
        "type": "dorm",
        "cover_image": "https://cdn.tapbuddy.app/covers/dorm508.jpg",
        "member_count": 5,
        "role": "member",
        "joined_at": "2024-01-01T10:00:00Z"
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440000",
        "name": "迎新晚会",
        "type": "activity",
        "cover_image": "https://cdn.tapbuddy.app/covers/party.jpg",
        "member_count": 120,
        "event_time": "2024-01-20T19:00:00Z",
        "role": "member",
        "joined_at": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

**curl 示例**:
```bash
curl -X GET "http://localhost:8080/api/v1/spaces/my?type=dorm&page=1&page_size=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 5. 空间成员

### 5.1 申请加入空间（寝室）

**接口名称**: 申请加入寝室空间

**路径**: `/spaces/:space_id/members`

**方法**: `POST`

**认证**: 需要登录

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |

**请求体**:
```json
{
  "reason": "我是住在这个寝室的"
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| reason | string | 否 | 申请理由（寝室空间需要） |

**响应示例**:
```json
{
  "code": 0,
  "message": "申请已提交，等待管理员审核",
  "data": {
    "request_id": "990e8400-e29b-41d4-a716-446655440000",
    "status": "pending"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 5001 | 已经是成员 |
| 5002 | 申请待审核中 |
| 5003 | 空间成员已满 |

**curl 示例**:
```bash
curl -X POST "http://localhost:8080/api/v1/spaces/770e8400-e29b-41d4-a716-446655440000/members" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"reason": "我是住在这个寝室的"}'
```

---

### 5.2 获取空间成员列表

**接口名称**: 获取空间的成员列表

**路径**: `/spaces/:space_id/members`

**方法**: `GET`

**认证**: 需要登录且是空间成员

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |

**请求参数** (Query):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| page_size | int | 否 | 每页数量，默认 20 |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 5,
    "page": 1,
    "page_size": 20,
    "members": [
      {
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "nickname": "张三",
        "avatar": "https://cdn.tapbuddy.app/avatars/user1.png",
        "role": "admin",
        "joined_at": "2024-01-01T10:00:00Z"
      },
      {
        "user_id": "660e8400-e29b-41d4-a716-446655440000",
        "nickname": "李四",
        "avatar": "https://cdn.tapbuddy.app/avatars/user2.png",
        "role": "member",
        "joined_at": "2024-01-02T10:00:00Z"
      }
    ]
  }
}
```

**curl 示例**:
```bash
curl -X GET "http://localhost:8080/api/v1/spaces/770e8400-e29b-41d4-a716-446655440000/members?page=1&page_size=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 5.3 审核加入申请（管理员）

**接口名称**: 审核用户的加入申请

**路径**: `/spaces/:space_id/members/:request_id`

**方法**: `PUT`

**认证**: 需要登录且是空间管理员

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |
| request_id | string | 申请记录 ID |

**请求体**:
```json
{
  "action": "approve"
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| action | string | 是 | 操作：approve（同意）、reject（拒绝） |

**响应示例**:
```json
{
  "code": 0,
  "message": "已同意加入申请",
  "data": {
    "user_id": "660e8400-e29b-41d4-a716-446655440000",
    "status": "approved"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 5101 | 无权限操作 |
| 5102 | 申请不存在或已处理 |

**curl 示例**:
```bash
curl -X PUT "http://localhost:8080/api/v1/spaces/770e8400-e29b-41d4-a716-446655440000/members/990e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"action": "approve"}'
```

---

### 5.4 移除空间成员（管理员）

**接口名称**: 移除空间成员

**路径**: `/spaces/:space_id/members/:user_id`

**方法**: `DELETE`

**认证**: 需要登录且是空间管理员

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |
| user_id | string | 被移除的用户 ID |

**响应示例**:
```json
{
  "code": 0,
  "message": "成员已移除",
  "data": null
}
```

**curl 示例**:
```bash
curl -X DELETE "http://localhost:8080/api/v1/spaces/770e8400-e29b-41d4-a716-446655440000/members/660e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 5.5 设置管理员（管理员）

**接口名称**: 设置或取消成员的管理员权限

**路径**: `/spaces/:space_id/members/:user_id/role`

**方法**: `PUT`

**认证**: 需要登录且是空间管理员

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |
| user_id | string | 目标用户 ID |

**请求体**:
```json
{
  "role": "admin"
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| role | string | 是 | 角色：admin（管理员）、member（普通成员） |

**响应示例**:
```json
{
  "code": 0,
  "message": "角色已更新",
  "data": {
    "user_id": "660e8400-e29b-41d4-a716-446655440000",
    "role": "admin"
  }
}
```

**curl 示例**:
```bash
curl -X PUT "http://localhost:8080/api/v1/spaces/770e8400-e29b-41d4-a716-446655440000/members/660e8400-e29b-41d4-a716-446655440000/role" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"role": "admin"}'
```

---

## 6. 空间公告

### 6.1 创建公告（管理员）

**接口名称**: 在空间内发布公告

**路径**: `/spaces/:space_id/announcements`

**方法**: `POST`

**认证**: 需要登录且是空间管理员

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |

**请求体**:
```json
{
  "content": "本周六晚上有寝室聚餐活动",
  "pinned": true
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| content | string | 是 | 公告内容 |
| pinned | boolean | 否 | 是否置顶，默认 false |

**响应示例**:
```json
{
  "code": 0,
  "message": "公告已发布",
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440000",
    "content": "本周六晚上有寝室聚餐活动",
    "pinned": true,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**curl 示例**:
```bash
curl -X POST "http://localhost:8080/api/v1/spaces/770e8400-e29b-41d4-a716-446655440000/announcements" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"content": "本周六晚上有寝室聚餐活动", "pinned": true}'
```

---

### 6.2 获取空间公告列表

**接口名称**: 获取空间的公告列表

**路径**: `/spaces/:space_id/announcements`

**方法**: `GET`

**认证**: 需要登录且是空间成员

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 2,
    "announcements": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440000",
        "content": "本周六晚上有寝室聚餐活动",
        "pinned": true,
        "created_at": "2024-01-15T10:00:00Z",
        "author": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "nickname": "寝室长"
        }
      },
      {
        "id": "bb0e8400-e29b-41d4-a716-446655440000",
        "content": "欢迎新成员！",
        "pinned": false,
        "created_at": "2024-01-14T10:00:00Z",
        "author": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "nickname": "寝室长"
        }
      }
    ]
  }
}
```

**curl 示例**:
```bash
curl -X GET "http://localhost:8080/api/v1/spaces/770e8400-e29b-41d4-a716-446655440000/announcements" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 6.3 删除公告（管理员）

**接口名称**: 删除空间公告

**路径**: `/spaces/:space_id/announcements/:announcement_id`

**方法**: `DELETE`

**认证**: 需要登录且是空间管理员

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |
| announcement_id | string | 公告 ID |

**响应示例**:
```json
{
  "code": 0,
  "message": "公告已删除",
  "data": null
}
```

**curl 示例**:
```bash
curl -X DELETE "http://localhost:8080/api/v1/spaces/770e8400-e29b-41d4-a716-446655440000/announcements/aa0e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 7. 内容/帖子

### 7.1 发布内容

**接口名称**: 在空间内发布内容（图文）

**路径**: `/spaces/:space_id/posts`

**方法**: `POST`

**认证**: 需要登录且是空间成员

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |

**请求体**:
```json
{
  "content": "今天参加活动很开心！",
  "images": [
    "https://cdn.tapbuddy.app/posts/img1.jpg",
    "https://cdn.tapbuddy.app/posts/img2.jpg"
  ]
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| content | string | 否 | 文字内容，最多 500 字（与 images 至少一个） |
| images | string[] | 否 | 图片 URL 数组，最多 9 张 |

**响应示例**:
```json
{
  "code": 0,
  "message": "发布成功",
  "data": {
    "id": "cc0e8400-e29b-41d4-a716-446655440000",
    "content": "今天参加活动很开心！",
    "images": [
      "https://cdn.tapbuddy.app/posts/img1.jpg",
      "https://cdn.tapbuddy.app/posts/img2.jpg"
    ],
    "created_at": "2024-01-15T10:00:00Z",
    "author": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nickname": "张三",
      "avatar": "https://cdn.tapbuddy.app/avatars/user1.png"
    }
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 7001 | 内容和图片至少需要一个 |
| 7002 | 内容包含敏感词 |
| 7003 | 图片数量超过限制 |

**curl 示例**:
```bash
curl -X POST "http://localhost:8080/api/v1/spaces/770e8400-e29b-41d4-a716-446655440000/posts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"content": "今天参加活动很开心！"}'
```

---

### 7.2 获取空间内容列表

**接口名称**: 获取空间的内容墙（帖子列表）

**路径**: `/spaces/:space_id/posts`

**方法**: `GET`

**认证**: 需要登录且是空间成员

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |

**请求参数** (Query):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| page_size | int | 否 | 每页数量，默认 20 |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 50,
    "page": 1,
    "page_size": 20,
    "posts": [
      {
        "id": "cc0e8400-e29b-41d4-a716-446655440000",
        "content": "今天参加活动很开心！",
        "images": [
          "https://cdn.tapbuddy.app/posts/img1.jpg"
        ],
        "created_at": "2024-01-15T10:00:00Z",
        "author": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "nickname": "张三",
          "avatar": "https://cdn.tapbuddy.app/avatars/user1.png"
        }
      }
    ]
  }
}
```

**curl 示例**:
```bash
curl -X GET "http://localhost:8080/api/v1/spaces/770e8400-e29b-41d4-a716-446655440000/posts?page=1&page_size=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 7.3 删除内容

**接口名称**: 删除自己发布的内容（软删除）

**路径**: `/posts/:post_id`

**方法**: `DELETE`

**认证**: 需要登录且是内容作者或空间管理员

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| post_id | string | 帖子 ID |

**响应示例**:
```json
{
  "code": 0,
  "message": "内容已删除",
  "data": null
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 7101 | 无权限删除此内容 |

**curl 示例**:
```bash
curl -X DELETE "http://localhost:8080/api/v1/posts/cc0e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 8. 勋章系统

### 8.1 获取活动空间的勋章列表

**接口名称**: 获取活动空间内的所有勋章

**路径**: `/spaces/:space_id/badges`

**方法**: `GET`

**认证**: 需要登录

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| space_id | string | 空间 ID |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "badges": [
      {
        "id": "dd0e8400-e29b-41d4-a716-446655440000",
        "name": "迎新晚会参与者",
        "description": "参加 2024 年迎新晚会的纪念勋章",
        "icon": "https://cdn.tapbuddy.app/badges/party.png",
        "max_quantity": 200,
        "collected_count": 50,
        "status": "active",
        "start_time": "2024-01-15T00:00:00Z",
        "end_time": "2024-01-20T23:59:59Z",
        "is_collected": false
      }
    ]
  }
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| max_quantity | int | 最大领取数量，null 表示无限制 |
| collected_count | int | 已领取数量 |
| is_collected | boolean | 当前用户是否已领取 |

**curl 示例**:
```bash
curl -X GET "http://localhost:8080/api/v1/spaces/880e8400-e29b-41d4-a716-446655440000/badges" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 8.2 领取勋章

**接口名称**: 领取活动空间的勋章

**路径**: `/badges/:badge_id/collect`

**方法**: `POST`

**认证**: 需要登录

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| badge_id | string | 勋章 ID |

**请求体**:
```json
{
  "verification_code": "ABC123"
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| verification_code | string | 是 | 验证码（防刷机制） |

**响应示例**:
```json
{
  "code": 0,
  "message": "领取成功",
  "data": {
    "user_badge_id": "ee0e8400-e29b-41d4-a716-446655440000",
    "badge_id": "dd0e8400-e29b-41d4-a716-446655440000",
    "collected_at": "2024-01-15T10:30:00Z"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 8001 | 验证码错误 |
| 8002 | 勋章已领取 |
| 8003 | 勋章已领完 |
| 8004 | 不在领取时间内 |

**curl 示例**:
```bash
curl -X POST "http://localhost:8080/api/v1/badges/dd0e8400-e29b-41d4-a716-446655440000/collect" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"verification_code": "ABC123"}'
```

---

### 8.3 获取我的勋章

**接口名称**: 获取当前用户已领取的所有勋章

**路径**: `/profile/badges`

**方法**: `GET`

**认证**: 需要登录

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 3,
    "badges": [
      {
        "id": "dd0e8400-e29b-41d4-a716-446655440000",
        "name": "迎新晚会参与者",
        "icon": "https://cdn.tapbuddy.app/badges/party.png",
        "description": "参加 2024 年迎新晚会的纪念勋章",
        "collected_at": "2024-01-15T10:30:00Z",
        "space_name": "迎新晚会"
      }
    ]
  }
}
```

**curl 示例**:
```bash
curl -X GET "http://localhost:8080/api/v1/profile/badges" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 9. 联系方式交换

### 9.1 发起交换请求

**接口名称**: 发起联系方式交换请求

**路径**: `/contact-exchange/initiate`

**方法**: `POST`

**认证**: 需要登录

**请求体**:
```json
{
  "target_user_id": "660e8400-e29b-41d4-a716-446655440000",
  "authorized_fields": ["phone", "wechat", "github"]
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| target_user_id | string | 是 | 目标用户 ID |
| authorized_fields | string[] | 是 | 本次愿意提供的字段 |

**authorized_fields 支持的字段**：
- **基本字段**：`phone`（手机号）、`wechat`（微信）、`email`（邮箱）
- **扩展字段**（来自 extra_links）：`github`、`blog`、`linkedin`、`homepage` 等，可自定义任意键名

**响应示例**:
```json
{
  "code": 0,
  "message": "交换请求已发起",
  "data": {
    "request_id": "ff0e8400-e29b-41d4-a716-446655440000",
    "exchange_code": "123456",
    "expires_at": "2024-01-15T10:32:00Z",
    "expires_in": 120
  }
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| exchange_code | string | 6 位交换确认码 |
| expires_at | string | 过期时间（ISO 8601） |
| expires_in | int | 剩余秒数 |

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 9001 | 不能与自己交换 |
| 9002 | 已经交换过联系方式 |
| 9003 | 发起频率过高 |
| 9004 | 授权字段包含无效值 |

**curl 示例**:
```bash
# 交换基本联系方式
curl -X POST "http://localhost:8080/api/v1/contact-exchange/initiate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"target_user_id": "660e8400-e29b-41d4-a716-446655440000", "authorized_fields": ["phone", "wechat"]}'

# 包含扩展链接的交换
curl -X POST "http://localhost:8080/api/v1/contact-exchange/initiate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"target_user_id": "660e8400-e29b-41d4-a716-446655440000", "authorized_fields": ["phone", "github", "blog"]}'
```

---

### 9.2 确认交换

**接口名称**: 确认并接受联系方式交换

**路径**: `/contact-exchange/confirm`

**方法**: `POST`

**认证**: 需要登录

**请求体**:
```json
{
  "exchange_code": "123456",
  "authorized_fields": ["phone", "email", "github"]
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| exchange_code | string | 是 | 6 位交换确认码 |
| authorized_fields | string[] | 是 | 本次愿意提供的字段，支持基本字段和扩展字段 |

**响应示例**（包含扩展链接）:
```json
{
  "code": 0,
  "message": "交换成功",
  "data": {
    "exchange_id": "001e8400-e29b-41d4-a716-446655440000",
    "exchanged_fields": ["phone", "wechat", "github", "blog"],
    "my_fields": ["phone", "email", "github"],
    "their_fields": ["phone", "wechat", "blog"],
    "exchanged_at": "2024-01-15T10:31:00Z",
    "peer": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "nickname": "张三",
      "phone": "138****8000",
      "wechat": "wx_id_123",
      "email": "未公开",
      "extra_links": {
        "github": "https://github.com/zhangsan",
        "blog": "https://zhangsan.blog.com"
      }
    }
  }
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| exchanged_fields | string[] | 实际交换的字段（双方授权的交集） |
| my_fields | string[] | 我方提供的字段 |
| their_fields | string[] | 对方提供的字段 |
| peer | object | 对方信息和联系方式 |
| peer.extra_links | object | 对方的扩展链接（仅包含交换授权的字段） |

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 9101 | 交换码不存在 |
| 9102 | 交换码已过期 |
| 9103 | 交换码已使用 |
| 9104 | 授权字段包含无效值 |

**curl 示例**:
```bash
# 交换基本联系方式
curl -X POST "http://localhost:8080/api/v1/contact-exchange/confirm" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"exchange_code": "123456", "authorized_fields": ["phone", "email"]}'

# 包含扩展链接的交换
curl -X POST "http://localhost:8080/api/v1/contact-exchange/confirm" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"exchange_code": "123456", "authorized_fields": ["phone", "github", "blog"]}'
```

---

### 9.3 查询交换请求状态

**接口名称**: 查询交换请求的当前状态

**路径**: `/contact-exchange/status/:request_id`

**方法**: `GET`

**认证**: 需要登录

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| request_id | string | 请求 ID |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "request_id": "ff0e8400-e29b-41d4-a716-446655440000",
    "status": "pending",
    "expires_at": "2024-01-15T10:32:00Z",
    "target_user": {
      "user_id": "660e8400-e29b-41d4-a716-446655440000",
      "nickname": "李四",
      "avatar": "https://cdn.tapbuddy.app/avatars/user2.png"
    }
  }
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| status | string | 请求状态：pending（待确认）、accepted（已接受）、rejected（已拒绝）、expired（已过期） |

**curl 示例**:
```bash
curl -X GET "http://localhost:8080/api/v1/contact-exchange/status/ff0e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 9.4 获取我的交换记录

**接口名称**: 获取当前用户的所有交换记录

**路径**: `/contact-exchange/my`

**方法**: `GET`

**认证**: 需要登录

**请求参数** (Query):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| page_size | int | 否 | 每页数量，默认 20 |

**响应示例**（包含扩展链接）:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 5,
    "page": 1,
    "page_size": 20,
    "exchanges": [
      {
        "exchange_id": "001e8400-e29b-41d4-a716-446655440000",
        "exchanged_fields": ["phone", "wechat", "github"],
        "exchanged_at": "2024-01-15T10:31:00Z",
        "peer": {
          "user_id": "660e8400-e29b-41d4-a716-446655440000",
          "nickname": "李四",
          "avatar": "https://cdn.tapbuddy.app/avatars/user2.png",
          "phone": "139****9000",
          "wechat": "wx_id_456",
          "email": "未公开",
          "extra_links": {
            "github": "https://github.com/lisi"
          }
        }
      }
    ]
  }
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| exchanged_fields | string[] | 实际交换的字段列表，可能包含扩展字段 |
| peer | object | 对方的联系信息 |
| peer.extra_links | object | 对方的扩展链接（仅包含已交换的字段） |

**curl 示例**:
```bash
curl -X GET "http://localhost:8080/api/v1/contact-exchange/my?page=1&page_size=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 10. 举报系统

### 10.1 提交举报

**接口名称**: 举报用户、帖子或空间

**路径**: `/reports`

**方法**: `POST`

**认证**: 需要登录

**请求体**:
```json
{
  "target_type": "post",
  "target_id": "cc0e8400-e29b-41d4-a716-446655440000",
  "reason": "inappropriate",
  "description": "内容包含不当言论"
}
```

**字段说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| target_type | string | 是 | 被举报对象类型：user/post/space |
| target_id | string | 是 | 被举报对象的 ID |
| reason | string | 是 | 举报原因：harassment（骚扰）/spam（垃圾信息）/inappropriate（不当内容）/fake_info（虚假信息）/other（其他） |
| description | string | 否 | 详细描述 |

**响应示例**:
```json
{
  "code": 0,
  "message": "举报已提交",
  "data": {
    "report_id": "112e8400-e29b-41d4-a716-446655440000",
    "status": "pending",
    "created_at": "2024-01-15T10:35:00Z"
  }
}
```

**curl 示例**:
```bash
curl -X POST "http://localhost:8080/api/v1/reports" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"target_type": "post", "target_id": "cc0e8400-e29b-41d4-a716-446655440000", "reason": "inappropriate", "description": "内容包含不当言论"}'
```

---

## 错误码总表

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1000 | 系统错误 |
| 1001 | 参数错误 |
| 1002 | 未登录 |
| 1003 | 无权限 |
| 1004 | 资源不存在 |
| 2001 | NFC 标签不存在 |
| 2002 | NFC 标签已停用 |
| 3001 | 手机号格式不正确 |
| 3002 | 验证码发送频率限制 |
| 3003 | 验证码错误或已过期 |
| 3004 | 未同意用户协议 |
| 4001 | 昵称不能为空 |
| 4002 | 兴趣标签至少选择 3 个 |
| 5001 | 已经是成员 |
| 5002 | 申请待审核中 |
| 5003 | 空间成员已满 |
| 5101 | 无权限操作 |
| 5102 | 申请不存在或已处理 |
| 7001 | 内容和图片至少需要一个 |
| 7002 | 内容包含敏感词 |
| 7003 | 图片数量超过限制 |
| 7101 | 无权限删除此内容 |
| 8001 | 验证码错误 |
| 8002 | 勋章已领取 |
| 8003 | 勋章已领完 |
| 8004 | 不在领取时间内 |
| 9001 | 不能与自己交换 |
| 9002 | 已经交换过联系方式 |
| 9003 | 发起频率过高 |
| 9101 | 交换码不存在 |
| 9102 | 交换码已过期 |
| 9103 | 交换码已使用 |

---

## 附录

### A. 分页规范

所有列表接口支持分页，参数如下：

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | int | 否 | 1 | 页码，从 1 开始 |
| page_size | int | 否 | 20 | 每页数量，最大 100 |

### B. 时间格式

所有时间字段使用 ISO 8601 格式（UTC 时区）：

```
2024-01-15T10:30:00Z
```

### C. UUID 格式

所有 ID 字段使用 UUID v4 格式：

```
550e8400-e29b-41d4-a716-446655440000
```

### D. 图片上传

图片上传需先调用文件上传接口获取 URL，本接口文档中未包含文件上传相关接口，建议使用第三方对象存储服务（如阿里云 OSS、腾讯云 COS）。

---

## MVP 版本说明

MVP 阶段暂时不实现以下功能：

1. **黑名单功能**（blocked_users 表相关）
2. **内容审核后台**（reports 状态管理）
3. **空间归档**（spaces.status = 'archived'）
4. **学号统一认证登录**（仅实现手机号验证码登录）

后续版本将逐步完善以上功能。
