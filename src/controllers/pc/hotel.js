const { Hotel } = require('../../models');
const {
  buildHotelListWhere,
  hotelListAttributes,
  formatHotelList
} = require('../../utils/hotel');

const getHotelList = async (req, res) => {
  try {
    const { userId } = req.user;
    const { status, keyword } = req.query;
    const { page, size } = req.pagination || { page: 1, size: 20 };

    const whereClause = buildHotelListWhere({ userId, status, keyword });

    const total = await Hotel.count({ where: whereClause });

    const hotels = await Hotel.findAll({
      where: whereClause,
      attributes: hotelListAttributes,
      order: [['created_at', 'DESC']],
      limit: size,
      offset: (page - 1) * size,
      raw: true
    });

    const list = formatHotelList(hotels);

    return res.json({
      code: 0,
      msg: '查询成功',
      data: {
        total,
        page,
        size,
        list
      }
    });
  } catch (error) {
    console.error('Get hotel list error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

module.exports = {
  getHotelList
};
