const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ code: 401, msg: '未授权，请先登录', data: null });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 将用户信息存储到请求对象中
    req.user = {
      user_id: decoded.user_id,
      phone: decoded.phone,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('认证错误:', error);
    return res.json({ code: 401, msg: '未授权，请先登录', data: null });
  }
};
