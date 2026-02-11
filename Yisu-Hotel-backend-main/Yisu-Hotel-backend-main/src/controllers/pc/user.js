const { User, UserProfile } = require('../../models');

const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findOne({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        code: 4008,
        msg: '用户不存在',
        data: null
      });
    }

    const profile = await UserProfile.findOne({
      where: { user_id: userId }
    });

    const responseData = {
      id: user.id,
      account: user.phone,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    if (profile && profile.nickname) {
      responseData.nickname = profile.nickname;
    } else if (user.nickname) {
      responseData.nickname = user.nickname;
    }

    return res.json({
      code: 0,
      msg: '查询成功',
      data: responseData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

module.exports = {
  getProfile
};