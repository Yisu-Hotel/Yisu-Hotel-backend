# 手机端 API 接口文档 - 酒店列表页

## 目录

- [基础信息](#基础信息)
- [酒店列表](#hotellist)
- [筛选管理](#filtramanagement)
- [排序管理](#sortmanagement)
- [收藏操作](#favoriteoperation)
- [用户反馈](#userfeedback)

## 1. 基础信息

- 基础URL: `http://localhost:{PORT}`
- 认证方式: Bearer Token（所有接口需在请求头中携带 `Authorization: Bearer {token}`）
- 字符集: UTF-8
- 时区: UTC

## 2. 酒店列表

### 2.1 分页获取酒店列表

**接口地址:** `GET /mobile/hotels/list`

**描述:** 分页获取酒店列表（支持筛选条件和排序）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键字（酒店名称、品牌等） |
| city_id | string | 否 | 城市ID |
| city_name | string | 否 | 城市名称 |
| check_in | string | 否 | 入住日期（YYYY-MM-DD） |
| check_out | string | 否 | 离店日期（YYYY-MM-DD） |
| min_price | number | 否 | 最低价格 |
| max_price | number | 否 | 最高价格 |
| stars | string | 否 | 星级（逗号分隔，如：3,4,5） |
| facilities | string | 否 | 设施（逗号分隔，如：parking,wifi,breakfast） |
| tags | string | 否 | 标签（逗号分隔，如：family,deluxe,parking） |
| min_rating | number | 否 | 最低评分（1-5） |
| sort_by | string | 否 | 排序方式：default, price_asc, price_desc, distance_asc, rating_desc |
| page | number | 否 | 页码，默认1 |
| page_size | number | 否 | 每页数量，默认20 |
| exclude_hotels | string | 否 | 排除的酒店ID（逗号分隔） |

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
    "total": 100,
    "page": 1,
    "page_size": 20,
    "has_more": true,
    "hotels": [
      {
        "hotel_id": "hotel_001",
        "hotel_name": "易宿酒店",
        "hotel_name_en": "Yisu Hotel",
        "address": "北京市朝阳区建国路88号",
        "latitude": 39.9042,
        "longitude": 116.4074,
        "star_rating": 4,
        "min_price": 299,
        "max_price": 599,
        "main_image_url": "https://example.com/hotel1.jpg",
        "rating": 4.5,
        "review_count": 1234,
        "favorite_count": 567,
        "distance": "2.5km",
        "is_favorite": false,
        "is_available": true,
        "can_cancel": true,
        "check_in_time": "14:00",
        "check_out_time": "12:00",
        "tags": [
          {"id": "available", "name": "可订", "type": "primary"},
          {"id": "cancel", "name": "免费取消", "type": "secondary"},
          {"id": "wifi", "name": "免费WiFi", "type": "info"}
        ],
        "facilities": ["parking", "wifi", "breakfast", "gym"]
      },
      {
        "hotel_id": "hotel_002",
        "hotel_name": "阳光酒店",
        "hotel_name_en": "Sunshine Hotel",
        "address": "北京市朝阳区望京SOHO",
        "latitude": 39.9289,
        "longitude": 116.4768,
        "star_rating": 5,
        "min_price": 499,
        "max_price": 899,
        "main_image_url": "https://example.com/hotel2.jpg",
        "rating": 4.8,
        "review_count": 892,
        "favorite_count": 345,
        "distance": "3.8km",
        "is_favorite": true,
        "is_available": true,
        "can_cancel": true,
        "check_in_time": "15:00",
        "check_out_time": "12:00",
        "tags": [
          {"id": "available", "name": "可订", "type": "primary"},
          {"id": "cancel", "name": "免费取消", "type": "secondary"},
          {"id": "pool", "name": "游泳池", "type": "info"}
        ],
        "facilities": ["parking", "wifi", "breakfast", "pool", "gym", "spa"]
      }
    ],
    "applied_filters": {
      "city": "北京市",
      "check_in": "2026-02-01",
      "check_out": "2026-02-02",
      "nights": 1,
      "stars": [4, 5],
      "min_price": 200,
      "max_price": 600,
      "sort_by": "price_asc"
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| total | number | 总酒店数 |
| page | number | 当前页码 |
| page_size | number | 每页数量 |
| has_more | boolean | 是否有更多数据 |
| hotels | array | 酒店列表 |
| hotels[].hotel_id | string | 酒店ID |
| hotels[].hotel_name | string | 酒店名称 |
| hotels[].hotel_name_en | string | 酒店英文名称 |
| hotels[].address | string | 酒店地址 |
| hotels[].latitude | number | 纬度 |
| hotels[].longitude | number | 经度 |
| hotels[].star_rating | number | 酒店星级 |
| hotels[].min_price | number | 最低价格 |
| hotels[].max_price | number | 最高价格 |
| hotels[].main_image_url | string | 酒店主图片URL |
| hotels[].rating | number | 评分 |
| hotels[].review_count | number | 评论数 |
| hotels[].favorite_count | number | 收藏数 |
| hotels[].distance | string | 距离 |
| hotels[].is_favorite | boolean | 当前用户是否收藏 |
| hotels[].is_available | boolean | 是否可订 |
| hotels[].can_cancel | boolean | 是否可免费取消 |
| hotels[].check_in_time | string | 入住时间 |
| hotels[].check_out_time | string | 离店时间 |
| hotels[].tags | array | 酒店标签 |
| hotels[].tags[].id | string | 标签ID |
| hotels[].tags[].name | string | 标签名称 |
| hotels[].tags[].type | string | 标签类型 |
| hotels[].facilities | array | 酒店设施 |
| applied_filters | object | 应用的筛选条件 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4001 | 日期格式不正确 |
| 4002 | 离店日期必须晚于入住日期 |
| 4003 | 页码超出范围 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/list?city_id=city_001&check_in=2026-02-01&check_out=2026-02-02&stars=4,5&min_price=200&max_price=600&sort_by=price_asc&page=1&page_size=20" \
  -H "Authorization: Bearer {token}"
```

### 2.2 快速筛选酒店

**接口地址:** `GET /mobile/hotels/quick-filter`

**描述:** 快速筛选酒店（基于预设条件）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| filter_type | string | 是 | 筛选类型：nearby, popular, budget, luxury, family |
| city_id | string | 否 | 城市ID |
| page | number | 否 | 页码，默认1 |
| page_size | number | 否 | 每页数量，默认20 |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |

**响应示例:**
```json
{
  "code": 0,
  "msg": "筛选成功",
  "data": {
    "total": 50,
    "page": 1,
    "page_size": 20,
    "has_more": true,
    "hotels": [
      {
        "hotel_id": "hotel_001",
        "hotel_name": "易宿酒店",
        "address": "北京市朝阳区建国路88号",
        "star_rating": 4,
        "min_price": 299,
        "main_image_url": "https://example.com/hotel1.jpg",
        "rating": 4.5,
        "distance": "2.5km",
        "is_favorite": false
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| total | number | 总酒店数 |
| page | number | 当前页码 |
| page_size | number | 每页数量 |
| has_more | boolean | 是否有更多数据 |
| hotels | array | 酒店列表（简化版） |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4004 | 筛选类型无效 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/quick-filter?filter_type=nearby&city_id=city_001" \
  -H "Authorization: Bearer {token}"
```

## 3. 筛选管理

### 3.1 获取筛选选项

**接口地址:** `GET /mobile/filters/options`

**描述:** 获取酒店筛选选项（包含数量统计）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| city_id | string | 否 | 城市ID |
| check_in | string | 否 | 入住日期 |
| check_out | string | 否 | 离店日期 |

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
    "price_range": {
      "min": 100,
      "max": 2000,
      "step": 50
    },
    "stars": [
      {"value": 1, "label": "1星", "count": 10, "selected": false},
      {"value": 2, "label": "2星", "count": 25, "selected": false},
      {"value": 3, "label": "3星", "count": 45, "selected": false},
      {"value": 4, "label": "4星", "count": 30, "selected": true},
      {"value": 5, "label": "5星", "count": 15, "selected": true}
    ],
    "facilities": [
      {"id": "parking", "name": "免费停车场", "icon": "parking.png", "count": 80, "selected": false},
      {"id": "wifi", "name": "免费WiFi", "icon": "wifi.png", "count": 100, "selected": true},
      {"id": "breakfast", "name": "含早餐", "icon": "breakfast.png", "count": 60, "selected": false},
      {"id": "pool", "name": "游泳池", "icon": "pool.png", "count": 30, "selected": false},
      {"id": "gym", "name": "健身房", "icon": "gym.png", "count": 50, "selected": false},
      {"id": "spa", "name": "SPA", "icon": "spa.png", "count": 25, "selected": false},
      {"id": "front_desk", "name": "24小时前台", "icon": "front_desk.png", "count": 75, "selected": false}
    ],
    "ratings": [
      {"value": 3, "label": "3分及以上", "count": 90, "selected": false},
      {"value": 4, "label": "4分及以上", "count": 70, "selected": true},
      {"value": 4.5, "label": "4.5分及以上", "count": 45, "selected": false}
    ],
    "services": [
      {"id": "cancel", "name": "免费取消", "count": 60, "selected": false},
      {"id": "breakfast", "name": "含早餐", "count": 55, "selected": false},
      {"id": "airport", "name": "机场接送", "count": 20, "selected": false}
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| price_range | object | 价格范围 |
| price_range.min | number | 最低价格 |
| price_range.max | number | 最高价格 |
| price_range.step | number | 价格步长 |
| stars | array | 星级选项 |
| facilities | array | 设施选项 |
| ratings | array | 评分选项 |
| services | array | 服务选项 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/filters/options?city_id=city_001&check_in=2026-02-01&check_out=2026-02-02" \
  -H "Authorization: Bearer {token}"
```

### 3.2 应用筛选条件

**接口地址:** `POST /mobile/filters/apply`

**描述:** 应用筛选条件并获取酒店列表

**请求参数:** 无

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "city_id": "city_001",
  "city_name": "北京市",
  "check_in": "2026-02-01",
  "check_out": "2026-02-02",
  "price_range": {
    "min": 200,
    "max": 600
  },
  "stars": [4, 5],
  "facilities": ["wifi", "parking"],
  "min_rating": 4,
  "services": ["cancel"],
  "sort_by": "price_asc",
  "page": 1,
  "page_size": 20
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| city_id | string | 否 | 城市ID |
| city_name | string | 否 | 城市名称 |
| check_in | string | 否 | 入住日期 |
| check_out | string | 否 | 离店日期 |
| price_range | object | 否 | 价格范围 |
| price_range.min | number | 否 | 最低价格 |
| price_range.max | number | 否 | 最高价格 |
| stars | array | 否 | 星级数组 |
| facilities | array | 否 | 设施数组 |
| min_rating | number | 否 | 最低评分 |
| services | array | 否 | 服务数组 |
| sort_by | string | 否 | 排序方式 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "筛选成功",
  "data": {
    "total": 25,
    "page": 1,
    "page_size": 20,
    "has_more": true,
    "hotels": [
      {
        "hotel_id": "hotel_001",
        "hotel_name": "易宿酒店",
        "min_price": 299,
        "main_image_url": "https://example.com/hotel1.jpg",
        "rating": 4.5,
        "distance": "2.5km",
        "is_favorite": false
      }
    ],
    "applied_filters": {
      "city": "北京市",
      "check_in": "2026-02-01",
      "check_out": "2026-02-02",
      "price_range": "200-600元",
      "stars": "4-5星",
      "facilities": ["免费WiFi", "免费停车场"],
      "min_rating": "4分及以上",
      "services": ["免费取消"],
      "sort_by": "价格从低到高"
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| total | number | 总酒店数 |
| page | number | 当前页码 |
| page_size | number | 每页数量 |
| has_more | boolean | 是否有更多数据 |
| hotels | array | 酒店列表 |
| applied_filters | object | 应用的筛选条件（文本描述） |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4001 | 日期格式不正确 |
| 4002 | 离店日期必须晚于入住日期 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/filters/apply" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"city_id": "city_001", "check_in": "2026-02-01", "check_out": "2026-02-02", "price_range": {"min": 200, "max": 600}, "stars": [4, 5], "facilities": ["wifi", "parking"], "sort_by": "price_asc"}'
```

### 3.3 重置筛选条件

**接口地址:** `GET /mobile/filters/reset`

**描述:** 重置所有筛选条件并获取默认酒店列表

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| city_id | string | 否 | 城市ID |
| check_in | string | 否 | 入住日期 |
| check_out | string | 否 | 离店日期 |

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |

**响应示例:**
```json
{
  "code": 0,
  "msg": "重置成功",
  "data": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "has_more": true,
    "hotels": [
      {
        "hotel_id": "hotel_001",
        "hotel_name": "易宿酒店",
        "min_price": 299,
        "main_image_url": "https://example.com/hotel1.jpg",
        "rating": 4.5
      }
    ],
    "applied_filters": {
      "city": "北京市",
      "check_in": "2026-02-01",
      "check_out": "2026-02-02",
      "sort_by": "综合排序"
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| total | number | 总酒店数 |
| page | number | 当前页码 |
| page_size | number | 每页数量 |
| has_more | boolean | 是否有更多数据 |
| hotels | array | 酒店列表 |
| applied_filters | object | 应用的筛选条件 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/filters/reset?city_id=city_001&check_in=2026-02-01&check_out=2026-02-02" \
  -H "Authorization: Bearer {token}"
```

## 4. 排序管理

### 4.1 获取排序选项

**接口地址:** `GET /mobile/sort/options`

**描述:** 获取排序选项

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
    "options": [
      {
        "value": "default",
        "label": "综合排序",
        "selected": false,
        "description": "根据评分、价格、距离综合排序"
      },
      {
        "value": "price_asc",
        "label": "价格从低到高",
        "selected": true,
        "description": "按价格升序排列"
      },
      {
        "value": "price_desc",
        "label": "价格从高到低",
        "selected": false,
        "description": "按价格降序排列"
      },
      {
        "value": "distance_asc",
        "label": "距离由近及远",
        "selected": false,
        "description": "按距离升序排列"
      },
      {
        "value": "rating_desc",
        "label": "评分从高到低",
        "selected": false,
        "description": "按评分降序排列"
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| options | array | 排序选项 |
| options[].value | string | 排序值 |
| options[].label | string | 排序标签 |
| options[].selected | boolean | 是否选中 |
| options[].description | string | 排序描述 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/sort/options" \
  -H "Authorization: Bearer {token}"
```

### 4.2 应用排序

**接口地址:** `POST /mobile/sort/apply`

**描述:** 应用排序并获取酒店列表

**请求参数:** 无

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "sort_by": "price_asc",
  "filters": {
    "city_id": "city_001",
    "check_in": "2026-02-01",
    "check_out": "2026-02-02",
    "stars": [4, 5]
  },
  "page": 1,
  "page_size": 20
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| sort_by | string | 是 | 排序方式 |
| filters | object | 否 | 筛选条件 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "排序成功",
  "data": {
    "total": 25,
    "page": 1,
    "page_size": 20,
    "has_more": true,
    "hotels": [
      {
        "hotel_id": "hotel_001",
        "hotel_name": "易宿酒店",
        "min_price": 299,
        "main_image_url": "https://example.com/hotel1.jpg",
        "rating": 4.5
      }
    ],
    "applied_sort": "价格从低到高"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| total | number | 总酒店数 |
| page | number | 当前页码 |
| page_size | number | 每页数量 |
| has_more | boolean | 是否有更多数据 |
| hotels | array | 酒店列表 |
| applied_sort | string | 应用的排序方式 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4005 | 排序方式无效 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/sort/apply" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"sort_by": "price_asc", "filters": {"city_id": "city_001", "stars": [4, 5]}}'
```

## 5. 收藏操作

### 5.1 收藏酒店

**接口地址:** `POST /mobile/favorites/add`

**描述:** 收藏酒店

**请求参数:** 无

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "hotel_id": "hotel_001"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |

**响应示例:**
```json
{
  "code": 0,
  "msg": "收藏成功",
  "data": {
    "hotel_id": "hotel_001",
    "is_favorite": true,
    "favorite_count": 568
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| is_favorite | boolean | 是否收藏 |
| favorite_count | number | 收藏数 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |
| 4007 | 已收藏该酒店 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/favorites/add" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"hotel_id": "hotel_001"}'
```

### 5.2 取消收藏

**接口地址:** `POST /mobile/favorites/remove`

**描述:** 取消收藏酒店

**请求参数:** 无

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "hotel_id": "hotel_001"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |

**响应示例:**
```json
{
  "code": 0,
  "msg": "取消收藏成功",
  "data": {
    "hotel_id": "hotel_001",
    "is_favorite": false,
    "favorite_count": 566
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| is_favorite | boolean | 是否收藏 |
| favorite_count | number | 收藏数 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |
| 4008 | 未收藏该酒店 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/favorites/remove" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"hotel_id": "hotel_001"}'
```

## 6. 用户反馈

### 6.1 标记不感兴趣

**接口地址:** `POST /mobile/hotels/not-interested`

**描述:** 标记酒店为不感兴趣

**请求参数:** 无

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "hotel_id": "hotel_001",
  "reason": "价格过高"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_id | string | 是 | 酒店ID |
| reason | string | 否 | 不感兴趣原因 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "标记成功",
  "data": {
    "hotel_id": "hotel_001",
    "is_hidden": true
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| is_hidden | boolean | 是否已隐藏 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/hotels/not-interested" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"hotel_id": "hotel_001", "reason": "价格过高"}'
```

### 6.2 批量标记不感兴趣

**接口地址:** `POST /mobile/hotels/batch-not-interested`

**描述:** 批量标记酒店为不感兴趣

**请求参数:** 无

**请求头:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer {token} |
| Content-Type | string | 是 | application/json |

**请求体:**
```json
{
  "hotel_ids": ["hotel_001", "hotel_002", "hotel_003"],
  "reason": "不符合需求"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_ids | array | 是 | 酒店ID数组 |
| reason | string | 否 | 不感兴趣原因 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "批量标记成功",
  "data": {
    "marked_count": 3,
    "hotel_ids": ["hotel_001", "hotel_002", "hotel_003"]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| marked_count | number | 标记成功数量 |
| hotel_ids | array | 标记的酒店ID |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4009 | 酒店ID列表不能为空 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/hotels/batch-not-interested" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"hotel_ids": ["hotel_001", "hotel_002"], "reason": "不符合需求"}'
```