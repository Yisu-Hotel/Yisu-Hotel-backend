const { Op, literal, where } = require('sequelize');

/**
 * 构建酒店列表查询条件
 * @param {Object} params - 查询参数
 * @param {number} [params.userId] - 创建者ID
 * @param {string} [params.status] - 酒店状态
 * @param {string} [params.keyword] - 搜索关键字
 * @returns {Object} - Sequelize where 查询对象
 */
const buildHotelListWhere = ({ userId, status, keyword }) => {
  const whereClause = { created_by: userId };

  if (status) {
    whereClause.status = status;
  }

  if (keyword) {
    const likeKeyword = `%${keyword}%`;
    whereClause[Op.or] = [
      { hotel_name_cn: { [Op.iLike]: likeKeyword } },
      { hotel_name_en: { [Op.iLike]: likeKeyword } },
      where(literal(`"Hotel"."location_info"->>'formatted_address'`), { [Op.iLike]: likeKeyword })
    ];
  }

  return whereClause;
};

/**
 * 酒店列表查询属性配置
 * @type {Array<string|Array>}
 */
const hotelListAttributes = [
  'id',
  'hotel_name_cn',
  'hotel_name_en',
  'star_rating',
  'description',
  'phone',
  'opening_date',
  'nearby_info',
  'main_image_url',
  'main_image_base64',
  'tags',
  'location_info',
  'status',
  'created_at',
  'updated_at',
  [
    literal('COALESCE((SELECT COUNT(*) FROM "favorites" WHERE "favorites"."hotel_id" = "Hotel"."id"), 0)'),
    'favorite_count'
  ],
  [
    literal('COALESCE(ROUND((SELECT AVG("rating") FROM "hotel_reviews" WHERE "hotel_reviews"."hotel_id" = "Hotel"."id"), 1), 0)'),
    'average_rating'
  ],
  [
    literal('COALESCE((SELECT COUNT(*) FROM "bookings" WHERE "bookings"."hotel_id" = "Hotel"."id"), 0)'),
    'booking_count'
  ],
  [
    literal('COALESCE((SELECT COUNT(*) FROM "hotel_reviews" WHERE "hotel_reviews"."hotel_id" = "Hotel"."id"), 0)'),
    'review_count'
  ]
];

/**
 * 格式化酒店列表数据
 * @param {Array<Object>} hotels - 原始酒店数据数组
 * @returns {Array<Object>} - 格式化后的酒店数据数组
 */
const formatHotelList = (hotels) => hotels.map((hotel) => ({
  hotel_id: hotel.id,
  hotel_name_cn: hotel.hotel_name_cn,
  hotel_name_en: hotel.hotel_name_en,
  star_rating: hotel.star_rating,
  description: hotel.description,
  phone: hotel.phone,
  opening_date: hotel.opening_date,
  nearby_info: hotel.nearby_info,
  main_image_url: hotel.main_image_url,
  main_image_base64: hotel.main_image_base64,
  tags: hotel.tags,
  location_info: hotel.location_info,
  status: hotel.status,
  favorite_count: Number(hotel.favorite_count) || 0,
  average_rating: Number(hotel.average_rating) || 0,
  booking_count: Number(hotel.booking_count) || 0,
  review_count: Number(hotel.review_count) || 0,
  created_at: hotel.created_at,
  updated_at: hotel.updated_at
}));

module.exports = {
  buildHotelListWhere,
  hotelListAttributes,
  formatHotelList
};
