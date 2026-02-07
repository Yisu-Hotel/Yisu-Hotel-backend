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
          console.log('过期时间:', new Date(decoded.exp * 1000).toLocaleString('zh-CN'));
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
      console.log('签发时间:', new Date(decoded.iat * 1000).toLocaleString('zh-CN'));
      console.log('过期时间:', new Date(decoded.exp * 1000).toLocaleString('zh-CN'));
      
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - now;
      
      console.log('\n剩余时间:');
      if (expiresIn <= 0) {
        console.log('Token 已过期');
      } else {
        const minutes = Math.floor(expiresIn / 60);
        const seconds = expiresIn % 60;
        console.log(`${minutes} 分 ${seconds} 秒`);
      }
    }
  } catch (error) {
    console.error('验证失败:', error.message);
  } finally {
    rl.close();
  }
})();
