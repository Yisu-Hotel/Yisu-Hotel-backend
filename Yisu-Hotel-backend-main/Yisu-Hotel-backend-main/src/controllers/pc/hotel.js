const { Hotel, HotelFacility, HotelService, HotelPolicy } = require('../../models');
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

const getHotelDetail = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const hotel = await Hotel.findOne({
      where: { id, created_by: userId },
      include: [
        {
          model: HotelFacility,
          as: 'hotelFacilities',
          attributes: ['facility_id']
        },
        {
          model: HotelService,
          as: 'hotelServices',
          attributes: ['service_id']
        },
        {
          model: HotelPolicy,
          as: 'policy'
        }
      ]
    });

    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在',
        data: null
      });
    }

    return res.json({
      code: 0,
      msg: '查询成功',
      data: hotel
    });
  } catch (error) {
    console.error('Get hotel detail error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

const createHotel = async (req, res) => {
  try {
    const { userId } = req.user;
    const hotelData = req.body;

    // 验证必要字段
    const requiredFields = ['hotel_name_cn', 'hotel_name_en', 'star_rating', 'description', 'phone', 'opening_date', 'location_info'];
    for (const field of requiredFields) {
      if (!hotelData[field]) {
        return res.status(400).json({
          code: 400,
          msg: `缺少必要字段: ${field}`,
          data: null
        });
      }
    }

    // 创建酒店
    const hotel = await Hotel.create({
      ...hotelData,
      created_by: userId,
      status: hotelData.status || 'draft'
    });

    // 处理酒店设施
    if (hotelData.facilities && Array.isArray(hotelData.facilities)) {
      const facilityData = hotelData.facilities.map(facilityId => ({
        hotel_id: hotel.id,
        facility_id: facilityId
      }));
      await HotelFacility.bulkCreate(facilityData);
    }

    // 处理酒店服务
    if (hotelData.services && Array.isArray(hotelData.services)) {
      const serviceData = hotelData.services.map(serviceId => ({
        hotel_id: hotel.id,
        service_id: serviceId
      }));
      await HotelService.bulkCreate(serviceData);
    }

    // 处理酒店政策
    if (hotelData.policy) {
      await HotelPolicy.create({
        hotel_id: hotel.id,
        ...hotelData.policy
      });
    }

    return res.json({
      code: 0,
      msg: '酒店创建成功',
      data: hotel
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

const updateHotel = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const hotelData = req.body;

    // 查找酒店
    const hotel = await Hotel.findOne({
      where: { id, created_by: userId }
    });

    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在',
        data: null
      });
    }

    // 更新酒店基本信息
    await hotel.update(hotelData);

    // 处理酒店设施
    if (hotelData.facilities !== undefined && Array.isArray(hotelData.facilities)) {
      // 删除现有设施
      await HotelFacility.destroy({ where: { hotel_id: id } });
      // 添加新设施
      const facilityData = hotelData.facilities.map(facilityId => ({
        hotel_id: id,
        facility_id: facilityId
      }));
      await HotelFacility.bulkCreate(facilityData);
    }

    // 处理酒店服务
    if (hotelData.services !== undefined && Array.isArray(hotelData.services)) {
      // 删除现有服务
      await HotelService.destroy({ where: { hotel_id: id } });
      // 添加新服务
      const serviceData = hotelData.services.map(serviceId => ({
        hotel_id: id,
        service_id: serviceId
      }));
      await HotelService.bulkCreate(serviceData);
    }

    // 处理酒店政策
    if (hotelData.policy !== undefined) {
      const existingPolicy = await HotelPolicy.findOne({ where: { hotel_id: id } });
      if (existingPolicy) {
        await existingPolicy.update(hotelData.policy);
      } else {
        await HotelPolicy.create({
          hotel_id: id,
          ...hotelData.policy
        });
      }
    }

    // 重新获取更新后的酒店信息
    const updatedHotel = await Hotel.findOne({
      where: { id },
      include: [
        {
          model: HotelFacility,
          as: 'hotelFacilities',
          attributes: ['facility_id']
        },
        {
          model: HotelService,
          as: 'hotelServices',
          attributes: ['service_id']
        },
        {
          model: HotelPolicy,
          as: 'policy'
        }
      ]
    });

    return res.json({
      code: 0,
      msg: '酒店更新成功',
      data: updatedHotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    // 查找酒店
    const hotel = await Hotel.findOne({
      where: { id, created_by: userId }
    });

    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在',
        data: null
      });
    }

    // 删除酒店（级联删除相关数据）
    await hotel.destroy();

    return res.json({
      code: 0,
      msg: '酒店删除成功',
      data: null
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

module.exports = {
  getHotelList,
  getHotelDetail,
  createHotel,
  updateHotel,
  deleteHotel
};
