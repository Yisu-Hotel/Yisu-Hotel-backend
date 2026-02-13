const {
  checkAccountService,
  sendCodeService,
  registerService,
  loginService,
  forgotPasswordService,
  resetPasswordService
} = require('../../services/pc/auth');

const handleError = (res, error, logLabel) => {
  if (error && error.code) {
    return res.status(error.httpStatus || 400).json({
      code: error.code,
      msg: error.message,
      data: null
    });
  }
  console.error(logLabel, error);
  return res.status(500).json({
    code: 500,
    msg: '服务器错误',
    data: null
  });
};

/**
 * 检查账号是否已被注册
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Promise<void>} - 无返回值
 */
const checkAccount = async (req, res) => {
  try {
    const { phone } = req.body;
    const data = await checkAccountService(phone);
    return res.json({
      code: 0,
      msg: data.exists ? '该手机号已被注册' : '手机号可用',
      data: {
        exists: data.exists
      }
    });
  } catch (error) {
    return handleError(res, error, 'Check account error:');
  }
};

/**
 * 发送验证码
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Promise<void>} - 无返回值
 */
const sendCode = async (req, res) => {
  try {
    const { phone, type } = req.body;
    const data = await sendCodeService(phone, type);
    return res.json({
      code: 0,
      msg: '验证码已发送',
      data
    });
  } catch (error) {
    return handleError(res, error, 'Send code error:');
  }
};

/**
 * 注册新用户
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Promise<void>} - 无返回值
 */
const register = async (req, res) => {
  try {
    const { phone, password, code, role } = req.body;
    const data = await registerService({ phone, password, code, role });
    return res.json({
      code: 0,
      msg: '注册成功',
      data
    });
  } catch (error) {
    return handleError(res, error, 'Register error:');
  }
};

/**
 * 用户登录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Promise<void>} - 无返回值
 */
const login = async (req, res) => {
  try {
    const { phone, password, token_expires_in } = req.body;
    const data = await loginService(phone, password, token_expires_in);
    return res.json({
      code: 0,
      msg: '登录成功',
      data
    });
  } catch (error) {
    return handleError(res, error, 'Login error:');
  }
};

/**
 * 忘记密码
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Promise<void>} - 无返回值
 */
const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;
<<<<<<< HEAD

    const user = await User.findOne({
      where: { phone }
    });

    if (!user) {
      return res.status(400).json({
        code: 3007,
        msg: '手机号不存在',
        data: null
      });
    }

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCode = await VerificationCode.findOne({
      where: {
        phone,
        type: 'reset',
        created_at: {
          [require('sequelize').Op.gte]: oneMinuteAgo
        }
      }
    });

    if (recentCode) {
      return res.status(400).json({
        code: 3002,
        msg: '验证码发送频率限制（60秒内只能发送一次）',
        data: null
      });
    }

    const code = generateCode(6);
    const expiresAt = new Date(Date.now() + 60 * 1000);

    await VerificationCode.create({
      phone,
      code,
      type: 'reset',
      expires_at: expiresAt,
      used: false
    });

    await AliyunSMS.sendVerifyCode(phone, code);

    return res.json({
      code: 0,
      msg: '验证码已发送',
      data: {
        expires_in: 60
      }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
=======
    const data = await forgotPasswordService(phone);
    return res.json({
      code: 0,
      msg: '验证码已发送',
      data
    });
  } catch (error) {
    return handleError(res, error, 'Forgot password error:');
>>>>>>> main
  }
};

/**
 * 重置密码
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Promise<void>} - 无返回值
 */
const resetPassword = async (req, res) => {
  try {
    const { phone, code, new_password } = req.body;
<<<<<<< HEAD

    const user = await User.findOne({
      where: { phone }
    });

    if (!user) {
      return res.status(400).json({
        code: 3007,
        msg: '手机号不存在',
        data: null
      });
    }

    const verificationCode = await VerificationCode.findOne({
      where: {
        phone,
        type: 'reset',
        code,
        used: false,
        expires_at: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!verificationCode) {
      return res.status(400).json({
        code: 3003,
        msg: '验证码错误或已过期',
        data: null
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await user.update({ password: hashedPassword });

    await verificationCode.update({ used: true });

=======
    await resetPasswordService(phone, code, new_password);
>>>>>>> main
    return res.json({
      code: 0,
      msg: '密码重置成功',
      data: null
    });
  } catch (error) {
    return handleError(res, error, 'Reset password error:');
  }
};

module.exports = {
  checkAccount,
  sendCode,
  register,
  login,
  forgotPassword,
  resetPassword
};
