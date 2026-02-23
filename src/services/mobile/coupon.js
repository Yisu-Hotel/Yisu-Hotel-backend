const { Coupon, UserCoupon } = require('../../models');
const { Op } = require('sequelize');

// 获取优惠券列表
const getCouponListService = async (user_id, type = 'all') => {
  const now = new Date();
  
  // 查询所有可用的优惠券
  const availableCoupons = await Coupon.findAll({
    where: {
      valid_from: {
        [Op.lte]: now
      },
      valid_until: {
        [Op.gte]: now
      },
      total_count: {
        [Op.gt]: 0
      }
    },
    attributes: ['id', 'title', 'description', 'discount_type', 'discount_value', 'min_order_amount', 'valid_from', 'valid_until', 'total_count', 'used_count', 'is_new_user_only', 'rules']
  });
  
  // 格式化可用优惠券数据
  const formattedAvailableCoupons = availableCoupons.map(coupon => ({
    id: coupon.id,
    coupon_id: coupon.id,
    title: coupon.title,
    description: coupon.description,
    value: coupon.discount_value,
    min_spend: coupon.min_order_amount,
    expire_date: coupon.valid_until,
    status: 'available'
  }));
  
  // 处理用户优惠券
  let formattedUserCoupons = [];
  
  try {
    // 验证user_id是否为有效的UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    // 只有当user_id是有效的UUID格式时，才查询用户优惠券
    // 这样可以避免数据库错误（因为数据库中的user_id字段是UUID类型）
    if (uuidRegex.test(user_id)) {
      const userCoupons = await UserCoupon.findAll({
        where: {
          user_id
        },
        include: [
          {
            model: Coupon,
            as: 'coupon'
          }
        ],
        attributes: ['id', 'coupon_id', 'status', 'created_at']
      });
      
      // 格式化用户优惠券数据
      formattedUserCoupons = userCoupons.map(userCoupon => ({
        id: userCoupon.id,
        coupon_id: userCoupon.coupon_id,
        title: userCoupon.coupon.title,
        description: userCoupon.coupon.description,
        value: userCoupon.coupon.discount_value,
        min_spend: userCoupon.coupon.min_order_amount,
        expire_date: userCoupon.coupon.valid_until,
        status: userCoupon.status,
        used_date: userCoupon.status === 'used' ? userCoupon.created_at : null,
        receive_time: userCoupon.created_at
      }));
    } else {
      // 当user_id不是有效的UUID格式时（比如'test_user'），跳过查询用户优惠券的步骤
      console.log('User ID is not a valid UUID format, skipping user coupon query');
      formattedUserCoupons = [];
    }
  } catch (error) {
    console.error('Error getting user coupons:', error);
    // 发生错误时，只返回可用的优惠券
    formattedUserCoupons = [];
  }
  
  // 准备返回数据
  const returnData = {
    coupons: [],
    pushCoupons: {
      limited: [],
      bank: [],
      selected: []
    }
  };
  
  if (type === 'available') {
    // 只返回用户已领取且未使用的优惠券
    returnData.coupons = formattedUserCoupons.filter(coupon => coupon.status === 'unused').map(coupon => ({ ...coupon, status: 'available' }));
  } else if (type === 'used') {
    // 只返回用户已使用的优惠券
    returnData.coupons = formattedUserCoupons.filter(coupon => coupon.status === 'used').map(coupon => ({ ...coupon, status: 'used' }));
  } else if (type === 'expired') {
    // 只返回用户已过期的优惠券
    returnData.coupons = formattedUserCoupons.filter(coupon => coupon.status === 'expired').map(coupon => ({ ...coupon, status: 'expired' }));
  } else {
    // 只返回用户相关的所有优惠券
    returnData.coupons = [
      ...formattedUserCoupons.filter(coupon => coupon.status === 'unused').map(coupon => ({ ...coupon, status: 'available' })),
      ...formattedUserCoupons.filter(coupon => coupon.status === 'used').map(coupon => ({ ...coupon, status: 'used' })),
      ...formattedUserCoupons.filter(coupon => coupon.status === 'expired').map(coupon => ({ ...coupon, status: 'expired' }))
    ];
  }
  
  // 添加推送优惠券数据
  // 将可用优惠券分配到不同的推送类别
  formattedAvailableCoupons.forEach(coupon => {
    // 添加到领好券
    returnData.pushCoupons.selected.push({
      id: coupon.id,
      name: coupon.title,
      value: coupon.value,
      discount: coupon.value,
      description: coupon.description,
      expire_date: coupon.expire_date,
      limit: `满${coupon.min_spend}可用`,
      remain: '100%'
    });
  });
  
  return returnData;
};

// 领取优惠券
const receiveCouponService = async (user_id, coupon_id) => {
  const now = new Date();
  
  // 检查优惠券是否存在且可用
  const coupon = await Coupon.findOne({
    where: {
      id: coupon_id,
      valid_from: {
        [Op.lte]: now
      },
      valid_until: {
        [Op.gte]: now
      },
      total_count: {
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
    used_count: coupon.used_count + 1
  });
  
  return {
    coupon_id: coupon.id
  };
};

module.exports = {
  getCouponListService,
  receiveCouponService
};
