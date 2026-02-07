const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const jwt = require('jsonwebtoken');

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  try {
    const token = await new Promise((resolve) => {
      rl.question('请输入 JWT Token: ', resolve);
    });

    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.log('❌ Token 已过期');
        } else {
          console.log('❌ Token 无效:', err.message);
        }
        return null;
      }
      return decoded;
    });

    if (decoded) {
      console.log('✅ Token 有效');
      console.log('用户ID:', decoded.userId);
      console.log('手机号:', decoded.phone);
      console.log('角色:', decoded.role);
    }
  } catch (error) {
    console.error('验证失败:', error.message);
  } finally {
    rl.close();
  }
})();
