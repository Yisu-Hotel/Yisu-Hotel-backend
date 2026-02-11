const express = require('express');
const router = express.Router();
const { getAdminHotelAuditList, getAdminHotelDetail } = require('../../controllers/pc/admin');
const { authenticateToken } = require('../../middlewares/pc/user');
const { requireAdmin, validateAdminHotelAuditListQuery } = require('../../middlewares/pc/admin');
const { validateHotelDetailParam } = require('../../middlewares/pc/hotel');

router.get('/hotel/audit-list', authenticateToken, requireAdmin, validateAdminHotelAuditListQuery, getAdminHotelAuditList);
router.get('/hotel/detail/:id', authenticateToken, requireAdmin, validateHotelDetailParam, getAdminHotelDetail);

module.exports = router;
