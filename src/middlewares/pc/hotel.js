const validateHotelListQuery = (req, res, next) => {
  const { page, size, status } = req.query;

  let pageNumber = 1;
  let sizeNumber = 20;

  if (page !== undefined) {
    pageNumber = Number(page);
    if (!Number.isFinite(pageNumber) || pageNumber < 1 || !Number.isInteger(pageNumber)) {
      return res.status(400).json({
        code: 4009,
        msg: '参数格式不正确',
        data: null
      });
    }
  }

  if (size !== undefined) {
    sizeNumber = Number(size);
    if (!Number.isFinite(sizeNumber) || sizeNumber < 1 || !Number.isInteger(sizeNumber)) {
      return res.status(400).json({
        code: 4009,
        msg: '参数格式不正确',
        data: null
      });
    }
  }

  if (sizeNumber > 100) {
    sizeNumber = 100;
  }

  if (status && !['draft', 'pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      code: 4009,
      msg: '参数格式不正确',
      data: null
    });
  }

  req.pagination = {
    page: pageNumber,
    size: sizeNumber
  };

  next();
};

module.exports = {
  validateHotelListQuery
};
