const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, VerificationCode, UserProfile, UserThirdPartyAuth } = require('../../models');
const { generateCode } = require('../../utils/code');
const { generateNickname } = require('../../utils/nickname');
const AliyunSMS = require('../../utils/sms');

// 发送验证码
exports.sendCode = async (req, res) => {
  try {
    const { phone, type = 'register' } = req.body;
    
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.json({ code: 3001, msg: '手机号格式不正确', data: null });
    }
    
    // 检查发送频率
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCode = await VerificationCode.findOne({
      where: {
        phone,
        type,
        created_at: {
          [Op.gte]: oneMinuteAgo
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
    
    // 生成验证码
    const code = generateCode(6);
    const expiresAt = new Date(Date.now() + 60 * 1000);

    await VerificationCode.create({
      phone,
      code,
      type,
      expires_at: expiresAt,
      used: false
    });

    // 这里应该调用短信服务发送验证码，暂时模拟
    console.log(`向手机号 ${phone} 发送验证码: ${code}`);
    // await AliyunSMS.sendVerifyCode(phone, code);
    
    res.json({ code: 0, msg: '验证码已发送', data: { expires_in: 60 } });
  } catch (error) {
    console.error('发送验证码错误:', error);
    res.json({ code: 3007, msg: '验证码发送失败，请稍后重试', data: null });
  }
};

// 校验手机号
exports.checkPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.json({ code: 3001, msg: '手机号格式不正确', data: null });
    }
    
    // 检查手机号是否已注册
    const user = await User.findOne({
      where: { phone }
    });
    
    if (user) {
      return res.json({ code: 0, msg: '该手机号已注册，请直接登录', data: { available: false } });
    }
    
    res.json({ code: 0, msg: '手机号可用', data: { available: true } });
  } catch (error) {
    console.error('校验手机号错误:', error);
    res.json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

// 手机号登录
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.json({ code: 3001, msg: '手机号格式不正确', data: null });
    }
    
    // 查找用户
    const user = await User.findOne({
      where: { phone }
    });
    
    if (!user) {
      return res.json({ code: 3007, msg: '手机号不存在', data: null });
    }
    
    // 验证密码
    if (!user.password) {
      return res.json({ code: 3008, msg: '密码错误', data: null });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.json({ code: 3008, msg: '密码错误', data: null });
    }
    
    // 更新登录信息
    await user.update({
      last_login_at: new Date(),
      login_count: user.login_count + 1
    });
    
    // 生成JWT token
    const token = jwt.sign(
      { user_id: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // 获取用户资料
    const profile = await UserProfile.findOne({
      where: { user_id: user.id }
    });
    
    res.json({
      code: 0,
      msg: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          role: user.role,
          profile: profile ? {
            nickname: profile.nickname,
            avatar: profile.avatar
          } : null
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

// 手机号注册
exports.register = async (req, res) => {
  try {
    const { phone, code, password, agreed } = req.body;
    
    // 验证参数
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.json({ code: 3001, msg: '手机号格式不正确', data: null });
    }
    
    if (!agreed) {
      return res.json({ code: 3004, msg: '未同意用户协议', data: null });
    }
    
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/.test(password)) {
      return res.json({ code: 3006, msg: '密码格式不正确', data: null });
    }
    
    // 验证验证码
    const verificationCode = await VerificationCode.findOne({
      where: {
        phone,
        type: 'register',
        code,
        used: false,
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    });
    
    if (!verificationCode) {
      return res.json({ code: 3003, msg: '验证码错误或已过期', data: null });
    }
    
    // 检查手机号是否已注册
    const existingUser = await User.findOne({
      where: { phone }
    });
    
    if (existingUser) {
      return res.json({ code: 3005, msg: '手机号已注册', data: null });
    }
    
    // 创建用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const nickname = generateNickname('mobile');
    
    const user = await User.create({
      phone,
      password: hashedPassword,
      role: 'mobile',
      nickname: nickname,
      login_count: 0
    });
    
    // 标记验证码为已使用
    await verificationCode.update({ used: true });
    
    // 创建用户资料
    await UserProfile.create({
      user_id: user.id,
      nickname: nickname
    });
    
    // 生成JWT token
    const token = jwt.sign(
      { user_id: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      code: 0,
      msg: '注册成功',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          role: user.role,
          is_new_user: true,
          profile: {
            nickname: nickname
          }
        }
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

// 微信登录/注册
exports.wechatLogin = async (req, res) => {
  try {
    const { open_id, nickname, avatar } = req.body;
    
    if (!open_id) {
      return res.json({ code: 3001, msg: '缺少必要参数', data: null });
    }
    
    // 查找第三方登录记录
    const thirdPartyAuth = await UserThirdPartyAuth.findOne({
      where: {
        provider: 'wechat',
        open_id: open_id
      }
    });
    
    let user, isNewUser = false;
    
    if (thirdPartyAuth) {
      // 已存在用户，直接登录
      user = await User.findByPk(thirdPartyAuth.user_id);
    } else {
      // 新用户，创建账号
      isNewUser = true;
      const nickname = generateNickname('mobile');
      
      user = await User.create({
        phone: null,
        password: null,
        role: 'mobile',
        nickname: nickname,
        login_count: 0
      });
      
      // 创建用户资料
      await UserProfile.create({
        user_id: user.id,
        nickname: nickname
      });
      
      // 创建第三方登录记录
      await UserThirdPartyAuth.create({
        user_id: user.id,
        provider: 'wechat',
        open_id: open_id,
        nickname: nickname || `微信用户${Math.floor(Math.random() * 10000)}`,
        avatar: avatar
      });
    }
    
    // 更新登录信息
    await user.update({
      last_login_at: new Date(),
      login_count: user.login_count + 1
    });
    
    // 生成JWT token
    const token = jwt.sign(
      { user_id: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // 获取用户资料
    const profile = await UserProfile.findOne({
      where: { user_id: user.id }
    });
    
    res.json({
      code: 0,
      msg: isNewUser ? '注册成功' : '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          role: user.role,
          is_first_time: isNewUser,
          is_new_user: isNewUser,
          profile: profile ? {
            nickname: profile.nickname,
            avatar: profile.avatar
          } : null
        }
      }
    });
  } catch (error) {
    console.error('微信登录错误:', error);
    res.json({ code: 3008, msg: '第三方授权失败，请重新尝试', data: null });
  }
};

// 支付宝登录/注册
exports.alipayLogin = async (req, res) => {
  try {
    const { open_id, nickname, avatar } = req.body;
    
    if (!open_id) {
      return res.json({ code: 3001, msg: '缺少必要参数', data: null });
    }
    
    // 查找第三方登录记录
    const thirdPartyAuth = await UserThirdPartyAuth.findOne({
      where: {
        provider: 'alipay',
        open_id: open_id
      }
    });
    
    let user, isNewUser = false;
    
    if (thirdPartyAuth) {
      // 已存在用户，直接登录
      user = await User.findByPk(thirdPartyAuth.user_id);
    } else {
      // 新用户，创建账号
      isNewUser = true;
      const nickname = generateNickname('mobile');
      
      user = await User.create({
        phone: null,
        password: null,
        role: 'mobile',
        nickname: nickname,
        login_count: 0
      });
      
      // 创建用户资料
      await UserProfile.create({
        user_id: user.id,
        nickname: nickname
      });
      
      // 创建第三方登录记录
      await UserThirdPartyAuth.create({
        user_id: user.id,
        provider: 'alipay',
        open_id: open_id,
        nickname: nickname || `支付宝用户${Math.floor(Math.random() * 10000)}`,
        avatar: avatar
      });
    }
    
    // 更新登录信息
    await user.update({
      last_login_at: new Date(),
      login_count: user.login_count + 1
    });
    
    // 生成JWT token
    const token = jwt.sign(
      { user_id: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // 获取用户资料
    const profile = await UserProfile.findOne({
      where: { user_id: user.id }
    });
    
    res.json({
      code: 0,
      msg: isNewUser ? '注册成功' : '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          role: user.role,
          is_first_time: isNewUser,
          is_new_user: isNewUser,
          profile: profile ? {
            nickname: profile.nickname,
            avatar: profile.avatar
          } : null
        }
      }
    });
  } catch (error) {
    console.error('支付宝登录错误:', error);
    res.json({ code: 3008, msg: '第三方授权失败，请重新尝试', data: null });
  }
};
