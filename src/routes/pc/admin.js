const express = require('express');
const router = express.Router();
const { getAdminHotelAuditList } = require('../../controllers/pc/admin');
const { authenticateToken } = require('../../middlewares/pc/user');
const { requireAdmin, validateAdminHotelAuditListQuery } = require('../../middlewares/pc/admin');

router.get('/hotel/audit-list', authenticateToken, requireAdmin, validateAdminHotelAuditListQuery, getAdminHotelAuditList);

module.exports = router;
