# API 接口文档

## 目录

- [基础信息](#基础信息)
- [API 端点](#api-端点)

## 基础信息

- 基础URL: `http://localhost:{PORT}`

## API 端点

### 1. 服务状态检查

**接口地址:** `GET /api/status`

**描述:** 检查 Express 后端服务是否正常运行

**请求参数:** 无

**响应示例:**
```json
{
  "code": 200,
  "msg": "Express后端服务启动成功！",
  "data": null
}
```

**响应字段说明:**
- `code`: 响应状态码，200 表示成功
- `msg`: 响应消息
- `data`: 响应数据，此接口为 null

**curl 示例:**
```bash
curl -X GET http://localhost:{PORT}/api/status
```

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 500 | 服务器内部错误 |

---

### 2. 前后端连通性测试

**接口地址:** `GET /api/test`

**描述:** 测试前后端连接是否正常

**请求参数:** 无

**响应示例:**
```json
{
  "code": 200,
  "msg": "前后端连通性测试成功",
  "data": {
    "timestamp": "2026-02-03T12:00:00.000Z",
    "method": "GET",
    "path": "/api/test"
  }
}
```

**响应字段说明:**
- `code`: 响应状态码，200 表示成功
- `msg`: 响应消息
- `data`: 响应数据对象
  - `timestamp`: 请求时间戳（ISO 8601格式）
  - `method`: HTTP请求方法
  - `path`: 请求路径

**curl 示例:**
```bash
curl -X GET http://localhost:{PORT}/api/test
```

**错误码:**
| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 500 | 服务器内部错误 |
