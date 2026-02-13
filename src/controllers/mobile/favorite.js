const { getFavoriteListService, removeFavoriteService } = require('../../services/mobile/favorite');

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

// 获取收藏列表
exports.getFavoriteList = async (req, res) => {
  try {
    const { user_id } = req.user || { user_id: 'test_user' }; // 临时添加测试用户ID
    const data = await getFavoriteListService(user_id);
    return res.json({ code: 0, msg: '获取成功', data });
  } catch (error) {
    return handleError(res, error, 'Get favorite list error:');
  }
};

// 移除收藏
exports.removeFavorite = async (req, res) => {
  try {
    const { user_id } = req.user || { user_id: 'test_user' }; // 临时添加测试用户ID
    const { id } = req.params;
    const data = await removeFavoriteService(user_id, id);
    return res.json({ code: 0, msg: '移除成功', data });
  } catch (error) {
    return handleError(res, error, 'Remove favorite error:');
  }
};
