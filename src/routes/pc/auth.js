const express = require('express');
const router = express.Router();
const { checkAccount } = require('../../controllers/pc/auth');
const { validatePhone } = require('../../middlewares/pc/auth');

router.post('/check-account', validatePhone, checkAccount);

module.exports = router;
