# 酒店信息管理 API 接口文档

## 目录

- [基础信息](#基础信息)
- [酒店信息管理](#酒店信息管理)
- [地图相关](#地图相关)
- [审核相关](#审核相关)

## 1. 基础信息

- 基础URL: `http://localhost:{PORT}`
- 认证方式: Bearer Token（所有接口需在请求头中携带 `Authorization: Bearer {token}`）

## 2. 酒店信息管理

### 2.1 创建酒店信息

**接口地址:** `POST /hotel/create`

**描述:** 创建新的酒店信息并提交审核

**请求参数:** 无

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**
```json
{
  "hotel_name_cn": "易宿酒店",
  "hotel_name_en": "Yisu Hotel",
  "formatted_address": "北京市朝阳区建国路88号",
  "address_component": {
    "country": "中国",
    "province": "北京市",
    "city": "北京市",
    "district": "朝阳区",
    "street": "建国路",
    "street_number": "88号"
  },
  "star_rating": 4,
  "main_image_url": "https://example.com/hotel1.jpg",
  "room_prices": [
    {
      "room_type": "大床房",
      "price": 299.00,
      "room_image_url": "https://example.com/room1.jpg"
    },
    {
      "room_type": "双床房",
      "price": 329.00,
      "room_image_url": "https://example.com/room2.jpg"
    },
    {
      "room_type": "套房",
      "price": 599.00,
      "room_image_url": "https://example.com/room3.jpg"
    }
  ],
  "opening_date": "2020-01-01",
  "nearby_info": "距离地铁站500米，周边有商场、餐厅",
  "promotion_scenario": "节日优惠"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_name_cn | string | 是 | 酒店中文名称 |
| hotel_name_en | string | 是 | 酒店英文名称 |
| formatted_address | string | 是 | 完整地址（地图选点后自动填充） |
| address_component | object | 是 | 地址组件（地图选点后自动填充） |
| address_component.country | string | 是 | 国家 |
| address_component.province | string | 是 | 省份 |
| address_component.city | string | 是 | 城市 |
| address_component.district | string | 是 | 区县 |
| address_component.street | string | 是 | 街道 |
| address_component.street_number | string | 是 | 门牌号 |
| star_rating | int | 是 | 酒店星级（1-5星） |
| main_image_url | string | 否 | 酒店主图片URL |
| room_prices | array | 是 | 房型价格列表 |
| room_prices[].room_type | string | 是 | 房型名称 |
| room_prices[].price | number | 是 | 房型价格（保留2位小数） |
| room_prices[].room_image_url | string | 否 | 房型图片URL |
| opening_date | string | 是 | 开业时间（格式：YYYY-MM-DD） |
| nearby_info | string | 否 | 周边信息（景点、交通等） |
| promotion_scenario | string | 否 | 优惠场景 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "酒店信息创建成功，等待审核",
  "data": {
    "hotel_id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "pending"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID（UUID） |
| status | string | 状态：pending（待审核） |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4001 | 必填项不能为空 |
| 4002 | 酒店名称已存在 |
| 4003 | 酒店星级格式不正确 |
| 4004 | 房型格式不正确 |
| 4005 | 价格格式不正确 |
| 4006 | 开业时间格式不正确 |
| 4007 | 地址格式不正确 |
| 4008 | Token 无效或已过期 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/hotel/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "hotel_name_cn": "易宿酒店",
    "hotel_name_en": "Yisu Hotel",
    "formatted_address": "北京市朝阳区建国路88号",
    "address_component": {
      "country": "中国",
      "province": "北京市",
      "city": "北京市",
      "district": "朝阳区",
      "street": "建国路",
      "street_number": "88号"
    },
    "star_rating": 4,
    "room_prices": [
      {
        "room_type": "大床房",
        "price": 299.00
      },
      {
        "room_type": "双床房",
        "price": 329.00
      },
      {
        "room_type": "套房",
        "price": 599.00
      }
    ],
    "opening_date": "2020-01-01",
    "nearby_info": "距离地铁站500米，周边有商场、餐厅",
    "promotion_scenario": "节日优惠"
  }'
```

---

### 2.2 保存草稿

**接口地址:** `POST /hotel/draft`

**描述:** 保存酒店信息草稿，未完成填写时可随时保存

**请求参数:** 无

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**
```json
{
  "hotel_name_cn": "易宿酒店",
  "hotel_name_en": "Yisu Hotel",
  "formatted_address": "北京市朝阳区建国路88号",
  "address_component": {
    "country": "中国",
    "province": "北京市",
    "city": "北京市",
    "district": "朝阳区",
    "street": "建国路",
    "street_number": "88号"
  },
  "star_rating": 4,
  "main_image_url": "https://example.com/hotel1.jpg",
  "room_prices": [
    {
      "room_type": "大床房",
      "price": 299.00,
      "room_image_url": "https://example.com/room1.jpg"
    },
    {
      "room_type": "双床房",
      "price": 329.00,
      "room_image_url": "https://example.com/room2.jpg"
    }
  ],
  "opening_date": "2020-01-01"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_name_cn | string | 否 | 酒店中文名称 |
| hotel_name_en | string | 否 | 酒店英文名称 |
| formatted_address | string | 否 | 完整地址 |
| address_component | object | 否 | 地址组件 |
| star_rating | int | 否 | 酒店星级（1-5星） |
| main_image_url | string | 否 | 酒店主图片URL |
| room_prices | array | 否 | 房型价格列表 |
| room_prices[].room_type | string | 否 | 房型名称 |
| room_prices[].price | number | 否 | 房型价格（保留2位小数） |
| room_prices[].room_image_url | string | 否 | 房型图片URL |
| opening_date | string | 否 | 开业时间（格式：YYYY-MM-DD） |
| nearby_info | string | 否 | 周边信息 |
| promotion_scenario | string | 否 | 优惠场景 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "草稿已保存",
  "data": {
    "hotel_id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "draft"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID（UUID） |
| status | string | 状态：draft（草稿） |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4003 | 酒店星级格式不正确 |
| 4004 | 房型格式不正确 |
| 4005 | 价格格式不正确 |
| 4006 | 开业时间格式不正确 |
| 4007 | 地址格式不正确 |
| 4008 | Token 无效或已过期 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/hotel/draft" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "hotel_name_cn": "易宿酒店",
    "hotel_name_en": "Yisu Hotel",
    "formatted_address": "北京市朝阳区建国路88号",
    "address_component": {
      "country": "中国",
      "province": "北京市",
      "city": "北京市",
      "district": "朝阳区",
      "street": "建国路",
      "street_number": "88号"
    },
    "star_rating": 4,
    "room_prices": [
      {
        "room_type": "大床房",
        "price": 299.00
      },
      {
        "room_type": "双床房",
        "price": 329.00
      }
    ],
    "opening_date": "2020-01-01"
  }'
```

---

### 2.3 获取酒店列表

**接口地址:** `GET /hotel/list`

**描述:** 分页查询酒店列表（仅返回当前商户创建的酒店）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| page_size | int | 否 | 每页数量，默认 10 |
| status | string | 否 | 状态筛选：draft（草稿）、pending（待审核）、approved（已通过）、rejected（已拒绝） |
| keyword | string | 否 | 搜索关键词（酒店名称） |

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "total": 5,
    "page": 1,
    "page_size": 10,
    "list": [
      {
        "hotel_id": "550e8400-e29b-41d4-a716-446655440001",
        "hotel_name_cn": "易宿酒店",
        "hotel_name_en": "Yisu Hotel",
        "formatted_address": "北京市朝阳区建国路88号",
        "star_rating": 4,
        "main_image_url": "https://example.com/hotel1.jpg",
        "room_prices": [
          {
            "room_type": "大床房",
            "price": 299.00,
            "room_image_url": "https://example.com/room1.jpg"
          },
          {
            "room_type": "双床房",
            "price": 329.00,
            "room_image_url": "https://example.com/room2.jpg"
          }
        ],
        "status": "approved",
        "created_by": "550e8400-e29b-41d4-a716-446655440000",
        "created_at": "2026-02-01T10:00:00.000Z",
        "updated_at": "2026-02-03T15:30:00.000Z"
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| total | int | 总数量 |
| page | int | 当前页码 |
| page_size | int | 每页数量 |
| list | array | 酒店列表 |
| list[].hotel_id | string | 酒店ID |
| list[].hotel_name_cn | string | 酒店中文名称 |
| list[].hotel_name_en | string | 酒店英文名称 |
| list[].formatted_address | string | 完整地址 |
| list[].star_rating | int | 酒店星级 |
| list[].main_image_url | string | 酒店主图片URL |
| list[].room_prices | array | 房型价格列表 |
| list[].room_prices[].room_type | string | 房型名称 |
| list[].room_prices[].price | number | 房型价格 |
| list[].room_prices[].room_image_url | string | 房型图片URL |
| list[].status | string | 状态 |
| list[].created_by | string | 创建人ID |
| list[].created_at | string | 创建时间 |
| list[].updated_at | string | 更新时间 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4008 | Token 无效或已过期 |
| 4009 | 参数格式不正确 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/hotel/list?page=1&page_size=10&status=approved" \
  -H "Authorization: Bearer {token}"
```

---

### 2.4 获取酒店详情

**接口地址:** `GET /hotel/detail/:id`

**描述:** 根据酒店ID获取详细信息

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 酒店ID（路径参数） |

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "hotel_id": "550e8400-e29b-41d4-a716-446655440001",
    "hotel_name_cn": "易宿酒店",
    "hotel_name_en": "Yisu Hotel",
    "formatted_address": "北京市朝阳区建国路88号",
    "address_component": {
      "country": "中国",
      "province": "北京市",
      "city": "北京市",
      "district": "朝阳区",
      "street": "建国路",
      "street_number": "88号"
    },
    "star_rating": 4,
    "main_image_url": "https://example.com/hotel1.jpg",
    "room_prices": [
      {
        "room_type": "大床房",
        "price": 299.00,
        "room_image_url": "https://example.com/room1.jpg"
      },
      {
        "room_type": "双床房",
        "price": 329.00,
        "room_image_url": "https://example.com/room2.jpg"
      },
      {
        "room_type": "套房",
        "price": 599.00,
        "room_image_url": "https://example.com/room3.jpg"
      }
    ],
    "opening_date": "2020-01-01",
    "nearby_info": "距离地铁站500米，周边有商场、餐厅",
    "promotion_scenario": "节日优惠",
    "status": "approved",
    "created_by": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-02-01T10:00:00.000Z",
    "updated_at": "2026-02-03T15:30:00.000Z"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| hotel_name_cn | string | 酒店中文名称 |
| hotel_name_en | string | 酒店英文名称 |
| formatted_address | string | 完整地址 |
| address_component | object | 地址组件 |
| star_rating | int | 酒店星级 |
| main_image_url | string | 酒店主图片URL |
| room_prices | array | 房型价格列表 |
| room_prices[].room_type | string | 房型名称 |
| room_prices[].price | number | 房型价格 |
| room_prices[].room_image_url | string | 房型图片URL |
| opening_date | string | 开业时间 |
| nearby_info | string | 周边信息 |
| promotion_scenario | string | 优惠场景 |
| status | string | 状态 |
| created_by | string | 创建人ID |
| created_at | string | 创建时间 |
| updated_at | string | 更新时间 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4008 | Token 无效或已过期 |
| 4010 | 酒店不存在 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/hotel/detail/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer {token}"
```

---

### 2.5 更新酒店信息

**接口地址:** `PUT /hotel/update/:id`

**描述:** 更新已录入的酒店信息

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 酒店ID（路径参数） |

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**
```json
{
  "hotel_name_cn": "易宿酒店（更新）",
  "hotel_name_en": "Yisu Hotel (Updated)",
  "formatted_address": "北京市朝阳区建国路100号",
  "address_component": {
    "country": "中国",
    "province": "北京市",
    "city": "北京市",
    "district": "朝阳区",
    "street": "建国路",
    "street_number": "100号"
  },
  "star_rating": 5,
  "main_image_url": "https://example.com/hotel1_updated.jpg",
  "room_prices": [
    {
      "room_type": "大床房",
      "price": 399.00,
      "room_image_url": "https://example.com/room1_updated.jpg"
    },
    {
      "room_type": "双床房",
      "price": 429.00,
      "room_image_url": "https://example.com/room2_updated.jpg"
    },
    {
      "room_type": "套房",
      "price": 699.00,
      "room_image_url": "https://example.com/room3_updated.jpg"
    },
    {
      "room_type": "家庭房",
      "price": 599.00,
      "room_image_url": "https://example.com/room4_updated.jpg"
    }
  ],
  "opening_date": "2020-01-01",
  "nearby_info": "距离地铁站300米，周边有商场、餐厅、公园",
  "promotion_scenario": "机票+酒店套餐"
}
```

**字段说明:**
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| hotel_name_cn | string | 否 | 酒店中文名称 |
| hotel_name_en | string | 否 | 酒店英文名称 |
| formatted_address | string | 否 | 完整地址 |
| address_component | object | 否 | 地址组件 |
| star_rating | int | 否 | 酒店星级（1-5星） |
| main_image_url | string | 否 | 酒店主图片URL |
| room_prices | array | 否 | 房型价格列表 |
| room_prices[].room_type | string | 否 | 房型名称 |
| room_prices[].price | number | 否 | 房型价格（保留2位小数） |
| room_prices[].room_image_url | string | 否 | 房型图片URL |
| opening_date | string | 否 | 开业时间（格式：YYYY-MM-DD） |
| nearby_info | string | 否 | 周边信息 |
| promotion_scenario | string | 否 | 优惠场景 |

**响应示例:**
```json
{
  "code": 0,
  "msg": "更新成功",
  "data": {
    "hotel_id": "550e8400-e29b-41d4-a716-446655440001",
    "updated_at": "2026-02-05T10:00:00.000Z"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| updated_at | string | 更新时间 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4003 | 酒店星级格式不正确 |
| 4004 | 房型格式不正确 |
| 4005 | 价格格式不正确 |
| 4006 | 开业时间格式不正确 |
| 4007 | 地址格式不正确 |
| 4008 | Token 无效或已过期 |
| 4010 | 酒店不存在 |
| 4011 | 无权限修改此酒店 |

**curl 示例:**
```bash
curl -X PUT "http://localhost:{PORT}/hotel/update/550e8400-e29b-41d4-a716-446655440001" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "hotel_name_cn": "易宿酒店（更新）",
    "hotel_name_en": "Yisu Hotel (Updated)",
    "formatted_address": "北京市朝阳区建国路100号",
    "address_component": {
      "country": "中国",
      "province": "北京市",
      "city": "北京市",
      "district": "朝阳区",
      "street": "建国路",
      "street_number": "100号"
    },
    "star_rating": 5,
    "room_prices": [
      {
        "room_type": "大床房",
        "price": 399.00
      },
      {
        "room_type": "双床房",
        "price": 429.00
      },
      {
        "room_type": "套房",
        "price": 699.00
      },
      {
        "room_type": "家庭房",
        "price": 599.00
      }
    ],
    "opening_date": "2020-01-01",
    "nearby_info": "距离地铁站300米，周边有商场、餐厅、公园",
    "promotion_scenario": "机票+酒店套餐"
  }'
```

---

### 2.6 删除酒店

**接口地址:** `DELETE /hotel/delete/:id`

**描述:** 删除酒店信息

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 酒店ID（路径参数） |

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 0,
  "msg": "删除成功",
  "data": null
}
```

**响应字段说明:** 无

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4008 | Token 无效或已过期 |
| 4010 | 酒店不存在 |
| 4011 | 无权限删除此酒店 |
| 4012 | 酒店状态不允许删除 |

**curl 示例:**
```bash
curl -X DELETE "http://localhost:{PORT}/hotel/delete/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer {token}"
```

---

### 2.7 获取历史记录

**接口地址:** `GET /hotel/history/:id`

**描述:** 获取酒店最近3次修改记录

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 酒店ID（路径参数） |

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "hotel_id": "550e8400-e29b-41d4-a716-446655440001",
    "history": [
      {
        "version": 3,
        "modified_by": "550e8400-e29b-41d4-a716-446655440000",
        "modified_at": "2026-02-05T10:00:00.000Z",
        "changes": {
          "star_rating": 5,
          "room_prices": [
            {
              "room_type": "大床房",
              "price": 399.00
            }
          ]
        }
      },
      {
        "version": 2,
        "modified_by": "550e8400-e29b-41d4-a716-446655440001",
        "modified_at": "2026-02-03T15:30:00.000Z",
        "changes": {
          "room_prices": [
            {
              "room_type": "大床房",
              "price": 299.00
            },
            {
              "room_type": "双床房",
              "price": 329.00
            },
            {
              "room_type": "套房",
              "price": 599.00
            }
          ]
        }
      },
      {
        "version": 1,
        "modified_by": "550e8400-e29b-41d4-a716-446655440000",
        "modified_at": "2026-02-01T10:00:00.000Z",
        "changes": {
          "hotel_name_cn": "易宿酒店",
          "hotel_name_en": "Yisu Hotel"
        }
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| history | array | 历史记录列表（最多3条） |
| history[].version | int | 版本号 |
| history[].modified_by | string | 修改人ID |
| history[].modified_at | string | 修改时间 |
| history[].changes | object | 修改内容 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4008 | Token 无效或已过期 |
| 4010 | 酒店不存在 |
| 4011 | 无权限查看此酒店历史 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/hotel/history/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer {token}"
```

## 3. 地图相关

### 3.1 地址逆地理编码

**接口地址:** `GET /map/geocode/reverse`

**描述:** 根据经纬度获取详细地址信息（高德地图API）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| location | string | 是 | 经纬度，格式：经度,纬度（如：116.397428,39.90923） |

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "formatted_address": "北京市朝阳区建国路88号",
    "address_component": {
      "country": "中国",
      "province": "北京市",
      "city": "北京市",
      "district": "朝阳区",
      "street": "建国路",
      "street_number": "88号"
    },
    "location": {
      "longitude": 116.397428,
      "latitude": 39.90923
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| formatted_address | string | 完整地址 |
| address_component | object | 地址组件 |
| address_component.country | string | 国家 |
| address_component.province | string | 省份 |
| address_component.city | string | 城市 |
| address_component.district | string | 区县 |
| address_component.street | string | 街道 |
| address_component.street_number | string | 门牌号 |
| location | object | 经纬度 |
| location.longitude | number | 经度 |
| location.latitude | number | 纬度 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4008 | Token 无效或已过期 |
| 4013 | 经纬度格式不正确 |
| 4014 | 地图服务异常 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/map/geocode/reverse?location=116.397428,39.90923" \
  -H "Authorization: Bearer {token}"
```

---

### 3.2 地址地理编码

**接口地址:** `GET /map/geocode`

**描述:** 根据地址获取经纬度信息（高德地图API）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| address | string | 是 | 地址（如：北京市朝阳区建国路88号） |

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "formatted_address": "北京市朝阳区建国路88号",
    "address_component": {
      "country": "中国",
      "province": "北京市",
      "city": "北京市",
      "district": "朝阳区",
      "street": "建国路",
      "street_number": "88号"
    },
    "location": {
      "longitude": 116.397428,
      "latitude": 39.90923
    }
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| formatted_address | string | 完整地址 |
| address_component | object | 地址组件 |
| address_component.country | string | 国家 |
| address_component.province | string | 省份 |
| address_component.city | string | 城市 |
| address_component.district | string | 区县 |
| address_component.street | string | 街道 |
| address_component.street_number | string | 门牌号 |
| location | object | 经纬度 |
| location.longitude | number | 经度 |
| location.latitude | number | 纬度 |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4008 | Token 无效或已过期 |
| 4015 | 地址格式不正确 |
| 4016 | 地址解析失败 |
| 4014 | 地图服务异常 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/map/geocode?address=北京市朝阳区建国路88号" \
  -H "Authorization: Bearer {token}"
```

## 4. 审核相关

### 4.1 提交审核

**接口地址:** `POST /hotel/submit/:id`

**描述:** 将草稿状态的酒店信息提交审核

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 酒店ID（路径参数） |

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 0,
  "msg": "提交审核成功",
  "data": {
    "hotel_id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "pending"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| status | string | 状态：pending（待审核） |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4001 | 必填项不能为空 |
| 4008 | Token 无效或已过期 |
| 4010 | 酒店不存在 |
| 4011 | 无权限提交此酒店 |
| 4017 | 酒店状态不允许提交审核 |
| 4018 | 酒店已在审核中 |

**curl 示例:**
```bash
curl -X POST "http://localhost:{PORT}/hotel/submit/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer {token}"
```

---

### 4.2 获取审核状态

**接口地址:** `GET /hotel/audit-status/:id`

**描述:** 查询酒店审核状态

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 酒店ID（路径参数） |

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例（待审核）:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "hotel_id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "pending",
    "status_text": "待审核",
    "submitted_at": "2026-02-05T10:00:00.000Z"
  }
}
```

**响应示例（已通过）:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "hotel_id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "approved",
    "status_text": "已通过",
    "submitted_at": "2026-02-05T10:00:00.000Z",
    "audited_at": "2026-02-05T14:00:00.000Z",
    "audited_by": "管理员"
  }
}
```

**响应示例（已拒绝）:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "hotel_id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "rejected",
    "status_text": "已拒绝",
    "submitted_at": "2026-02-05T10:00:00.000Z",
    "audited_at": "2026-02-05T14:00:00.000Z",
    "audited_by": "管理员",
    "reject_reason": "酒店信息不完整，请补充周边信息"
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| hotel_id | string | 酒店ID |
| status | string | 状态：draft（草稿）、pending（待审核）、approved（已通过）、rejected（已拒绝） |
| status_text | string | 状态文本 |
| submitted_at | string | 提交时间 |
| audited_at | string | 审核时间（已审核时返回） |
| audited_by | string | 审核人（已审核时返回） |
| reject_reason | string | 拒绝原因（被拒绝时返回） |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4008 | Token 无效或已过期 |
| 4010 | 酒店不存在 |
| 4011 | 无权限查看此酒店审核状态 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/hotel/audit-status/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer {token}"
```

---

### 4.3 获取审核状态列表

**接口地址:** `GET /hotel/audit-list`

**描述:** 分页查询审核状态列表（商户端，仅返回当前用户提交审核的酒店）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| page_size | int | 否 | 每页数量，默认 10 |
| status | string | 否 | 状态筛选：pending（待审核）、approved（已通过）、rejected（已拒绝） |

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "total": 15,
    "page": 1,
    "page_size": 10,
    "list": [
      {
        "hotel_id": "550e8400-e29b-41d4-a716-446655440001",
        "hotel_name_cn": "易宿酒店",
        "submitted_at": "2026-02-05T10:00:00.000Z",
        "status": "pending",
        "status_text": "待审核"
      },
      {
        "hotel_id": "550e8400-e29b-41d4-a716-446655440002",
        "hotel_name_cn": "阳光酒店",
        "submitted_at": "2026-02-04T14:00:00.000Z",
        "status": "approved",
        "status_text": "已通过",
        "audited_at": "2026-02-05T09:00:00.000Z",
        "audited_by": "550e8400-e29b-41d4-a716-446655440001"
      },
      {
        "hotel_id": "550e8400-e29b-41d4-a716-446655440003",
        "hotel_name_cn": "星空酒店",
        "submitted_at": "2026-02-03T16:00:00.000Z",
        "status": "rejected",
        "status_text": "已拒绝",
        "audited_at": "2026-02-04T10:00:00.000Z",
        "audited_by": "550e8400-e29b-41d4-a716-446655440001",
        "reject_reason": "酒店信息不完整，请补充周边信息"
      }
    ]
  }
}
```

**响应字段说明:**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| total | int | 总数量 |
| page | int | 当前页码 |
| page_size | int | 每页数量 |
| list | array | 审核状态列表 |
| list[].hotel_id | string | 酒店ID |
| list[].hotel_name_cn | string | 酒店名称 |
| list[].submitted_at | string | 提交时间 |
| list[].status | string | 状态：pending（待审核）、approved（已通过）、rejected（已拒绝） |
| list[].status_text | string | 状态文本 |
| list[].audited_at | string | 审核时间（已审核时返回） |
| list[].audited_by | string | 审核人ID（已审核时返回） |
| list[].reject_reason | string | 拒绝原因（被拒绝时返回） |

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 4008 | Token 无效或已过期 |
| 4009 | 参数格式不正确 |

**curl 示例:**
```bash
curl -X GET "http://localhost:{PORT}/hotel/audit-list?page=1&page_size=10&status=pending" \
  -H "Authorization: Bearer {token}"
```