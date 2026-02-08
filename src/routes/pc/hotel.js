const express = require('express');
const router = express.Router();
const { getHotelList } = require('../../controllers/pc/hotel');
const { authenticateToken } = require('../../middlewares/pc/user');
const { validateHotelListQuery } = require('../../middlewares/pc/hotel');

router.get('/list', authenticateToken, validateHotelListQuery, getHotelList);

module.exports = router;
