# 手机端 API 接口文档 - 酒店详情页

## 目录

- [基础信息](#基础信息)
- [酒店信息管理](#酒店信息管理)
- [日历和价格管理](#日历和价格管理)
- [房型管理](#房型管理)
- [预订管理](#预订管理)
- [收藏和分享](#收藏和分享)
- [错误码](#错误码)

## 1. 基础信息

- 基础URL: `http://localhost:{PORT}`
- 认证方式: Bearer Token（所有接口需在请求头中携带 `Authorization: Bearer {token}`）
- 字符集: UTF-8
- 时区: UTC

## 2. 酒店信息管理

### 2.1 获取酒店详情

**接口地址:** `GET /mobile/hotels/{hotel_id}/detail`

**描述:** 获取酒店详细信息（包含基础信息、设施、服务等）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |
| check_in | string | 否 | 入住日期（YYYY-MM-DD） |
| check_out | string | 否 | 离店日期（YYYY-MM-DD） |

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
    "hotel_id": "hotel_001",
    "hotel_name": "易宿酒店",
    "hotel_name_en": "Yisu Hotel",
    "address": "北京市朝阳区建国路88号",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "star_rating": 4,
    "rating": 4.5,
    "review_count": 1234,
    "description": "易宿酒店位于北京市朝阳区核心地段，交通便利，周边配套设施齐全。酒店拥有舒适的客房和完善的服务设施，是商务出行和休闲旅游的理想选择。",
    "distance": "2.5km",
    "check_in_time": "14:00",
    "check_out_time": "12:00",
    "phone": "010-12345678",
    "email": "info@yisuhotel.com",
    "website": "https://www.yisuhotel.com",
    "facilities": [
      {"id": "wifi", "name": "免费WiFi", "icon": "wifi.png"},
      {"id": "parking", "name": "免费停车场", "icon": "parking.png"},
      {"id": "air_conditioner", "name": "空调", "icon": "ac.png"},
      {"id": "tv", "name": "电视", "icon": "tv.png"},
      {"id": "breakfast", "name": "早餐", "icon": "breakfast.png"},
      {"id": "gym", "name": "健身房", "icon": "gym.png"}
    ],
    "services": [
      {"id": "reception", "name": "24小时前台", "available": true},
      {"id": "luggage", "name": "行李寄存", "available": true},
      {"id": "laundry", "name": "洗衣服务", "available": true},
      {"id": "taxi", "name": "叫车服务", "available": true},
      {"id": "concierge", "name": " concierge服务", "available": true}
    ],
    "policies": {
      "cancellation": "入住前24小时可免费取消",
      "payment": "支持现金、信用卡、移动支付",
      "children": "12岁以下儿童可免费入住",
      "pets": "不允许携带宠物"
    },
    "is_favorite": false,
    "favorite_count": 567,
    "min_price": 299,
    "max_price": 599,
    "main_image_url": "https://example.com/hotel1.jpg",
    "tags": [
      {"id": "business", "name": "商务出行", "type": "info"},
      {"id": "city_center", "name": "市中心", "type": "info"},
      {"id": "wifi", "name": "免费WiFi", "type": "info"}
    ],
    "location_info": {
      "district": "朝阳区",
      "nearby": [
        {"name": "国贸中心", "distance": "1.2km"},
        {"name": "三里屯", "distance": "2.8km"},
        {"name": "北京站", "distance": "3.5km"}
      ]
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| hotel_name | string | 酒店名称 |
| hotel_name_en | string | 酒店英文名称 |
| address | string | 酒店地址 |
| latitude | number | 纬度 |
| longitude | number | 经度 |
| star_rating | number | 酒店星级 |
| rating | number | 评分 |
| review_count | number | 评论数 |
| description | string | 酒店描述 |
| distance | string | 距离当前定位距离 |
| check_in_time | string | 入住时间 |
| check_out_time | string | 离店时间 |
| phone | string | 酒店电话 |
| email | string | 酒店邮箱 |
| website | string | 酒店网站 |
| facilities | array | 酒店设施 |
| services | array | 酒店服务 |
| policies | object | 酒店政策 |
| is_favorite | boolean | 当前用户是否收藏 |
| favorite_count | number | 收藏数 |
| min_price | number | 最低价格 |
| max_price | number | 最高价格 |
| main_image_url | string | 酒店主图片URL |
| tags | array | 酒店标签 |
| location_info | object | 位置信息 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001/detail?check_in=2026-02-01&check_out=2026-02-02" \
  -H "Authorization: Bearer {token}"
```

---

### 2.2 获取酒店图片列表

**接口地址:** `GET /mobile/hotels/{hotel_id}/images`

**描述:** 获取酒店图片列表（外观、大堂、房间等）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |
| type | string | 否 | 图片类型（exterior:外观, lobby:大堂, room:房间, facility:设施） |

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
    "total": 12,
    "images": [
      {
        "id": "img_001",
        "url": "https://example.com/hotel_exterior1.jpg",
        "type": "exterior",
        "description": "酒店外观",
        "order": 1
      },
      {
        "id": "img_002",
        "url": "https://example.com/hotel_lobby1.jpg",
        "type": "lobby",
        "description": "酒店大堂",
        "order": 2
      },
      {
        "id": "img_003",
        "url": "https://example.com/hotel_room1.jpg",
        "type": "room",
        "description": "豪华大床房",
        "order": 3
      },
      {
        "id": "img_004",
        "url": "https://example.com/hotel_facility1.jpg",
        "type": "facility",
        "description": "健身房",
        "order": 4
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| total | number | 图片总数 |
| images | array | 图片列表 |
| images[].id | string | 图片ID |
| images[].url | string | 图片URL |
| images[].type | string | 图片类型 |
| images[].description | string | 图片描述 |
| images[].order | number | 图片顺序 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001/images?type=room" \
  -H "Authorization: Bearer {token}"
```

---

## 3. 日历和价格管理

### 3.1 获取可用日期和价格

**接口地址:** `GET /mobile/hotels/{hotel_id}/availability`

**描述:** 获取指定日期范围内的可用状态和价格

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |
| start_date | string | 是 | 开始日期（YYYY-MM-DD） |
| end_date | string | 是 | 结束日期（YYYY-MM-DD） |
| room_type_id | string | 否 | 房型ID（可选，不指定则返回所有房型的平均价格） |

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
    "hotel_id": "hotel_001",
    "start_date": "2026-02-01",
    "end_date": "2026-02-29",
    "calendar": [
      {
        "date": "2026-02-01",
        "is_available": true,
        "min_price": 299,
        "max_price": 599,
        "price_level": "low"
      },
      {
        "date": "2026-02-02",
        "is_available": true,
        "min_price": 299,
        "max_price": 599,
        "price_level": "low"
      },
      {
        "date": "2026-02-03",
        "is_available": false,
        "min_price": null,
        "max_price": null,
        "price_level": null
      }
    ],
    "price_ranges": {
      "low": {
        "min": 200,
        "max": 399,
        "color": "#4CAF50"
      },
      "medium": {
        "min": 400,
        "max": 599,
        "color": "#FFC107"
      },
      "high": {
        "min": 600,
        "max": 999,
        "color": "#F44336"
      }
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| start_date | string | 开始日期 |
| end_date | string | 结束日期 |
| calendar | array | 日历数据 |
| calendar[].date | string | 日期 |
| calendar[].is_available | boolean | 是否可用 |
| calendar[].min_price | number | 最低价格 |
| calendar[].max_price | number | 最高价格 |
| calendar[].price_level | string | 价格等级 |
| price_ranges | object | 价格区间定义 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |
| 4001 | 日期格式不正确 |
| 4002 | 结束日期必须晚于开始日期 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001/availability?start_date=2026-02-01&end_date=2026-02-29" \
  -H "Authorization: Bearer {token}"
```

---

### 3.2 计算价格

**接口地址:** `POST /mobile/hotels/{hotel_id}/calculate-price`

**描述:** 计算指定入住离店日期的价格

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "check_in": "2026-02-01",
  "check_out": "2026-02-02",
  "room_type_id": "room_001",
  "adults": 2,
  "children": 1,
  "children_ages": [6]
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| check_in | string | 是 | 入住日期（YYYY-MM-DD） |
| check_out | string | 是 | 离店日期（YYYY-MM-DD） |
| room_type_id | string | 是 | 房型ID |
| adults | number | 是 | 成人人数 |
| children | number | 否 | 儿童人数 |
| children_ages | array | 否 | 儿童年龄数组 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "计算成功",
  "data": {
    "hotel_id": "hotel_001",
    "room_type_id": "room_001",
    "check_in": "2026-02-01",
    "check_out": "2026-02-02",
    "nights": 1,
    "guests": {
      "adults": 2,
      "children": 1
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
    "is_available": true,
    "remaining_rooms": 5,
    "currency": "CNY",
    "valid_until": "2026-01-31T23:59:59Z"
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
| nights | number | 入住晚数 |
| guests | object | 客人信息 |
| price_details | object | 价格详情 |
| price_breakdown | array | 价格明细 |
| is_available | boolean | 是否可用 |
| remaining_rooms | number | 剩余房间数 |
| currency | string | 货币类型 |
| valid_until | string | 价格有效期 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |
| 4001 | 日期格式不正确 |
| 4002 | 离店日期必须晚于入住日期 |
| 4010 | 房型不存在 |
| 4011 | 所选日期不可预订 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/hotels/hotel_001/calculate-price" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"check_in": "2026-02-01", "check_out": "2026-02-02", "room_type_id": "room_001", "adults": 2, "children": 1, "children_ages": [6]}'
```

---

## 4. 房型管理

### 4.1 获取房型列表

**接口地址:** `GET /mobile/hotels/{hotel_id}/room-types`

**描述:** 获取酒店房型列表（按价格排序）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |
| check_in | string | 否 | 入住日期（YYYY-MM-DD） |
| check_out | string | 否 | 离店日期（YYYY-MM-DD） |
| sort_by | string | 否 | 排序方式：price_asc（默认）, price_desc |

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
    "hotel_id": "hotel_001",
    "total": 3,
    "room_types": [
      {
        "room_type_id": "room_001",
        "room_name": "标准双人间",
        "room_name_en": "Standard Twin Room",
        "bed_type": "twin",
        "area": 25,
        "max_occupancy": 2,
        "description": "舒适的标准双人间，配备两张单人床，适合商务出行或朋友同行。",
        "facilities": [
          "free_wifi",
          "air_conditioner",
          "tv",
          "minibar",
          "workdesk"
        ],
        "price": {
          "original": 399,
          "current": 299,
          "discount": 0.75,
          "discount_label": "8折优惠"
        },
        "availability": {
          "is_available": true,
          "remaining_rooms": 10,
          "is_low_stock": false
        },
        "images": [
          "https://example.com/room1_1.jpg",
          "https://example.com/room1_2.jpg"
        ],
        "policies": {
          "cancellation": "入住前24小时可免费取消",
          "breakfast": "含双早",
          "check_in_time": "14:00",
          "check_out_time": "12:00"
        },
        "tags": [
          {"id": "best_seller", "name": "热销", "type": "primary"},
          {"id": "value", "name": "性价比高", "type": "info"}
        ]
      },
      {
        "room_type_id": "room_002",
        "room_name": "豪华大床房",
        "room_name_en": "Deluxe King Room",
        "bed_type": "king",
        "area": 35,
        "max_occupancy": 2,
        "description": "豪华大床房，配备舒适的大床，适合情侣或独自出行。",
        "facilities": [
          "free_wifi",
          "air_conditioner",
          "tv",
          "minibar",
          "bathtub",
          "workdesk"
        ],
        "price": {
          "original": 499,
          "current": 399,
          "discount": 0.8,
          "discount_label": "8折优惠"
        },
        "availability": {
          "is_available": true,
          "remaining_rooms": 2,
          "is_low_stock": true,
          "low_stock_label": "仅剩2间"
        },
        "images": [
          "https://example.com/room2_1.jpg",
          "https://example.com/room2_2.jpg"
        ],
        "policies": {
          "cancellation": "入住前48小时可免费取消",
          "breakfast": "含双早",
          "check_in_time": "14:00",
          "check_out_time": "12:00"
        },
        "tags": [
          {"id": "popular", "name": "受欢迎", "type": "info"},
          {"id": "deluxe", "name": "豪华", "type": "info"}
        ]
      },
      {
        "room_type_id": "room_003",
        "room_name": "行政套房",
        "room_name_en": "Executive Suite",
        "bed_type": "king",
        "area": 50,
        "max_occupancy": 4,
        "description": "宽敞的行政套房，配备独立客厅和卧室，适合商务或家庭出行。",
        "facilities": [
          "free_wifi",
          "air_conditioner",
          "tv",
          "minibar",
          "bathtub",
          "workdesk",
          "lounge_access"
        ],
        "price": {
          "original": 799,
          "current": 599,
          "discount": 0.75,
          "discount_label": "套餐立减"
        },
        "availability": {
          "is_available": true,
          "remaining_rooms": 5,
          "is_low_stock": false
        },
        "images": [
          "https://example.com/room3_1.jpg",
          "https://example.com/room3_2.jpg"
        ],
        "policies": {
          "cancellation": "入住前72小时可免费取消",
          "breakfast": "含双早",
          "check_in_time": "14:00",
          "check_out_time": "12:00"
        },
        "tags": [
          {"id": "suite", "name": "套房", "type": "info"},
          {"id": "business", "name": "商务", "type": "info"}
        ]
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| total | number | 房型总数 |
| room_types | array | 房型列表 |
| room_types[].room_type_id | string | 房型ID |
| room_types[].room_name | string | 房型名称 |
| room_types[].room_name_en | string | 房型英文名称 |
| room_types[].bed_type | string | 床型 |
| room_types[].area | number | 面积（平方米） |
| room_types[].max_occupancy | number | 最大入住人数 |
| room_types[].description | string | 房型描述 |
| room_types[].facilities | array | 房型设施 |
| room_types[].price | object | 价格信息 |
| room_types[].availability | object | 可用状态 |
| room_types[].images | array | 房型图片 |
| room_types[].policies | object | 房型政策 |
| room_types[].tags | array | 房型标签 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001/room-types?check_in=2026-02-01&check_out=2026-02-02&sort_by=price_asc" \
  -H "Authorization: Bearer {token}"
```

---

### 4.2 获取房型详情

**接口地址:** `GET /mobile/hotels/{hotel_id}/room-types/{room_type_id}`

**描述:** 获取房型详细信息

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |
| room_type_id | string | 是 | 房型ID |
| check_in | string | 否 | 入住日期（YYYY-MM-DD） |
| check_out | string | 否 | 离店日期（YYYY-MM-DD） |

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
    "hotel_id": "hotel_001",
    "room_type": {
      "room_type_id": "room_002",
      "room_name": "豪华大床房",
      "room_name_en": "Deluxe King Room",
      "bed_type": "king",
      "area": 35,
      "max_occupancy": 2,
      "description": "豪华大床房，配备舒适的大床，适合情侣或独自出行。房间宽敞明亮，装修现代，设施齐全。",
      "facilities": [
        {
          "id": "free_wifi",
          "name": "免费WiFi",
          "icon": "wifi.png"
        },
        {
          "id": "air_conditioner",
          "name": "空调",
          "icon": "ac.png"
        },
        {
          "id": "tv",
          "name": "平板电视",
          "icon": "tv.png"
        },
        {
          "id": "minibar",
          "name": "迷你吧",
          "icon": "minibar.png"
        },
        {
          "id": "bathtub",
          "name": "浴缸",
          "icon": "bathtub.png"
        },
        {
          "id": "workdesk",
          "name": "办公桌",
          "icon": "workdesk.png"
        }
      ],
      "price": {
        "original": 499,
        "current": 399,
        "discount": 0.8,
        "discount_label": "8折优惠",
        "price_per_night": 399,
        "total_price": 399
      },
      "availability": {
        "is_available": true,
        "remaining_rooms": 2,
        "is_low_stock": true,
        "low_stock_label": "仅剩2间",
        "check_in_date": "2026-02-01",
        "check_out_date": "2026-02-02",
        "nights": 1
      },
      "images": [
        {
          "id": "room_img_001",
          "url": "https://example.com/room2_1.jpg",
          "order": 1,
          "description": "豪华大床房全景"
        },
        {
          "id": "room_img_002",
          "url": "https://example.com/room2_2.jpg",
          "order": 2,
          "description": "豪华大床房浴室"
        },
        {
          "id": "room_img_003",
          "url": "https://example.com/room2_3.jpg",
          "order": 3,
          "description": "豪华大床房床品"
        }
      ],
      "policies": {
        "cancellation": "入住前48小时可免费取消",
        "breakfast": "含双早",
        "check_in_time": "14:00",
        "check_out_time": "12:00",
        "payment_methods": ["cash", "credit_card", "mobile_payment"],
        "extra_bed": "可加床，加床费用100元/晚",
        "pet_policy": "不允许携带宠物",
        "smoking_policy": "禁烟房间"
      },
      "tags": [
        {"id": "popular", "name": "受欢迎", "type": "primary"},
        {"id": "deluxe", "name": "豪华", "type": "info"},
        {"id": "value", "name": "性价比高", "type": "info"}
      ],
      "services": [
        {
          "id": "airport_transfer",
          "name": "机场接送服务",
          "fee": 200,
          "available": true
        },
        {
          "id": "laundry",
          "name": "洗衣服务",
          "fee": 50,
          "available": true
        },
        {
          "id": "room_service",
          "name": "24小时客房服务",
          "fee": 0,
          "available": true
        }
      ]
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| room_type | object | 房型详细信息 |
| room_type.room_type_id | string | 房型ID |
| room_type.room_name | string | 房型名称 |
| room_type.room_name_en | string | 房型英文名称 |
| room_type.bed_type | string | 床型 |
| room_type.area | number | 面积（平方米） |
| room_type.max_occupancy | number | 最大入住人数 |
| room_type.description | string | 房型描述 |
| room_type.facilities | array | 房型设施（详细） |
| room_type.price | object | 价格信息 |
| room_type.availability | object | 可用状态 |
| room_type.images | array | 房型图片（详细） |
| room_type.policies | object | 房型政策 |
| room_type.tags | array | 房型标签 |
| room_type.services | array | 额外服务 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |
| 4010 | 房型不存在 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001/room-types/room_002?check_in=2026-02-01&check_out=2026-02-02" \
  -H "Authorization: Bearer {token}"
```

---

## 5. 预订管理

### 5.1 创建预订

**接口地址:** `POST /mobile/hotels/{hotel_id}/bookings`

**描述:** 创建酒店预订

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "check_in": "2026-02-01",
  "check_out": "2026-02-02",
  "room_type_id": "room_002",
  "adults": 2,
  "children": 1,
  "children_ages": [6],
  "contact_info": {
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com"
  },
  "guest_info": [
    {
      "name": "张三",
      "id_type": "id_card",
      "id_number": "110101199001011234"
    },
    {
      "name": "李四",
      "id_type": "id_card",
      "id_number": "110101199001011235"
    }
  ],
  "special_request": "需要高楼层，安静的房间",
  "payment_method": "alipay",
  "promotion_code": "NEWYEAR2026"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| check_in | string | 是 | 入住日期（YYYY-MM-DD） |
| check_out | string | 是 | 离店日期（YYYY-MM-DD） |
| room_type_id | string | 是 | 房型ID |
| adults | number | 是 | 成人人数 |
| children | number | 否 | 儿童人数 |
| children_ages | array | 否 | 儿童年龄数组 |
| contact_info | object | 是 | 联系人信息 |
| guest_info | array | 是 | 入住人信息 |
| special_request | string | 否 | 特殊要求 |
| payment_method | string | 是 | 支付方式（alipay, wechat, card） |
| promotion_code | string | 否 | 优惠码 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "预订成功",
  "data": {
    "booking_id": "booking_001",
    "hotel_id": "hotel_001",
    "hotel_name": "易宿酒店",
    "room_type_id": "room_002",
    "room_name": "豪华大床房",
    "check_in": "2026-02-01",
    "check_out": "2026-02-02",
    "nights": 1,
    "guests": {
      "adults": 2,
      "children": 1
    },
    "price": {
      "total": 399,
      "original_total": 499,
      "discount": 100,
      "currency": "CNY"
    },
    "status": "pending_payment",
    "status_text": "待支付",
    "contact_info": {
      "name": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com"
    },
    "guest_count": 3,
    "special_request": "需要高楼层，安静的房间",
    "created_at": "2026-01-20T10:30:00Z",
    "payment_info": {
      "payment_method": "alipay",
      "payment_url": "https://example.com/pay/alipay/booking_001",
      "expires_at": "2026-01-20T10:45:00Z"
    },
    "booking_details_url": "/mobile/bookings/booking_001/details"
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
| room_name | string | 房型名称 |
| check_in | string | 入住日期 |
| check_out | string | 离店日期 |
| nights | number | 入住晚数 |
| guests | object | 客人信息 |
| price | object | 价格信息 |
| status | string | 预订状态 |
| status_text | string | 状态文本 |
| contact_info | object | 联系人信息 |
| guest_count | number | 入住人数 |
| special_request | string | 特殊要求 |
| created_at | string | 创建时间 |
| payment_info | object | 支付信息 |
| booking_details_url | string | 预订详情页面URL |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |
| 4010 | 房型不存在 |
| 4011 | 所选日期不可预订 |
| 4012 | 预订失败，请稍后重试 |
| 4013 | 优惠码无效 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/hotels/hotel_001/bookings" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"check_in": "2026-02-01", "check_out": "2026-02-02", "room_type_id": "room_002", "adults": 2, "children": 1, "children_ages": [6], "contact_info": {"name": "张三", "phone": "13800138000", "email": "zhangsan@example.com"}, "guest_info": [{"name": "张三", "id_type": "id_card", "id_number": "110101199001011234"}, {"name": "李四", "id_type": "id_card", "id_number": "110101199001011235"}], "special_request": "需要高楼层，安静的房间", "payment_method": "alipay"}'
```

---

### 5.2 检查预订可用性

**接口地址:** `POST /mobile/hotels/{hotel_id}/check-availability`

**描述:** 检查预订可用性（防止超售）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "check_in": "2026-02-01",
  "check_out": "2026-02-02",
  "room_type_id": "room_002",
  "adults": 2,
  "children": 1
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| check_in | string | 是 | 入住日期（YYYY-MM-DD） |
| check_out | string | 是 | 离店日期（YYYY-MM-DD） |
| room_type_id | string | 是 | 房型ID |
| adults | number | 是 | 成人人数 |
| children | number | 否 | 儿童人数 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "检查成功",
  "data": {
    "hotel_id": "hotel_001",
    "room_type_id": "room_002",
    "is_available": true,
    "remaining_rooms": 2,
    "is_low_stock": true,
    "low_stock_warning": "仅剩2间",
    "price": {
      "total": 399,
      "original_total": 499,
      "discount": 100
    },
    "max_occupancy": 2,
    "allow_children": true,
    "child_policy": "12岁以下儿童可免费入住"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| room_type_id | string | 房型ID |
| is_available | boolean | 是否可用 |
| remaining_rooms | number | 剩余房间数 |
| is_low_stock | boolean | 是否库存紧张 |
| low_stock_warning | string | 库存紧张提示 |
| price | object | 价格信息 |
| max_occupancy | number | 最大入住人数 |
| allow_children | boolean | 是否允许儿童 |
| child_policy | string | 儿童政策 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |
| 4010 | 房型不存在 |
| 4011 | 所选日期不可预订 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/hotels/hotel_001/check-availability" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"check_in": "2026-02-01", "check_out": "2026-02-02", "room_type_id": "room_002", "adults": 2, "children": 1}'
```

---

## 6. 收藏和分享

### 6.1 收藏/取消收藏酒店

**接口地址:** `POST /mobile/hotels/{hotel_id}/favorite`

**描述:** 收藏或取消收藏酒店

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "action": "add"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| action | string | 是 | 操作类型：add（收藏）, remove（取消收藏） |

**响应示例（收藏成功）:**
```json
{
  "code": 0,
  "msg": "收藏成功",
  "data": {
    "hotel_id": "hotel_001",
    "is_favorite": true,
    "favorite_count": 568,
    "message": "已添加到收藏夹"
  }
}
```

**响应示例（取消收藏成功）:**
```json
{
  "code": 0,
  "msg": "取消收藏成功",
  "data": {
    "hotel_id": "hotel_001",
    "is_favorite": false,
    "favorite_count": 566,
    "message": "已从收藏夹移除"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| is_favorite | boolean | 当前收藏状态 |
| favorite_count | number | 收藏数 |
| message | string | 操作结果提示 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |
| 4007 | 已收藏该酒店 |
| 4008 | 未收藏该酒店 |

**curl 示例:**
```bash
# 收藏酒店
curl -X POST "http://localhost:{PORT}/mobile/hotels/hotel_001/favorite" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"action": "add"}'

# 取消收藏酒店
curl -X POST "http://localhost:{PORT}/mobile/hotels/hotel_001/favorite" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"action": "remove"}'
```

---

### 6.2 获取分享信息

**接口地址:** `GET /mobile/hotels/{hotel_id}/share`

**描述:** 获取酒店分享信息（包含分享文本、图片、QR码等）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |
| platform | string | 否 | 分享平台（wechat, moments, sms） |

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
    "hotel_id": "hotel_001",
    "share_content": {
      "title": "【易宿酒店】豪华舒适的住宿体验",
      "description": "我发现了一家不错的酒店，位于北京市朝阳区核心地段，交通便利，价格实惠。推荐给你！",
      "url": "https://example.com/hotels/hotel_001",
      "image_url": "https://example.com/share/hotel_001.jpg"
    },
    "qr_code": {
      "url": "https://example.com/qr/hotel_001.png",
      "width": 200,
      "height": 200
    },
    "platforms": [
      {
        "id": "wechat",
        "name": "微信好友",
        "icon": "wechat.png",
        "enabled": true
      },
      {
        "id": "moments",
        "name": "朋友圈",
        "icon": "moments.png",
        "enabled": true
      },
      {
        "id": "sms",
        "name": "短信",
        "icon": "sms.png",
        "enabled": true
      }
    ],
    "tracking_params": {
      "source": "mobile_app",
      "user_id": "user_001",
      "timestamp": "2026-01-20T10:30:00Z"
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| share_content | object | 分享内容 |
| share_content.title | string | 分享标题 |
| share_content.description | string | 分享描述 |
| share_content.url | string | 分享链接 |
| share_content.image_url | string | 分享图片URL |
| qr_code | object | 二维码信息 |
| platforms | array | 支持的分享平台 |
| tracking_params | object | 跟踪参数 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/hotel_001/share?platform=wechat" \
  -H "Authorization: Bearer {token}"
```

---

## 7. 错误码

### 7.1 通用错误码

| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 503 | 服务暂时不可用 |

### 7.2 业务错误码

| 错误码 | 说明 |
|--------|------|
| 4001 | 日期格式不正确 |
| 4002 | 离店日期必须晚于入住日期 |
| 4003 | 页码超出范围 |
| 4004 | 筛选类型无效 |
| 4005 | 排序方式无效 |
| 4006 | 酒店不存在 |
| 4007 | 已收藏该酒店 |
| 4008 | 未收藏该酒店 |
| 4009 | 酒店ID列表不能为空 |
| 4010 | 房型不存在 |
| 4011 | 所选日期不可预订 |
| 4012 | 预订失败，请稍后重试 |
| 4013 | 优惠码无效 |
| 4014 | 库存不足 |
| 4015 | 价格计算失败 |
| 4016 | 图片加载失败 |
| 4017 | 分享失败 |

### 7.3 输入验证错误码

| 错误码 | 说明 |
|--------|------|
| 3001 | 手机号格式不正确 |
| 3002 | 验证码发送频率限制（60秒内只能发送一次） |
| 3003 | 验证码错误或已过期 |
| 3004 | 未同意用户协议 |
| 3005 | 手机号已注册 |
| 3006 | 密码格式不正确 |
| 3007 | 验证码发送失败，请稍后重试 |
| 3008 | 第三方授权失败，请重新尝试 |
| 3009 | 请求参数错误 |
