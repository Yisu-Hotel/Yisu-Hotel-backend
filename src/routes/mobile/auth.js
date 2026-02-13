const express = require('express');
const router = express.Router();
const authController = require('../../controllers/mobile/auth');
const { loginValidator, registerValidator } = require('../../middlewares/mobile/validator');

router.post('/send-code', authController.sendCode);

router.post('/check-phone', authController.checkPhone);

router.post('/register', registerValidator, authController.register);

router.post('/login', loginValidator, authController.login);

module.exports = router;
