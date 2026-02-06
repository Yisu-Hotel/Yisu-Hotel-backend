const { User } = require('../../models');

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

module.exports = {
  checkAccount
};
