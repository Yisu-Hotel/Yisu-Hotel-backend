const express = require('express');
const router = express.Router();
const { getProfile } = require('../../controllers/pc/user');
const { authenticateToken } = require('../../middlewares/pc/user');

router.get('/profile', authenticateToken, getProfile);

module.exports = router;