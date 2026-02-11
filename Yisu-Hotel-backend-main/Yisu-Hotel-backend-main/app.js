require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const logger = require('./src/utils/logger');
const { monitoringMiddleware, getMonitoringStats, resetMonitoringStats } = require('./src/middlewares/monitoring');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 监控中间件
app.use(monitoringMiddleware);

// 自定义morgan格式，使用winston记录请求日志
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    }
  }
}));

app.get('/api/status', (req, res) => {
  res.json({ code: 200, msg: 'Express后端服务启动成功！', data: null });
});

app.get('/api/test', (req, res) => {
  res.json({code: 200, msg: '前后端连通性测试成功', data: {timestamp: new Date().toISOString(), method: req.method, path: req.path}});
});

app.get('/api/health', (req, res) => {
  res.json({ code: 200, msg: '健康检查成功', data: { timestamp: new Date().toISOString(), status: 'healthy' } });
});

// 根路径默认响应
app.get('/', (req, res) => {
  res.json({ 
    code: 200, 
    msg: '易宿酒店预订平台后端服务', 
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        status: '/api/status',
        test: '/api/test',
        monitoring: '/api/monitoring'
      }
    } 
  });
});

// 监控统计信息API
app.get('/api/monitoring', (req, res) => {
  const stats = getMonitoringStats();
  res.json({ 
    code: 200, 
    msg: '获取监控统计信息成功', 
    data: stats 
  });
});

// 重置监控统计信息API
app.post('/api/monitoring/reset', (req, res) => {
  const stats = resetMonitoringStats();
  res.json({ 
    code: 200, 
    msg: '重置监控统计信息成功', 
    data: stats 
  });
});

const PORT = process.env.PORT;

const authRoutes = require('./src/routes/pc/auth');
app.use('/auth', authRoutes);

const userRoutes = require('./src/routes/pc/user');
app.use('/user', userRoutes);

const hotelRoutes = require('./src/routes/pc/hotel');
app.use('/hotel', hotelRoutes);

// 移动端路由
const mobileAuthRoutes = require('./src/routes/mobile/auth');
app.use('/mobile/auth', mobileAuthRoutes);

const mobileUserRoutes = require('./src/routes/mobile/user');
app.use('/mobile/user', mobileUserRoutes);

const mobileHotelRoutes = require('./src/routes/mobile/hotel');
app.use('/mobile/hotels', mobileHotelRoutes);

const mobileBookingRoutes = require('./src/routes/mobile/booking');
app.use('/mobile/bookings', mobileBookingRoutes);

const mobileFavoriteRoutes = require('./src/routes/mobile/favorite');
app.use('/mobile/favorites', mobileFavoriteRoutes);

const mobilePromotionRoutes = require('./src/routes/mobile/promotion');
app.use('/mobile/promotions', mobilePromotionRoutes);

const mobileCityRoutes = require('./src/routes/mobile/city');
app.use('/mobile/cities', mobileCityRoutes);

const mobilePaymentRoutes = require('./src/routes/mobile/payment');
app.use('/mobile/payment', mobilePaymentRoutes);

const mobileBannerRoutes = require('./src/routes/mobile/banner');
app.use('/mobile/banner', mobileBannerRoutes);

const mobileHomeRoutes = require('./src/routes/mobile/home');
app.use('/mobile/home', mobileHomeRoutes);

const mobileLocationRoutes = require('./src/routes/mobile/location');
app.use('/mobile/location', mobileLocationRoutes);

const mobileReviewRoutes = require('./src/routes/mobile/review');
app.use('/mobile/reviews', mobileReviewRoutes);

const mobileNearbyRoutes = require('./src/routes/mobile/nearby');
app.use('/mobile/nearby', mobileNearbyRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('服务器错误:', { 
    error: err.message, 
    stack: err.stack, 
    method: req.method, 
    url: req.url, 
    params: req.params, 
    query: req.query,
    body: req.body 
  });
  res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
});

app.listen(PORT, () => {
  logger.info(`🚀 Express服务运行在：http://localhost:${PORT}`);
});

module.exports = app;
