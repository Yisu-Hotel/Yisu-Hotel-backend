const { getCouponListService, receiveCouponService, useCouponService } = require('../../services/mobile/coupon');

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

// 获取优惠券列表
exports.getCouponList = async (req, res) => {
  try {
    const { user_id } = req.user || { user_id: 'test_user' }; // 临时添加测试用户ID
    const { type = 'all' } = req.query;
    const data = await getCouponListService(user_id, type);
    return res.json({ code: 0, msg: '查询成功', data });
  } catch (error) {
    return handleError(res, error, 'Get coupon list error:');
  }
};

// 领取优惠券
exports.receiveCoupon = async (req, res) => {
  try {
    const { user_id } = req.user || { user_id: 'test_user' }; // 临时添加测试用户ID
    const { coupon_id } = req.body;
    const data = await receiveCouponService(user_id, coupon_id);
    return res.json({ code: 0, msg: '领取成功', data });
  } catch (error) {
    return handleError(res, error, 'Receive coupon error:');
  }
};

// 使用优惠券
exports.useCoupon = async (req, res) => {
  try {
    const { user_id } = req.user || { user_id: 'test_user' }; // 临时添加测试用户ID
    const { coupon_id, booking_id } = req.body;
    const data = await useCouponService(user_id, coupon_id, booking_id);
    return res.json({ code: 0, msg: '优惠券使用成功', data });
  } catch (error) {
    return handleError(res, error, 'Use coupon error:');
  }
};
