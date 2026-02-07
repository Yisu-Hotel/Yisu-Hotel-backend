const validatePhone = (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      code: 3001,
      msg: '手机号格式不正确',
      data: null
    });
  }

  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      code: 3001,
      msg: '手机号格式不正确',
      data: null
    });
  }

  next();
};

module.exports = {
  validatePhone
};
