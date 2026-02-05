# 手机端 API 接口文档 - 酒店查询页

## 目录

- [基础信息](#基础信息)
- [Banner管理](#bannermanagement)
- [城市定位](#citylocation)
- [酒店搜索](#hotelsearch)
- [筛选管理](#filtramanagement)
- [快捷标签](#quicktags)

## 1. 基础信息

- 基础URL: `http://localhost:{PORT}`
- 认证方式: Bearer Token（所有接口需在请求头中携带 `Authorization: Bearer {token}`）
- 字符集: UTF-8
- 时区: UTC

## 2. Banner管理

### 2.1 获取首页Banner

**接口地址:** `GET /mobile/banner/list`

**描述:** 获取首页推广广告Banner列表

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
    "banners": [
      {
        "id": "banner_001",
        "image_url": "https://example.com/banner1.jpg",
        "title": "春节特惠，低至 8 折",
        "description": "精选酒店春节促销",
        "target_type": "hotel",
        "target_id": "hotel_001",
        "link_url": "",
        "sort": 1,
        "start_time": "2026-01-01T00:00:00Z",
        "end_time": "2026-02-28T23:59:59Z",
        "is_active": true
      },
      {
        "id": "banner_002",
        "image_url": "https://example.com/banner2.jpg",
        "title": "新用户专享优惠",
        "description": "首次预订立减 50 元",
        "target_type": "promotion",
        "target_id": "promo_001",
        "link_url": "",
        "sort": 2,
        "start_time": "2026-01-01T00:00:00Z",
        "end_time": "2026-12-31T23:59:59Z",
        "is_active": true
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| banners | array | Banner列表 |
| banners[].id | string | BannerID |
| banners[].image_url | string | Banner图片URL |
| banners[].title | string | Banner标题 |
| banners[].description | string | Banner描述 |
| banners[].target_type | string | 目标类型：hotel（酒店）、promotion（优惠）、url（链接） |
| banners[].target_id | string | 目标ID |
| banners[].link_url | string | 跳转链接（当target_type为url时使用） |
| banners[].sort | number | 排序权重 |
| banners[].start_time | string | 开始时间 |
| banners[].end_time | string | 结束时间 |
| banners[].is_active | boolean | 是否激活 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/banner/list" \
  -H "Authorization: Bearer {token}"
```

## 3. 城市定位

### 3.1 获取当前城市

**接口地址:** `GET /mobile/city/current`

**描述:** 获取用户当前所在城市（基于IP定位）

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
    "city_id": "city_001",
    "city_name": "北京市",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "is_default": true
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| city_id | string | 城市ID |
| city_name | string | 城市名称 |
| latitude | number | 纬度 |
| longitude | number | 经度 |
| is_default | boolean | 是否默认城市 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4001 | 定位失败，请手动选择城市 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/city/current" \
  -H "Authorization: Bearer {token}"
```

### 3.2 切换默认城市

**接口地址:** `POST /mobile/city/set-default`

**描述:** 设置默认城市

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
  "city_name": "北京市"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| city_id | string | 是 | 城市ID |
| city_name | string | 是 | 城市名称 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "设置成功",
  "data": {
    "city_id": "city_001",
    "city_name": "北京市",
    "is_default": true
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| city_id | string | 城市ID |
| city_name | string | 城市名称 |
| is_default | boolean | 是否默认城市 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4002 | 城市ID无效 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/mobile/city/set-default" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"city_id": "city_001", "city_name": "北京市"}'
```

### 3.3 搜索城市

**接口地址:** `GET /mobile/city/search`

**描述:** 根据关键字搜索城市

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 是 | 搜索关键字（城市名称） |

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
    "cities": [
      {
        "city_id": "city_001",
        "city_name": "北京市",
        "latitude": 39.9042,
        "longitude": 116.4074
      },
      {
        "city_id": "city_002",
        "city_name": "北京市朝阳区",
        "latitude": 39.9219,
        "longitude": 116.4551
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| cities | array | 城市列表 |
| cities[].city_id | string | 城市ID |
| cities[].city_name | string | 城市名称 |
| cities[].latitude | number | 纬度 |
| cities[].longitude | number | 经度 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4003 | 搜索关键字不能为空 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/city/search?keyword=北京" \
  -H "Authorization: Bearer {token}"
```

## 4. 酒店搜索

### 4.1 综合搜索酒店

**接口地址:** `GET /mobile/hotels/search`

**描述:** 综合搜索酒店（支持关键字、城市、日期、筛选条件等）

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
| sort_by | string | 否 | 排序方式：price_asc, price_desc, distance_asc, rating_desc |
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
  "msg": "搜索成功",
  "data": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "hotels": [
      {
        "hotel_id": "hotel_001",
        "hotel_name": "易宿酒店",
        "address": "北京市朝阳区建国路88号",
        "star_rating": 4,
        "min_price": 299,
        "max_price": 599,
        "main_image_url": "https://example.com/hotel1.jpg",
        "distance": "2.5km",
        "rating": 4.5,
        "tags": ["免费停车场", "含早餐", "WiFi"],
        "facilities": ["parking", "wifi", "breakfast", "gym"]
      },
      {
        "hotel_id": "hotel_002",
        "hotel_name": "阳光酒店",
        "address": "北京市朝阳区望京SOHO",
        "star_rating": 5,
        "min_price": 499,
        "max_price": 899,
        "main_image_url": "https://example.com/hotel2.jpg",
        "distance": "3.8km",
        "rating": 4.8,
        "tags": ["亲子友好", "豪华型", "含早餐"],
        "facilities": ["parking", "wifi", "breakfast", "pool", "gym", "spa"]
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
| hotels | array | 酒店列表 |
| hotels[].hotel_id | string | 酒店ID |
| hotels[].hotel_name | string | 酒店名称 |
| hotels[].address | string | 酒店地址 |
| hotels[].star_rating | number | 酒店星级 |
| hotels[].min_price | number | 最低价格 |
| hotels[].max_price | number | 最高价格 |
| hotels[].main_image_url | string | 酒店主图片URL |
| hotels[].distance | string | 距离 |
| hotels[].rating | number | 评分 |
| hotels[].tags | array | 酒店标签 |
| hotels[].facilities | array | 酒店设施 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4004 | 日期格式不正确 |
| 4005 | 离店日期必须晚于入住日期 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/search?keyword=酒店&city_id=city_001&check_in=2026-02-01&check_out=2026-02-02&min_price=200&max_price=600&stars=4,5&tags=family,parking" \
  -H "Authorization: Bearer {token}"
```

### 4.2 获取酒店详情

**接口地址:** `GET /mobile/hotels/detail/:id`

**描述:** 获取酒店详细信息

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 酒店ID（路径参数） |
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
    "opening_date": "2020-01-01",
    "description": "易宿酒店是一家舒适型商务酒店，位于北京市朝阳区核心商圈。",
    "main_image_url": "https://example.com/hotel1.jpg",
    "images": [
      "https://example.com/hotel1.jpg",
      "https://example.com/hotel2.jpg",
      "https://example.com/hotel3.jpg"
    ],
    "min_price": 299,
    "max_price": 599,
    "rating": 4.5,
    "review_count": 1234,
    "tags": ["免费停车场", "含早餐", "WiFi", "商务中心"],
    "facilities": [
      {"id": "parking", "name": "免费停车场", "icon": "parking.png"},
      {"id": "wifi", "name": "免费WiFi", "icon": "wifi.png"},
      {"id": "breakfast", "name": "含早餐", "icon": "breakfast.png"},
      {"id": "gym", "name": "健身房", "icon": "gym.png"}
    ],
    "room_types": [
      {
        "room_id": "room_001",
        "room_type": "大床房",
        "price": 299,
        "room_image_url": "https://example.com/room1.jpg",
        "description": "20㎡，1.8米大床，免费WiFi",
        "availability": 10
      },
      {
        "room_id": "room_002",
        "room_type": "双床房",
        "price": 329,
        "room_image_url": "https://example.com/room2.jpg",
        "description": "25㎡，两张1.2米床，免费WiFi",
        "availability": 5
      }
    ],
    "nearby_places": [
      {
        "name": "国贸商城",
        "distance": "1km",
        "type": "shopping"
      },
      {
        "name": "地铁1号线永安里站",
        "distance": "500m",
        "type": "transport"
      }
    ]
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
| opening_date | string | 开业时间 |
| description | string | 酒店描述 |
| main_image_url | string | 酒店主图片URL |
| images | array | 酒店图片列表 |
| min_price | number | 最低价格 |
| max_price | number | 最高价格 |
| rating | number | 评分 |
| review_count | number | 评论数 |
| tags | array | 酒店标签 |
| facilities | array | 酒店设施 |
| facilities[].id | string | 设施ID |
| facilities[].name | string | 设施名称 |
| facilities[].icon | string | 设施图标 |
| room_types | array | 房型列表 |
| room_types[].room_id | string | 房型ID |
| room_types[].room_type | string | 房型名称 |
| room_types[].price | number | 房型价格 |
| room_types[].room_image_url | string | 房型图片URL |
| room_types[].description | string | 房型描述 |
| room_types[].availability | number | 可用数量 |
| nearby_places | array | 周边场所 |
| nearby_places[].name | string | 场所名称 |
| nearby_places[].distance | string | 距离 |
| nearby_places[].type | string | 场所类型 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |
| 4006 | 酒店不存在 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/hotels/detail/hotel_001?check_in=2026-02-01&check_out=2026-02-02" \
  -H "Authorization: Bearer {token}"
```

## 5. 筛选管理

### 5.1 获取筛选选项

**接口地址:** `GET /mobile/filters/options`

**描述:** 获取酒店筛选选项（星级、设施等）

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
    "stars": [
      {"value": 1, "label": "1星", "count": 10},
      {"value": 2, "label": "2星", "count": 25},
      {"value": 3, "label": "3星", "count": 45},
      {"value": 4, "label": "4星", "count": 30},
      {"value": 5, "label": "5星", "count": 15}
    ],
    "price_ranges": [
      {"min": 0, "max": 200, "label": "200元以下", "count": 30},
      {"min": 200, "max": 400, "label": "200-400元", "count": 45},
      {"min": 400, "max": 600, "label": "400-600元", "count": 35},
      {"min": 600, "max": 800, "label": "600-800元", "count": 20},
      {"min": 800, "max": null, "label": "800元以上", "count": 15}
    ],
    "facilities": [
      {"id": "parking", "name": "免费停车场", "icon": "parking.png", "count": 80},
      {"id": "wifi", "name": "免费WiFi", "icon": "wifi.png", "count": 100},
      {"id": "breakfast", "name": "含早餐", "icon": "breakfast.png", "count": 60},
      {"id": "pool", "name": "游泳池", "icon": "pool.png", "count": 30},
      {"id": "gym", "name": "健身房", "icon": "gym.png", "count": 50},
      {"id": "spa", "name": "SPA", "icon": "spa.png", "count": 25}
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| stars | array | 星级选项 |
| stars[].value | number | 星级值 |
| stars[].label | string | 星级标签 |
| stars[].count | number | 数量 |
| price_ranges | array | 价格区间 |
| price_ranges[].min | number | 最低价格 |
| price_ranges[].max | number | 最高价格（null表示无上限） |
| price_ranges[].label | string | 价格标签 |
| price_ranges[].count | number | 数量 |
| facilities | array | 设施选项 |
| facilities[].id | string | 设施ID |
| facilities[].name | string | 设施名称 |
| facilities[].icon | string | 设施图标 |
| facilities[].count | number | 数量 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/filters/options" \
  -H "Authorization: Bearer {token}"
```

## 6. 快捷标签

### 6.1 获取快捷标签

**接口地址:** `GET /mobile/tags/quick`

**描述:** 获取酒店快捷标签列表

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
    "tags": [
      {"id": "family", "name": "亲子友好", "icon": "family.png", "count": 45},
      {"id": "parking", "name": "免费停车场", "icon": "parking.png", "count": 80},
      {"id": "breakfast", "name": "含早餐", "icon": "breakfast.png", "count": 60},
      {"id": "deluxe", "name": "豪华型", "icon": "deluxe.png", "count": 30},
      {"id": "business", "name": "商务型", "icon": "business.png", "count": 55},
      {"id": "budget", "name": "经济型", "icon": "budget.png", "count": 70},
      {"id": "pet", "name": "宠物友好", "icon": "pet.png", "count": 20},
      {"id": "pool", "name": "游泳池", "icon": "pool.png", "count": 30}
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| tags | array | 快捷标签列表 |
| tags[].id | string | 标签ID |
| tags[].name | string | 标签名称 |
| tags[].icon | string | 标签图标 |
| tags[].count | number | 数量 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，请先登录 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/mobile/tags/quick" \
  -H "Authorization: Bearer {token}"
```