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

    if (profile) {
      if (profile.nickname) {
        responseData.nickname = profile.nickname;
      }
      if (profile.avatar) {
        responseData.avatar = profile.avatar;
      }
      if (profile.avatar_base64) {
        responseData.avatar_base64 = profile.avatar_base64;
      }
      if (profile.gender) {
        responseData.gender = profile.gender;
      }
      if (profile.birthday) {
        responseData.birthday = profile.birthday;
      }
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

const updateProfile = async (req, res) => {
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

    const profileUpdateData = {};
    const hasNickname = Object.prototype.hasOwnProperty.call(req.body, 'nickname');
    const hasGender = Object.prototype.hasOwnProperty.call(req.body, 'gender');
    const hasBirthday = Object.prototype.hasOwnProperty.call(req.body, 'birthday');
    const hasAvatar = Object.prototype.hasOwnProperty.call(req.body, 'avatar');
    const hasAvatarBase64 = Object.prototype.hasOwnProperty.call(req.body, 'avatar_base64');

    if (hasNickname) {
      profileUpdateData.nickname = req.body.nickname === null ? null : req.body.nickname.trim();
    }
    if (hasGender) {
      profileUpdateData.gender = req.body.gender === null ? null : req.body.gender;
    }
    if (hasBirthday) {
      profileUpdateData.birthday = req.body.birthday === null ? null : req.body.birthday;
    }
    if (hasAvatar) {
      profileUpdateData.avatar = req.body.avatar === null ? null : req.body.avatar.trim();
    }
    if (hasAvatarBase64) {
      profileUpdateData.avatar_base64 = req.body.avatar_base64 === null ? null : req.body.avatar_base64.trim();
    }

    let profile = await UserProfile.findOne({
      where: { user_id: userId }
    });

    if (profile) {
      profile = await profile.update(profileUpdateData);
    } else {
      profile = await UserProfile.create({
        user_id: userId,
        ...profileUpdateData
      });
    }

    if (hasNickname) {
      await user.update({
        nickname: profileUpdateData.nickname
      });
    }

    return res.json({
      code: 0,
      msg: '更新成功',
      data: {
        id: user.id,
        updated_at: profile.updated_at || user.updated_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
