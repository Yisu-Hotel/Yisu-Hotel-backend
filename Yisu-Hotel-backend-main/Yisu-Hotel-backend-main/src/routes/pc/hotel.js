const express = require('express');
const router = express.Router();
const { getHotelList, getHotelDetail, createHotel, updateHotel, deleteHotel } = require('../../controllers/pc/hotel');
const { authenticateToken } = require('../../middlewares/pc/user');
const { validateHotelListQuery } = require('../../middlewares/pc/hotel');

router.get('/list', authenticateToken, validateHotelListQuery, getHotelList);
router.get('/:id', authenticateToken, getHotelDetail);
router.post('/', authenticateToken, createHotel);
router.put('/:id', authenticateToken, updateHotel);
router.delete('/:id', authenticateToken, deleteHotel);

module.exports = router;
