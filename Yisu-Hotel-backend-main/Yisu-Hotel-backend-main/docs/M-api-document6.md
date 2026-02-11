# 移动端酒店相关API文档

## 目录

- [1. 酒店搜索](#1-酒店搜索)
- [2. 酒店详情](#2-酒店详情)
- [3. 酒店图片](#3-酒店图片)
- [4. 酒店可用性](#4-酒店可用性)
- [5. 价格计算](#5-价格计算)
- [6. 房型管理](#6-房型管理)
- [7. 预订管理](#7-预订管理)
- [8. 收藏管理](#8-收藏管理)
- [9. 分享功能](#9-分享功能)

## 1. 酒店搜索

### 1.1 搜索酒店

**接口地址:** `GET /mobile/hotels/search`

**描述:** 根据条件搜索酒店

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| city | string | 否 | 城市名称 |
| check_in | string | 否 | 入住日期 (YYYY-MM-DD) |
| check_out | string | 否 | 离店日期 (YYYY-MM-DD) |
| guests | int | 否 | 入住人数 |
| min_price | int | 否 | 最低价格 |
| max_price | int | 否 | 最高价格 |
| star_rating | int | 否 | 星级评分 |
| facilities | string | 否 | 设施ID，多个用逗号分隔 |
| sort_by | string | 否 | 排序方式: price_asc (价格升序), 默认按创建时间降序 |
| page | int | 否 | 页码，默认 1 |
| size | int | 否 | 每页数量，默认 20 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "搜索成功",
  "data": {
    "total": 100,
    "page": 1,
    "size": 20,
    "list": [
      {
        "id": "hotel_001",
        "name": "易宿酒店北京王府井店",
        "star": 4,
        "rating": 4.5,
        "address": "北京市东城区王府井大街88号",
        "distance": 1.2,
        "description": "位于北京市中心的豪华酒店，交通便利，设施齐全",
        "main_image_url": "https://example.com/hotel1.jpg",
        "min_price": 399,
        "facilities": [
          { "id": 1, "name": "免费WiFi" },
          { "id": 2, "name": "停车场" }
        ],
        "services": [
          { "id": 1, "name": "24小时前台" },
          { "id": 2, "name": "行李寄存" }
        ]
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| total | int | 总酒店数 |
| page | int | 当前页码 |
| size | int | 每页大小 |
| list | array | 酒店列表 |
| list[].id | string | 酒店ID |
| list[].name | string | 酒店名称 |
| list[].star | int | 酒店星级 |
| list[].rating | number | 酒店评分 |
| list[].address | string | 酒店地址 |
| list[].distance | number | 距离（公里） |
| list[].description | string | 酒店描述 |
| list[].main_image_url | string | 酒店主图片URL |
| list[].min_price | int | 最低价格 |
| list[].facilities | array | 酒店设施 |
| list[].services | array | 酒店服务 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 500 | 服务器内部错误 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/search?city=北京&min_price=200&max_price=500&page=1&size=20" 
```

## 2. 酒店详情

### 2.1 获取酒店详情

**接口地址:** `GET /mobile/hotels/:hotel_id`

**描述:** 获取酒店详细信息

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID（路径参数） |
| check_in | string | 否 | 入住日期 (YYYY-MM-DD) |
| check_out | string | 否 | 离店日期 (YYYY-MM-DD) |

**响应示例:**
```json
{
  "code": 0,
  "msg": "获取成功",
  "data": {
    "id": "hotel_001",
    "name": "易宿酒店北京王府井店",
    "star": 4,
    "rating": 4.5,
    "address": "北京市东城区王府井大街88号",
    "distance": 1.2,
    "description": "位于北京市中心的豪华酒店，交通便利，设施齐全",
    "main_image_url": "https://example.com/hotel1.jpg",
    "min_price": 399,
    "facilities": [
      { "id": 1, "name": "免费WiFi" },
      { "id": 2, "name": "停车场" }
    ],
    "services": [
      { "id": 1, "name": "24小时前台" },
      { "id": 2, "name": "行李寄存" }
    ],
    "policies": [
      { "id": 1, "type": "check_in", "value": "14:00后" },
      { "id": 2, "type": "check_out", "value": "12:00前" },
      { "id": 3, "type": "cancellation", "value": "入住前24小时可免费取消" }
    ],
    "reviews": [
      {
        "id": "review_001",
        "user_id": "user_001",
        "user_name": "匿名用户",
        "rating": 5,
        "content": "酒店位置很好，服务态度也不错",
        "created_at": "2026-02-01T10:00:00Z"
      }
    ],
    "check_in": "2026-02-10",
    "check_out": "2026-02-12"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 酒店ID |
| name | string | 酒店名称 |
| star | int | 酒店星级 |
| rating | number | 酒店评分 |
| address | string | 酒店地址 |
| distance | number | 距离（公里） |
| description | string | 酒店描述 |
| main_image_url | string | 酒店主图片URL |
| min_price | int | 最低价格 |
| facilities | array | 酒店设施 |
| services | array | 酒店服务 |
| policies | array | 酒店政策 |
| reviews | array | 酒店评价 |
| check_in | string | 入住日期 |
| check_out | string | 离店日期 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 404 | 酒店不存在 |
| 500 | 服务器内部错误 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001?check_in=2026-02-10&check_out=2026-02-12" 
```

## 3. 酒店图片

### 3.1 获取酒店图片列表

**接口地址:** `GET /mobile/hotels/:hotel_id/images`

**描述:** 获取酒店图片列表

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID（路径参数） |
| type | string | 否 | 图片类型: exterior (外观), lobby (大堂), room (客房), restaurant (餐厅), facility (设施) |

**响应示例:**
```json
{
  "code": 0,
  "msg": "获取成功",
  "data": [
    {
      "id": 1,
      "url": "https://example.com/hotel-exterior.jpg",
      "type": "exterior",
      "order": 1
    },
    {
      "id": 2,
      "url": "https://example.com/hotel-lobby.jpg",
      "type": "lobby",
      "order": 2
    }
  ]
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 图片ID |
| url | string | 图片URL |
| type | string | 图片类型 |
| order | int | 排序顺序 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 500 | 服务器内部错误 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001/images?type=room" 
```

## 4. 酒店可用性

### 4.1 获取可用日期和价格

**接口地址:** `GET /mobile/hotels/:hotel_id/availability`

**描述:** 获取酒店可用日期和价格

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID（路径参数） |
| start_date | string | 是 | 开始日期 (YYYY-MM-DD) |
| end_date | string | 是 | 结束日期 (YYYY-MM-DD) |

**响应示例:**
```json
{
  "code": 0,
  "msg": "获取成功",
  "data": {
    "hotel_id": "hotel_001",
    "start_date": "2026-02-10",
    "end_date": "2026-02-15",
    "availability": [
      {
        "date": "2026-02-10",
        "available": true,
        "price": 399
      },
      {
        "date": "2026-02-11",
        "available": true,
        "price": 399
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| start_date | string | 开始日期 |
| end_date | string | 结束日期 |
| availability | array | 可用性列表 |
| availability[].date | string | 日期 |
| availability[].available | boolean | 是否可用 |
| availability[].price | int | 价格 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 400 | 请提供开始日期和结束日期 |
| 500 | 服务器内部错误 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001/availability?start_date=2026-02-10&end_date=2026-02-15" 
```

## 5. 价格计算

### 5.1 计算价格

**接口地址:** `POST /mobile/hotels/:hotel_id/calculate-price`

**描述:** 计算酒店预订价格

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID（路径参数） |

**请求体:**
```json
{
  "check_in": "2026-02-10",
  "check_out": "2026-02-12",
  "room_type_id": "room_001",
  "guests": 2
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| check_in | string | 是 | 入住日期 (YYYY-MM-DD) |
| check_out | string | 是 | 离店日期 (YYYY-MM-DD) |
| room_type_id | string | 是 | 房型ID |
| guests | int | 是 | 入住人数 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "计算成功",
  "data": {
    "hotel_id": "hotel_001",
    "room_type_id": "room_001",
    "check_in": "2026-02-10",
    "check_out": "2026-02-12",
    "nights": 2,
    "guests": 2,
    "price_details": {
      "room_price": 399,
      "total_room_price": 798,
      "service_fee": 80,
      "tax": 48,
      "grand_total": 926
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| room_type_id | string | 房型ID |
| check_in | string | 入住日期 |
| check_out | string | 离店日期 |
| nights | int | 入住天数 |
| guests | int | 入住人数 |
| price_details | object | 价格详情 |
| price_details.room_price | int | 基础房价 |
| price_details.total_room_price | int | 总房价 |
| price_details.service_fee | int | 服务费 |
| price_details.tax | int | 税费 |
| price_details.grand_total | int | 总价 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 400 | 请提供完整的预订信息 |
| 500 | 服务器内部错误 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/hotels/hotel_001/calculate-price" \
  -H "Content-Type: application/json" \
  -d '{"check_in": "2026-02-10", "check_out": "2026-02-12", "room_type_id": "room_001", "guests": 2}'
```

## 6. 房型管理

### 6.1 获取房型列表

**接口地址:** `GET /mobile/hotels/:hotel_id/room-types`

**描述:** 获取酒店房型列表

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID（路径参数） |
| check_in | string | 否 | 入住日期 (YYYY-MM-DD) |
| check_out | string | 否 | 离店日期 (YYYY-MM-DD) |

**响应示例:**
```json
{
  "code": 0,
  "msg": "获取成功",
  "data": [
    {
      "id": "room_001",
      "name": "标准间",
      "description": "舒适的标准间，配备一张大床或两张单人床",
      "bed_type": "大床",
      "area": 25,
      "max_guests": 2,
      "base_price": 399,
      "main_image_url": "https://example.com/standard-room.jpg",
      "facilities": [
        { "id": 1, "name": "免费WiFi" },
        { "id": 2, "name": "空调" }
      ],
      "services": [
        { "id": 1, "name": "24小时热水" },
        { "id": 2, "name": "洗漱用品" }
      ],
      "policies": [
        { "id": 1, "type": "check_in", "value": "14:00后" },
        { "id": 2, "type": "check_out", "value": "12:00前" }
      ]
    }
  ]
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 房型ID |
| name | string | 房型名称 |
| description | string | 房型描述 |
| bed_type | string | 床型 |
| area | int | 面积（平方米） |
| max_guests | int | 最大入住人数 |
| base_price | int | 基础价格 |
| main_image_url | string | 主图片URL |
| facilities | array | 设施列表 |
| services | array | 服务列表 |
| policies | array | 政策列表 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 500 | 服务器内部错误 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001/room-types?check_in=2026-02-10&check_out=2026-02-12" 
```

### 6.2 获取房型详情

**接口地址:** `GET /mobile/hotels/:hotel_id/room-types/:room_type_id`

**描述:** 获取房型详情

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID（路径参数） |
| room_type_id | string | 是 | 房型ID（路径参数） |
| check_in | string | 否 | 入住日期 (YYYY-MM-DD) |
| check_out | string | 否 | 离店日期 (YYYY-MM-DD) |

**响应示例:**
```json
{
  "code": 0,
  "msg": "获取成功",
  "data": {
    "id": "room_001",
    "name": "标准间",
    "description": "舒适的标准间，配备一张大床或两张单人床，房间面积25平方米，适合商务出行和休闲度假。",
    "bed_type": "大床",
    "area": 25,
    "max_guests": 2,
    "base_price": 399,
    "main_image_url": "https://example.com/standard-room.jpg",
    "facilities": [
      { "id": 1, "name": "免费WiFi" },
      { "id": 2, "name": "空调" }
    ],
    "services": [
      { "id": 1, "name": "24小时热水" },
      { "id": 2, "name": "洗漱用品" }
    ],
    "policies": [
      { "id": 1, "type": "check_in", "value": "14:00后" },
      { "id": 2, "type": "check_out", "value": "12:00前" }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 房型ID |
| name | string | 房型名称 |
| description | string | 房型描述 |
| bed_type | string | 床型 |
| area | int | 面积（平方米） |
| max_guests | int | 最大入住人数 |
| base_price | int | 基础价格 |
| main_image_url | string | 主图片URL |
| facilities | array | 设施列表 |
| services | array | 服务列表 |
| policies | array | 政策列表 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 500 | 服务器内部错误 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001/room-types/room_001?check_in=2026-02-10&check_out=2026-02-12" 
```

## 7. 预订管理

### 7.1 创建预订

**接口地址:** `POST /mobile/hotels/:hotel_id/bookings`

**描述:** 创建酒店预订

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID（路径参数） |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |

**请求体:**
```json
{
  "check_in": "2026-02-10",
  "check_out": "2026-02-12",
  "room_type_id": "room_001",
  "guests": 2,
  "contact_info": {
    "name": "张三",
    "phone": "13800138000"
  }
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| check_in | string | 是 | 入住日期 (YYYY-MM-DD) |
| check_out | string | 是 | 离店日期 (YYYY-MM-DD) |
| room_type_id | string | 是 | 房型ID |
| guests | int | 是 | 入住人数 |
| contact_info | object | 是 | 联系人信息 |
| contact_info.name | string | 是 | 联系人姓名 |
| contact_info.phone | string | 是 | 联系人电话 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "预订成功",
  "data": {
    "booking_id": "booking_123456",
    "hotel_id": "hotel_001",
    "hotel_name": "易宿酒店北京王府井店",
    "room_type_id": "room_001",
    "room_type_name": "标准间",
    "check_in": "2026-02-10",
    "check_out": "2026-02-12",
    "guests": 2,
    "total_price": 926,
    "status": "pending",
    "contact_info": {
      "name": "张三",
      "phone": "13800138000"
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| booking_id | string | 预订ID |
| hotel_id | string | 酒店ID |
| hotel_name | string | 酒店名称 |
| room_type_id | string | 房型ID |
| room_type_name | string | 房型名称 |
| check_in | string | 入住日期 |
| check_out | string | 离店日期 |
| guests | int | 入住人数 |
| total_price | int | 总价 |
| status | string | 状态: pending (待支付) |
| contact_info | object | 联系人信息 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 400 | 请提供完整的预订信息 |
| 401 | 未授权，请先登录 |
| 500 | 服务器内部错误 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/hotels/hotel_001/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"check_in": "2026-02-10", "check_out": "2026-02-12", "room_type_id": "room_001", "guests": 2, "contact_info": {"name": "张三", "phone": "13800138000"}}'
```

### 7.2 检查预订可用性

**接口地址:** `POST /mobile/hotels/:hotel_id/check-availability`

**描述:** 检查酒店预订可用性

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID（路径参数） |

**请求体:**
```json
{
  "check_in": "2026-02-10",
  "check_out": "2026-02-12",
  "room_type_id": "room_001",
  "guests": 2
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| check_in | string | 是 | 入住日期 (YYYY-MM-DD) |
| check_out | string | 是 | 离店日期 (YYYY-MM-DD) |
| room_type_id | string | 是 | 房型ID |
| guests | int | 是 | 入住人数 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "房间可用",
  "data": {
    "available": true,
    "remaining_rooms": 3,
    "hotel_id": "hotel_001",
    "room_type_id": "room_001",
    "check_in": "2026-02-10",
    "check_out": "2026-02-12",
    "guests": 2
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| available | boolean | 是否可用 |
| remaining_rooms | int | 剩余房间数 |
| hotel_id | string | 酒店ID |
| room_type_id | string | 房型ID |
| check_in | string | 入住日期 |
| check_out | string | 离店日期 |
| guests | int | 入住人数 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 400 | 请提供完整的预订信息 |
| 400 | 该房型最多可入住2人 |
| 500 | 服务器内部错误 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/hotels/hotel_001/check-availability" \
  -H "Content-Type: application/json" \
  -d '{"check_in": "2026-02-10", "check_out": "2026-02-12", "room_type_id": "room_001", "guests": 2}'
```

## 8. 收藏管理

### 8.1 收藏/取消收藏酒店

**接口地址:** `POST /mobile/hotels/:hotel_id/favorite`

**描述:** 收藏或取消收藏酒店

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID（路径参数） |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |

**响应示例:**
```json
{
  "code": 0,
  "msg": "收藏成功",
  "data": {
    "hotel_id": "hotel_001",
    "is_favorited": true,
    "favorite_count": 10
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| is_favorited | boolean | 是否已收藏 |
| favorite_count | int | 收藏数量 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 500 | 服务器内部错误 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/hotels/hotel_001/favorite" \
  -H "Authorization: Bearer {token}"
```

## 9. 分享功能

### 9.1 获取分享信息

**接口地址:** `GET /mobile/hotels/:hotel_id/share`

**描述:** 获取酒店分享信息

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID（路径参数） |

**响应示例:**
```json
{
  "code": 0,
  "msg": "获取成功",
  "data": {
    "hotel_id": "hotel_001",
    "hotel_name": "易宿酒店北京王府井店",
    "share_text": "【易宿酒店】推荐给你：易宿酒店北京王府井店，星级：4星，地址：北京市东城区王府井大街88号，最低价格：¥399起",
    "share_url": "https://yisu-hotel.com/hotel/hotel_001",
    "qr_code_url": "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://yisu-hotel.com/hotel/hotel_001",
    "image_url": "https://example.com/hotel.jpg"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| hotel_name | string | 酒店名称 |
| share_text | string | 分享文本 |
| share_url | string | 分享URL |
| qr_code_url | string | 二维码URL |
| image_url | string | 酒店图片URL |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 500 | 服务器内部错误 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001/share"
```
