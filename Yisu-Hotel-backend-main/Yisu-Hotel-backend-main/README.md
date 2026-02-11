# Yisu-Hotel-backend
易宿酒店预订平台后端

## 项目简介
易宿酒店预订平台是一个基于Node.js和Express开发的酒店预订系统后端，提供PC端和移动端的API接口，支持酒店管理、用户认证、预订支付等核心功能。

## 技术栈
- **后端框架**: Node.js + Express
- **数据库**: PostgreSQL + Sequelize ORM
- **认证**: JWT (JSON Web Token)
- **数据验证**: express-validator
- **日志**: Winston
- **测试**: Jest + Supertest
- **环境配置**: dotenv
- **密码加密**: bcryptjs
- **CORS**: cors

## 安装步骤
1. **克隆项目**
   ```bash
   git clone <项目仓库地址>
   cd Yisu-Hotel-backend
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   创建 `.env` 文件，配置以下环境变量：
   ```env
   # 数据库连接信息
   DATABASE_URL="postgresql://username:password@localhost:5432/yisu_hotel"

   # JWT密钥
   JWT_SECRET="your_jwt_secret_key"

   # 服务器配置
   PORT=3000
   NODE_ENV="development"
   ```

4. **初始化数据库**
   ```bash
   node database/init-db.js
   ```

5. **填充种子数据**
   ```bash
   node database/seed-database.js
   ```

## 运行方式

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
npm start
```

### 运行测试
```bash
npm test
```

### 代码检查
```bash
npm run lint
```

## 目录结构
```
Yisu-Hotel-backend/
├── database/         # 数据库相关文件
│   ├── init-db.js    # 数据库初始化脚本
│   ├── init.sql      # 数据库初始化SQL
│   ├── reset-database.js  # 数据库重置脚本
│   ├── seed-database.js   # 种子数据填充脚本
│   └── seed-test-hotels.js # 测试酒店数据填充脚本
├── docs/             # 文档目录
│   ├── M-api-document1.md # 移动端API文档1
│   ├── M-api-document2.md # 移动端API文档2
│   ├── M-api-document3.md # 移动端API文档3
│   ├── M-api-document4.md # 移动端API文档4
│   ├── M-api-document5.md # 移动端API文档5
│   ├── M-database-document.md # 移动端数据库文档
│   ├── PC-api-document1.md # PC端API文档1
│   ├── PC-api-document2.md # PC端API文档2
│   ├── PC-api-document3.md # PC端API文档3
│   ├── PC-database-document.md # PC端数据库文档
│   ├── product-document.md # 产品文档
│   └── team-rules.md # 团队规则
├── logs/             # 日志目录
├── src/              # 源代码目录
│   ├── config/       # 配置文件
│   ├── controllers/  # 控制器
│   ├── middlewares/  # 中间件
│   ├── models/       # 数据模型
│   ├── routes/       # 路由
│   ├── tests/        # 测试文件
│   └── utils/        # 工具函数
├── tests/            # 测试目录
├── .env              # 环境变量配置
├── .gitignore        # Git忽略文件
├── app.js            # 应用入口
├── package.json      # 项目配置
└── README.md         # 项目说明
```

## API文档
- **PC端API文档**: 详见 `docs/PC-api-document*.md`
- **移动端API文档**: 详见 `docs/M-api-document*.md`

## 核心功能

### PC端功能
- **酒店管理**: 创建、编辑、删除、查询酒店信息
- **用户管理**: 管理员用户的登录、注册、权限管理
- **数据统计**: 酒店预订数据统计和分析

### 移动端功能
- **用户认证**: 登录、注册、第三方登录（微信、支付宝）
- **酒店搜索**: 按城市、价格、星级等条件搜索酒店
- **酒店详情**: 查看酒店详细信息、房型、设施等
- **预订管理**: 创建预订、查看预订列表、取消预订
- **支付功能**: 在线支付预订费用
- **个人中心**: 用户信息管理、收藏夹、优惠券

## 测试
项目使用Jest和Supertest进行测试，测试文件位于 `tests/` 目录。

运行测试：
```bash
npm test
```

## 部署
### 服务器要求
- Node.js 14.0+
- PostgreSQL 10.0+
- 至少1GB内存

### 部署步骤
1. **准备服务器环境**
2. **安装依赖**
3. **配置环境变量**
4. **初始化数据库**
5. **启动应用**

### 推荐部署方式
- 使用PM2管理应用进程
- 使用Nginx作为反向代理
- 配置HTTPS证书

## 监控与维护
- **日志管理**: 应用日志存储在 `logs/` 目录
- **错误监控**: 使用Winston记录错误日志
- **性能监控**: 内置监控中间件，可通过 `/api/monitoring` 接口查看

## 贡献指南
1. **Fork项目仓库**
2. **创建新分支**
3. **提交代码**
4. **创建Pull Request**

## 许可证
MIT License

## 联系方式
- **项目维护者**: <维护者姓名>
- **邮箱**: <维护者邮箱>
- **项目地址**: <项目仓库地址>

