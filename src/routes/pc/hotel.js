const express = require('express');
const router = express.Router();
const { createHotel, getHotelList } = require('../../controllers/pc/hotel');
const { authenticateToken } = require('../../middlewares/pc/user');
const { validateHotelListQuery, validateCreateHotelInput } = require('../../middlewares/pc/hotel');

router.post('/create', authenticateToken, validateCreateHotelInput, createHotel);
router.get('/list', authenticateToken, validateHotelListQuery, getHotelList);

module.exports = router;
