const express = require('express');
const router = express.Router();
const cityController = require('../../controllers/mobile/city');

// 获取城市列表
router.get('/list', cityController.getCityList);

// 获取热门城市
router.get('/hot', cityController.getHotCities);

// 搜索城市
router.get('/search', cityController.searchCity);

module.exports = router;
