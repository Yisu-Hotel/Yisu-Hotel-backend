const express = require('express');
const router = express.Router();
const favoriteController = require('../../controllers/mobile/favorite');
const authMiddleware = require('../../middlewares/mobile/auth');

// 获取收藏列表
router.get('/list', authMiddleware, favoriteController.getFavoriteList);

// 移除收藏
router.delete('/remove/:id', authMiddleware, favoriteController.removeFavorite);

module.exports = router;
