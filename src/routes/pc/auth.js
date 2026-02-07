const express = require('express');
const router = express.Router();
const { checkAccount, sendCode, register } = require('../../controllers/pc/auth');
const { validatePhone, validateSendCode, validateRegister } = require('../../middlewares/pc/auth');

router.post('/check-account', validatePhone, checkAccount);
router.post('/send-code', validateSendCode, sendCode);
router.post('/register', validateRegister, register);

module.exports = router;
