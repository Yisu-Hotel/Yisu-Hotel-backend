const express = require('express');
const router = express.Router();
const { createHotel, getHotelList, getHotelDetail, deleteHotel } = require('../../controllers/pc/hotel');
const { authenticateToken } = require('../../middlewares/pc/user');
const { validateHotelListQuery, validateCreateHotelInput, validateHotelDetailParam, validateHotelDeleteParam } = require('../../middlewares/pc/hotel');

router.post('/create', authenticateToken, validateCreateHotelInput, createHotel);
router.get('/list', authenticateToken, validateHotelListQuery, getHotelList);
router.get('/detail/:id', authenticateToken, validateHotelDetailParam, getHotelDetail);
router.delete('/delete/:id', authenticateToken, validateHotelDeleteParam, deleteHotel);

module.exports = router;
