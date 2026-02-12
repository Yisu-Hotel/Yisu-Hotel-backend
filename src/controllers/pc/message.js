const { getUserMessagesService } = require('../../services/pc/message');

const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.user;
    const { page, pageSize } = req.messageQuery || { page: 1, pageSize: 5 };
    const data = await getUserMessagesService({
      userId,
      page,
      pageSize
    });

    return res.json({
      code: 0,
      msg: '查询成功',
      data
    });
  } catch (error) {
    if (error.code) {
      return res.status(error.httpStatus || 400).json({
        code: error.code,
        msg: error.message,
        data: null
      });
    }
    console.error('Get messages error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

module.exports = {
  getUserMessages
};
