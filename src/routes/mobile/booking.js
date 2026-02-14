const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/mobile/booking');
const authMiddleware = require('../../middlewares/mobile/auth');
const { createBookingValidator, payValidator } = require('../../middlewares/mobile/validator');

// 创建预订
router.post('/', authMiddleware, createBookingValidator, bookingController.createBooking);

// 获取预订列表
router.get('/list', authMiddleware, bookingController.getBookingList);

// 获取预订详情
router.get('/detail/:id', authMiddleware, bookingController.getBookingDetail);

// 取消预订
router.post('/cancel/:id', authMiddleware, bookingController.cancelBooking);

// 支付预订
router.post('/pay', authMiddleware, payValidator, bookingController.payBooking);

module.exports = router;
