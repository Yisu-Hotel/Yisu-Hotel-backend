const { createChatCompletionService } = require('../../services/pc/chat');

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

const createChatCompletion = async (req, res) => {
  try {
    const { messages } = req.chatPayload || req.body;
    const data = await createChatCompletionService({ messages });
    return res.json({
      code: 0,
      msg: '请求成功',
      data
    });
  } catch (error) {
    return handleError(res, error, 'Chat completion error:');
  }
};

module.exports = {
  createChatCompletion
};
