const { Op, Sequelize } = require('sequelize');
const { Booking, Hotel, RoomType, HotelImage, Payment } = require('../../models');

// 创建预订
exports.createBooking = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { hotel_id, room_type_id, check_in_date, check_out_date, contact_name, contact_phone, special_requests } = req.body;
    
    // 验证参数
    if (!hotel_id || !room_type_id || !check_in_date || !check_out_date || !contact_name || !contact_phone) {
      return res.json({ code: 3001, msg: '缺少必要参数', data: null });
    }
    
    // 验证日期格式
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.json({ code: 3002, msg: '日期格式不正确', data: null });
    }
    
    if (checkIn >= checkOut) {
      return res.json({ code: 3003, msg: '入住日期必须早于退房日期', data: null });
    }
    
    if (checkIn < new Date()) {
      return res.json({ code: 3004, msg: '入住日期不能早于今天', data: null });
    }
    
    // 验证酒店和房型是否存在
    const hotel = await Hotel.findByPk(hotel_id);
    if (!hotel) {
      return res.json({ code: 3005, msg: '酒店不存在', data: null });
    }
    
    const roomType = await RoomType.findByPk(room_type_id);
    if (!roomType || roomType.hotel_id !== hotel_id) {
      return res.json({ code: 3006, msg: '房型不存在', data: null });
    }
    
    // 计算总价和天数
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = roomType.price * days;
    
    // 检查房型是否有可用房间
    // 这里应该有更复杂的逻辑来检查房间可用性，暂时简化
    
    // 创建预订
    const booking = await Booking.create({
      user_id,
      hotel_id,
      room_type_id,
      check_in_date,
      check_out_date,
      contact_name,
      contact_phone,
      special_requests,
      total_price: totalPrice,
      status: 'pending'
    });
    
    // 获取酒店主图
    const mainImage = await HotelImage.findOne({
      where: { hotel_id, is_main: true }
    });
    
    res.json({
      code: 0,
      msg: '预订成功',
      data: {
        booking_id: booking.id,
        hotel_name: hotel.name,
        room_type: roomType.name,
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        total_price: booking.total_price,
        status: booking.status,
        status_text: getStatusText(booking.status),
        main_image_url: mainImage ? mainImage.image_url : null,
        contact_name: booking.contact_name,
        contact_phone: booking.contact_phone,
        special_requests: booking.special_requests,
        booked_at: booking.created_at
      }
    });
  } catch (error) {
    console.error('创建预订错误:', error);
    res.json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

// 获取预订列表
exports.getBookingList = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { page = 1, page_size = 10, status } = req.query;
    
    // 构建查询条件
    const whereCondition = {
      user_id
    };
    
    if (status) {
      whereCondition.status = status;
    }
    
    // 查询预订列表
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Hotel,
          attributes: ['id', 'name', 'address', 'star_rating']
        },
        {
          model: RoomType,
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(page_size),
      offset: (parseInt(page) - 1) * parseInt(page_size)
    });
    
    // 格式化数据
    const formattedBookings = await Promise.all(bookings.map(async (booking) => {
      // 获取酒店主图
      const mainImage = await HotelImage.findOne({
        where: { hotel_id: booking.hotel_id, is_main: true }
      });
      
      return {
        id: booking.id,
        hotel_id: booking.hotel_id,
        hotel_name: booking.Hotel.name,
        hotel_address: booking.Hotel.address,
        hotel_star: booking.Hotel.star_rating,
        room_type: booking.RoomType.name,
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        total_price: booking.total_price,
        status: booking.status,
        status_text: getStatusText(booking.status),
        main_image_url: mainImage ? mainImage.image_url : null,
        booked_at: booking.created_at
      };
    }));
    
    res.json({
      code: 0,
      msg: '获取成功',
      data: {
        bookings: formattedBookings,
        total: count,
        page: parseInt(page),
        page_size: parseInt(page_size)
      }
    });
  } catch (error) {
    console.error('获取预订列表错误:', error);
    res.json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

// 获取预订详情
exports.getBookingDetail = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { id } = req.params;
    
    // 查询预订详情
    const booking = await Booking.findOne({
      where: {
        id,
        user_id
      },
      include: [
        {
          model: Hotel,
          attributes: ['id', 'name', 'address', 'star_rating']
        },
        {
          model: RoomType,
          attributes: ['id', 'name']
        },
        {
          model: Payment,
          attributes: ['id', 'payment_method', 'transaction_id', 'paid_at']
        }
      ]
    });
    
    if (!booking) {
      return res.json({ code: 3007, msg: '预订不存在', data: null });
    }
    
    // 获取酒店主图
    const mainImage = await HotelImage.findOne({
      where: { hotel_id: booking.hotel_id, is_main: true }
    });
    
    // 格式化数据
    const formattedBooking = {
      id: booking.id,
      hotel_id: booking.hotel_id,
      hotel_name: booking.Hotel.name,
      hotel_address: booking.Hotel.address,
      hotel_star: booking.Hotel.star_rating,
      room_type: booking.RoomType.name,
      check_in_date: booking.check_in_date,
      check_out_date: booking.check_out_date,
      total_price: booking.total_price,
      status: booking.status,
      status_text: getStatusText(booking.status),
      main_image_url: mainImage ? mainImage.image_url : null,
      contact_name: booking.contact_name,
      contact_phone: booking.contact_phone,
      special_requests: booking.special_requests,
      booked_at: booking.created_at,
      paid_at: booking.Payment ? booking.Payment.paid_at : null,
      payment_method: booking.Payment ? booking.Payment.payment_method : null
    };
    
    res.json({
      code: 0,
      msg: '获取成功',
      data: formattedBooking
    });
  } catch (error) {
    console.error('获取预订详情错误:', error);
    res.json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

// 取消预订
exports.cancelBooking = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { id } = req.params;
    
    // 查找预订
    const booking = await Booking.findOne({
      where: {
        id,
        user_id
      }
    });
    
    if (!booking) {
      return res.json({ code: 3007, msg: '预订不存在', data: null });
    }
    
    // 检查是否可以取消
    if (booking.status !== 'pending' && booking.status !== 'paid') {
      return res.json({ code: 3008, msg: '该预订状态不可取消', data: null });
    }
    
    // 更新预订状态
    await booking.update({
      status: 'cancelled'
    });
    
    res.json({
      code: 0,
      msg: '取消成功',
      data: {
        booking_id: id,
        status: 'cancelled',
        status_text: getStatusText('cancelled')
      }
    });
  } catch (error) {
    console.error('取消预订错误:', error);
    res.json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

// 支付预订
exports.payBooking = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { booking_id, payment_method, transaction_id } = req.body;
    
    // 验证参数
    if (!booking_id || !payment_method || !transaction_id) {
      return res.json({ code: 3001, msg: '缺少必要参数', data: null });
    }
    
    // 查找预订
    const booking = await Booking.findOne({
      where: {
        id: booking_id,
        user_id
      }
    });
    
    if (!booking) {
      return res.json({ code: 3007, msg: '预订不存在', data: null });
    }
    
    // 检查预订状态
    if (booking.status !== 'pending') {
      return res.json({ code: 3009, msg: '该预订状态不可支付', data: null });
    }
    
    // 开始事务
    const transaction = await Sequelize.transaction();
    
    try {
      // 更新预订状态
      await booking.update({
        status: 'paid'
      }, { transaction });
      
      // 创建支付记录
      const payment = await Payment.create({
        booking_id: booking.id,
        user_id,
        amount: booking.total_price,
        payment_method,
        transaction_id,
        status: 'success'
      }, { transaction });
      
      // 提交事务
      await transaction.commit();
      
      res.json({
        code: 0,
        msg: '支付成功',
        data: {
          booking_id: booking.id,
          status: 'paid',
          status_text: getStatusText('paid'),
          payment_id: payment.id,
          paid_at: payment.created_at
        }
      });
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('支付预订错误:', error);
    res.json({ code: 500, msg: '服务器内部错误', data: null });
  }
};

// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
}
