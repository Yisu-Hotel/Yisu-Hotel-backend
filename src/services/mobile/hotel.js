const { Op, where, literal } = require('sequelize');
const { Hotel, HotelFacility, HotelService, HotelPolicy, RoomType, RoomPrice, HotelReview, Facility, Service } = require('../../models');

const searchHotelsService = async (params) => {
  const { city, check_in, check_out, guests, min_price, max_price, star_rating, facilities, sort_by, page = 1, size = 20 } = params;

  const whereClause = {
    status: 'published'
  };

  // 添加城市筛选
  if (city) {
    whereClause[Op.or] = [
      where(literal(`"Hotel"."location_info"->>'city'`), city),
      where(literal(`"Hotel"."location_info"->>'formatted_address'`), { [Op.iLike]: `%${city}%` })
    ];
  }

  // 添加星级筛选
  if (star_rating) {
    whereClause.star_rating = star_rating;
  }

  // 计算偏移量
  const offset = (page - 1) * size;

  // 构建查询选项
  const queryOptions = {
    where: whereClause,
    include: [
      {
        model: HotelFacility,
        as: 'hotelFacilities',
        include: [{
          model: Facility,
          as: 'facility',
          attributes: ['id', 'name']
        }],
        attributes: ['facility_id']
      },
      {
        model: HotelService,
        as: 'hotelServices',
        include: [{
          model: Service,
          as: 'service',
          attributes: ['id', 'name']
        }],
        attributes: ['service_id']
      }
    ],
    order: sort_by === 'price_asc' ? [[literal('min_price'), 'ASC']] : [['created_at', 'DESC']],
    limit: size,
    offset: offset,
    attributes: ['id', 'hotel_name_cn', 'star_rating', 'rating', 'location_info', 'description', 'main_image_url', 'created_at']
  };

  // 并行执行查询，提高性能
  const [hotels, total] = await Promise.all([
    Hotel.findAll(queryOptions),
    Hotel.count({ where: whereClause })
  ]);

  // 格式化酒店数据
  const formattedHotels = hotels.map(hotel => {
    const facilities = hotel.hotelFacilities.map(hf => ({
      id: hf.facility_id,
      name: hf.facility?.name || ''
    }));

    const services = hotel.hotelServices.map(hs => ({
      id: hs.service_id,
      name: hs.service?.name || ''
    }));

    return {
      id: hotel.id,
      name: hotel.hotel_name_cn,
      star: hotel.star_rating,
      rating: hotel.rating || 0,
      address: hotel.location_info?.formatted_address || '',
      distance: Math.random() * 5, // 模拟距离
      description: hotel.description,
      main_image_url: hotel.main_image_url?.[0] || '',
      min_price: hotel.min_price || 0,
      facilities,
      services
    };
  });

  return {
    total,
    page,
    size,
    list: formattedHotels
  };
};

const getHotelDetailService = async (hotel_id, check_in, check_out) => {
  // 构建查询选项
  const queryOptions = {
    where: { id: hotel_id, status: 'published' },
    include: [
      {
        model: HotelFacility,
        as: 'hotelFacilities',
        include: [{
          model: Facility,
          as: 'facility',
          attributes: ['id', 'name']
        }],
        attributes: ['facility_id']
      },
      {
        model: HotelService,
        as: 'hotelServices',
        include: [{
          model: Service,
          as: 'service',
          attributes: ['id', 'name']
        }],
        attributes: ['service_id']
      },
      {
        model: HotelPolicy,
        as: 'policy',
        attributes: ['cancellation_policy']
      },
      {
        model: HotelReview,
        as: 'reviews',
        limit: 5,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'user_id', 'rating', 'content', 'is_anonymous', 'created_at']
      }
    ],
    attributes: ['id', 'hotel_name_cn', 'star_rating', 'rating', 'location_info', 'description', 'main_image_url', 'min_price']
  };
  
  // 并行执行查询，提高性能
  const [hotel, roomTypes] = await Promise.all([
    Hotel.findOne(queryOptions),
    RoomType.findAll({
      where: { hotel_id },
      attributes: ['id']
    })
  ]);

  if (!hotel) {
    const error = new Error('酒店不存在');
    error.code = 404;
    error.httpStatus = 404;
    throw error;
  }

  // 格式化设施
  const facilities = hotel.hotelFacilities.map(hf => ({
    id: hf.facility_id,
    name: hf.facility?.name || ''
  }));

  // 格式化服务
  const services = hotel.hotelServices.map(hs => ({
    id: hs.service_id,
    name: hs.service?.name || ''
  }));

  // 格式化政策
  const policies = [];
  if (hotel.policy) {
    policies.push({ id: 1, type: 'check_in', value: '14:00后' });
    policies.push({ id: 2, type: 'check_out', value: '12:00前' });
    if (hotel.policy.cancellation_policy) {
      policies.push({ id: 3, type: 'cancellation', value: hotel.policy.cancellation_policy });
    }
  }

  // 格式化评价
  const reviews = hotel.reviews.map(review => ({
    id: review.id,
    user_id: review.user_id,
    user_name: review.is_anonymous ? '匿名用户' : '用户',
    rating: review.rating,
    content: review.content,
    created_at: review.created_at
  }));

  return {
    id: hotel.id,
    name: hotel.hotel_name_cn,
    star: hotel.star_rating,
    rating: hotel.rating || 0,
    address: hotel.location_info?.formatted_address || '',
    distance: Math.random() * 5, // 模拟距离
    description: hotel.description,
    main_image_url: hotel.main_image_url?.[0] || '',
    min_price: hotel.min_price || 0,
    facilities,
    services,
    policies,
    reviews,
    check_in: check_in || '',
    check_out: check_out || ''
  };
};

const getHotelImagesService = async (hotel_id, type) => {
  // 从数据库获取酒店图片
  const hotel = await Hotel.findOne({
    where: { id: hotel_id },
    attributes: ['id', 'image_urls']
  });

  if (!hotel) {
    const error = new Error('酒店不存在');
    error.code = 404;
    error.httpStatus = 404;
    throw error;
  }

  // 格式化图片数据
  let images = [];
  if (hotel.image_urls && Array.isArray(hotel.image_urls)) {
    images = hotel.image_urls.map((url, index) => ({
      id: index + 1,
      url: url,
      type: 'exterior', // 默认为外观图片，实际项目中可以根据图片路径或其他方式区分
      order: index + 1
    }));
  }

  // 根据类型筛选
  if (type) {
    images = images.filter(img => img.type === type);
  }

  return images;
};

const getHotelAvailabilityService = async (hotel_id, start_date, end_date) => {
  // 验证日期参数
  if (!start_date || !end_date) {
    const error = new Error('请提供开始日期和结束日期');
    error.code = 400;
    error.httpStatus = 400;
    throw error;
  }

  // 从数据库获取房型和价格信息
  const roomTypes = await RoomType.findAll({
    where: { hotel_id },
    attributes: ['id']
  });

  // 模拟可用日期和价格数据
  const availability = [];
  const start = new Date(start_date);
  const end = new Date(end_date);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    availability.push({
      date: d.toISOString().split('T')[0],
      available: Math.random() > 0.1, // 90% 的概率可用
      price: Math.floor(200 + Math.random() * 300) // 随机价格
    });
  }

  return {
    hotel_id,
    start_date,
    end_date,
    availability
  };
};

const calculatePriceService = async (hotel_id, check_in, check_out, room_type_id, guests) => {
  // 验证参数
  if (!check_in || !check_out || !room_type_id || !guests) {
    const error = new Error('请提供完整的预订信息');
    error.code = 400;
    error.httpStatus = 400;
    throw error;
  }

  // 计算入住天数
  const startDate = new Date(check_in);
  const endDate = new Date(check_out);
  const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // 从数据库获取房型价格
  const roomPrice = await RoomPrice.findOne({
    where: { room_type_id },
    attributes: ['price']
  });

  const basePrice = roomPrice?.price || 300;
  const totalPrice = basePrice * nights;
  const serviceFee = Math.floor(totalPrice * 0.1); // 10% 服务费
  const tax = Math.floor(totalPrice * 0.06); // 6% 税费
  const grandTotal = totalPrice + serviceFee + tax;

  return {
    hotel_id,
    room_type_id,
    check_in,
    check_out,
    nights,
    guests,
    price_details: {
      room_price: basePrice,
      total_room_price: totalPrice,
      service_fee: serviceFee,
      tax: tax,
      grand_total: grandTotal
    }
  };
};

const getRoomTypesService = async (hotel_id, check_in, check_out) => {
  // 从数据库获取房型信息
  const roomTypes = await RoomType.findAll({
    where: { hotel_id },
    attributes: ['id', 'room_type_name', 'description', 'bed_type', 'area', 'max_guests', 'base_price', 'main_image_url']
  });

  // 格式化房型数据
  const formattedRoomTypes = roomTypes.map(roomType => ({
    id: roomType.id,
    name: roomType.room_type_name,
    description: roomType.description,
    bed_type: roomType.bed_type,
    area: roomType.area,
    max_guests: roomType.max_guests,
    base_price: roomType.base_price,
    main_image_url: roomType.main_image_url,
    facilities: [
      { id: 1, name: '免费WiFi' },
      { id: 2, name: '空调' },
      { id: 3, name: '电视' },
      { id: 4, name: '独立卫浴' }
    ],
    services: [
      { id: 1, name: '24小时热水' },
      { id: 2, name: '洗漱用品' }
    ],
    policies: [
      { id: 1, type: 'check_in', value: '14:00后' },
      { id: 2, type: 'check_out', value: '12:00前' }
    ]
  }));

  return formattedRoomTypes;
};

const getRoomTypeDetailService = async (hotel_id, room_type_id, check_in, check_out) => {
  // 从数据库获取房型详情
  const roomType = await RoomType.findOne({
    where: { id: room_type_id, hotel_id },
    attributes: ['id', 'room_type_name', 'description', 'bed_type', 'area', 'max_guests', 'base_price', 'main_image_url']
  });

  if (!roomType) {
    const error = new Error('房型不存在');
    error.code = 404;
    error.httpStatus = 404;
    throw error;
  }

  // 格式化房型详情数据
  return {
    id: roomType.id,
    name: roomType.room_type_name,
    description: roomType.description,
    bed_type: roomType.bed_type,
    area: roomType.area,
    max_guests: roomType.max_guests,
    base_price: roomType.base_price,
    main_image_url: roomType.main_image_url,
    facilities: [
      { id: 1, name: '免费WiFi' },
      { id: 2, name: '空调' },
      { id: 3, name: '电视' },
      { id: 4, name: '独立卫浴' },
      { id: 5, name: '书桌' },
      { id: 6, name: '衣柜' }
    ],
    services: [
      { id: 1, name: '24小时热水' },
      { id: 2, name: '洗漱用品' },
      { id: 3, name: '毛巾浴巾' },
      { id: 4, name: '拖鞋' }
    ],
    policies: [
      { id: 1, type: 'check_in', value: '14:00后' },
      { id: 2, type: 'check_out', value: '12:00前' },
      { id: 3, type: 'cancellation', value: '入住前24小时可免费取消' },
      { id: 4, type: 'smoking', value: '禁烟' }
    ]
  };
};

module.exports = {
  searchHotelsService,
  getHotelDetailService,
  getHotelImagesService,
  getHotelAvailabilityService,
  calculatePriceService,
  getRoomTypesService,
  getRoomTypeDetailService
};