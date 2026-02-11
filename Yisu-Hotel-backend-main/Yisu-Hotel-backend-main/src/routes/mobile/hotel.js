const express = require('express');
const router = express.Router();
const hotelController = require('../../controllers/mobile/hotel');
const authMiddleware = require('../../middlewares/mobile/auth');
const { hotelSearchValidator } = require('../../middlewares/validator');

// 搜索酒店
router.get('/search', hotelSearchValidator, hotelController.searchHotels);

// 获取酒店详情
router.get('/:hotel_id/detail', hotelController.getHotelDetail);

// 获取酒店图片列表
router.get('/:hotel_id/images', hotelController.getHotelImages);

// 获取可用日期和价格
router.get('/:hotel_id/availability', hotelController.getHotelAvailability);

// 计算价格
router.post('/:hotel_id/calculate-price', hotelController.calculatePrice);

// 获取房型列表
router.get('/:hotel_id/room-types', hotelController.getRoomTypes);

// 获取房型详情
router.get('/:hotel_id/room-types/:room_type_id', hotelController.getRoomTypeDetail);

// 创建预订
router.post('/:hotel_id/bookings', authMiddleware, hotelController.createBooking);

// 检查预订可用性
router.post('/:hotel_id/check-availability', hotelController.checkAvailability);

// 收藏/取消收藏酒店
router.post('/:hotel_id/favorite', authMiddleware, hotelController.toggleFavorite);

// 获取分享信息
router.get('/:hotel_id/share', hotelController.getShareInfo);

module.exports = router;
