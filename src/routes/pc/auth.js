const express = require('express');
const router = express.Router();
const { checkAccount, sendCode } = require('../../controllers/pc/auth');
const { validatePhone, validateSendCode } = require('../../middlewares/pc/auth');

router.post('/check-account', validatePhone, checkAccount);
router.post('/send-code', validateSendCode, sendCode);

module.exports = router;
