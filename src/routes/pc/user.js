const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../../controllers/pc/user');
const { authenticateToken, validateUpdateProfile } = require('../../middlewares/pc/user');

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validateUpdateProfile, updateProfile);

module.exports = router;
