const { Coupon, UserCoupon } = require('../../models');
const { Op } = require('sequelize');

// 获取优惠券列表
const getCouponListService = async (user_id, type = 'all') => {
  const now = new Date();
  
  // 查询所有可用的优惠券
  const availableCoupons = await Coupon.findAll({
    where: {
      start_time: {
        [Op.lte]: now
      },
      end_time: {
        [Op.gte]: now
      },
      stock: {
        [Op.gt]: 0
      }
    },
    attributes: ['id', 'coupon_code', 'coupon_name', 'discount_type', 'discount_value', 'min_spend', 'max_discount', 'start_time', 'end_time', 'is_public']
  });
  
  // 查询用户已领取的优惠券
  const userCoupons = await UserCoupon.findAll({
    where: {
      user_id
    },
    include: [
      {
        model: Coupon,
        attributes: ['id', 'coupon_code', 'coupon_name', 'discount_type', 'discount_value', 'min_spend', 'max_discount', 'start_time', 'end_time']
      }
    ],
    attributes: ['id', 'coupon_id', 'status', 'created_at']
  });
  
  // 格式化数据
  const formattedAvailableCoupons = availableCoupons.map(coupon => ({
    coupon_id: coupon.id,
    coupon_code: coupon.coupon_code,
    coupon_name: coupon.coupon_name,
    discount_type: coupon.discount_type,
    discount_value: coupon.discount_value,
    min_spend: coupon.min_spend,
    max_discount: coupon.max_discount,
    start_time: coupon.start_time,
    end_time: coupon.end_time,
    is_public: coupon.is_public
  }));
  
  const formattedUserCoupons = userCoupons.map(userCoupon => ({
    id: userCoupon.id,
    coupon_id: userCoupon.coupon_id,
    coupon_code: userCoupon.Coupon.coupon_code,
    coupon_name: userCoupon.Coupon.coupon_name,
    discount_type: userCoupon.Coupon.discount_type,
    discount_value: userCoupon.Coupon.discount_value,
    min_spend: userCoupon.Coupon.min_spend,
    max_discount: userCoupon.Coupon.max_discount,
    start_time: userCoupon.Coupon.start_time,
    end_time: userCoupon.Coupon.end_time,
    status: userCoupon.status,
    receive_time: userCoupon.created_at
  }));
  
  if (type === 'available') {
    return {
      available_coupons: formattedAvailableCoupons,
      received_coupons: formattedUserCoupons.filter(coupon => coupon.status === 'unused')
    };
  } else if (type === 'used') {
    return {
      used_coupons: formattedUserCoupons.filter(coupon => coupon.status === 'used')
    };
  } else if (type === 'expired') {
    return {
      expired_coupons: formattedUserCoupons.filter(coupon => coupon.status === 'expired')
    };
  } else {
    // 返回所有优惠券
    return {
      available_coupons: formattedAvailableCoupons,
      received_coupons: formattedUserCoupons.filter(coupon => coupon.status === 'unused'),
      used_coupons: formattedUserCoupons.filter(coupon => coupon.status === 'used'),
      expired_coupons: formattedUserCoupons.filter(coupon => coupon.status === 'expired')
    };
  }
};

// 领取优惠券
const receiveCouponService = async (user_id, coupon_id) => {
  const now = new Date();
  
  // 检查优惠券是否存在且可用
  const coupon = await Coupon.findOne({
    where: {
      id: coupon_id,
      start_time: {
        [Op.lte]: now
      },
      end_time: {
        [Op.gte]: now
      },
      stock: {
        [Op.gt]: 0
      }
    }
  });
  
  if (!coupon) {
    const error = new Error('优惠券不存在或已过期');
    error.code = 6001;
    error.httpStatus = 404;
    throw error;
  }
  
  // 检查用户是否已经领取过该优惠券
  const existingUserCoupon = await UserCoupon.findOne({
    where: {
      user_id,
      coupon_id
    }
  });
  
  if (existingUserCoupon) {
    const error = new Error('已经领取过该优惠券');
    error.code = 6002;
    error.httpStatus = 400;
    throw error;
  }
  
  // 领取优惠券
  await UserCoupon.create({
    user_id,
    coupon_id,
    status: 'unused'
  });
  
  // 减少优惠券库存
  await coupon.update({
    stock: coupon.stock - 1
  });
  
  return {
    coupon_id: coupon.id
  };
};

module.exports = {
  getCouponListService,
  receiveCouponService
};
