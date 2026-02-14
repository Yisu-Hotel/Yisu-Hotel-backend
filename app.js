require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/pc/auth');
const mobileAuthRoutes = require('./src/routes/mobile/auth');
const userRoutes = require('./src/routes/pc/user');
const hotelRoutes = require('./src/routes/pc/hotel');
const adminRoutes = require('./src/routes/pc/admin');

// 移动端其他路由
const mobileBannerRoutes = require('./src/routes/mobile/banner');
const mobileCityRoutes = require('./src/routes/mobile/city');
const mobileHomeRoutes = require('./src/routes/mobile/home');
const mobileHotelRoutes = require('./src/routes/mobile/hotel');
const mobileBookingRoutes = require('./src/routes/mobile/booking');
const mobileUserRoutes = require('./src/routes/mobile/user');
const mobileFavoriteRoutes = require('./src/routes/mobile/favorite');
const mobileReviewRoutes = require('./src/routes/mobile/review');
const mobilePaymentRoutes = require('./src/routes/mobile/payment');
const mobilePromotionRoutes = require('./src/routes/mobile/promotion');
const mobileLocationRoutes = require('./src/routes/mobile/location');
const mobileNearbyRoutes = require('./src/routes/mobile/nearby');
const mobileCouponRoutes = require('./src/routes/mobile/coupon');
const mobileHistoryRoutes = require('./src/routes/mobile/history');

const app = express();

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/status', (req, res) => {
  res.json({ code: 200, msg: 'Express后端服务启动成功！', data: null });
});

app.get('/api/test', (req, res) => {
  res.json({
    code: 200,
    msg: '前后端连通性测试成功',
    data: {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path
    }
  });
});

const PORT = process.env.PORT || 3000;

app.use('/auth', authRoutes);
app.use('/mobile/auth', mobileAuthRoutes);
app.use('/user', userRoutes);
app.use('/hotel', hotelRoutes);
app.use('/admin', adminRoutes);

// 移动端其他路由
app.use('/mobile/banner', mobileBannerRoutes);
app.use('/mobile/city', mobileCityRoutes);
app.use('/mobile/home', mobileHomeRoutes);
app.use('/mobile/hotel', mobileHotelRoutes);
app.use('/mobile/booking', mobileBookingRoutes);
app.use('/mobile/user', mobileUserRoutes);
app.use('/mobile/favorite', mobileFavoriteRoutes);
app.use('/mobile/review', mobileReviewRoutes);
app.use('/mobile/payment', mobilePaymentRoutes);
app.use('/mobile/promotion', mobilePromotionRoutes);
app.use('/mobile/location', mobileLocationRoutes);
app.use('/mobile/nearby', mobileNearbyRoutes);
app.use('/mobile/coupon', mobileCouponRoutes);
app.use('/mobile/history', mobileHistoryRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Express服务运行在：http://localhost:${PORT}`);
});
