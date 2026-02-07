const { User, VerificationCode } = require('../../models');
const { generateCode } = require('../../utils/code');
const AliyunSMS = require('../../utils/sms');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const checkAccount = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({
      where: { phone }
    });

    if (user) {
      return res.json({
        code: 0,
        msg: '该账号已被注册',
        data: {
          available: false
        }
      });
    }

    return res.json({
      code: 0,
      msg: '账号可用',
      data: {
        available: true
      }
    });
  } catch (error) {
    console.error('Check account error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

const sendCode = async (req, res) => {
  try {
    const { phone, type } = req.body;

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCode = await VerificationCode.findOne({
      where: {
        phone,
        type,
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
      type,
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
    console.error('Send code error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

const register = async (req, res) => {
  try {
    const { phone, password, code, role, agreed } = req.body;

    const verificationCode = await VerificationCode.findOne({
      where: {
        phone,
        type: 'register',
        code,
        used: false,
        expires_at: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!verificationCode) {
      return res.status(400).json({
        code: 3001,
        msg: '验证码不正确或已过期',
        data: null
      });
    }

    const existingUser = await User.findOne({
      where: { phone }
    });

    if (existingUser) {
      return res.status(400).json({
        code: 3001,
        msg: '该手机号已被注册',
        data: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      phone,
      password: hashedPassword,
      role: role || 'merchant',
      login_count: 0
    });

    await verificationCode.update({ used: true });

    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      code: 0,
      msg: '注册成功',
      data: {
        token,
        user: {
          id: user.id,
          account: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

module.exports = {
  checkAccount,
  sendCode,
  register
};
