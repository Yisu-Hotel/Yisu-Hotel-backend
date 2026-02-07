const { User, VerificationCode } = require('../../models');
const { generateCode } = require('../../utils/validator');
const { generateCode } = require('../../utils/code');
const AliyunSMS = require('../../utils/sms');

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

module.exports = {
  checkAccount,
  sendCode
};
