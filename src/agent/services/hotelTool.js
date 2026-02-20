const { Op } = require('sequelize');
const { Hotel, RoomType, HotelFacility, HotelService, HotelPolicy, Facility, Service } = require('../../models');

/**
 * 获取酒店工具定义
 */
exports.getToolDefinition = () => {
  return {
    type: 'function',
    function: {
      name: 'hotel_search',
      description: '搜索和获取酒店相关信息',
      parameters: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            description: '操作类型：search（搜索酒店）、detail（获取酒店详情）、compare（比较酒店）',
            enum: ['search', 'detail', 'compare']
          },
          query: {
            type: 'string',
            description: '搜索关键词，如城市名称、酒店名称等'
          },
          hotel_id: {
            type: 'string',
            description: '酒店ID，用于获取详情或比较'
          },
          hotel_name: {
            type: 'string',
            description: '酒店名称，用于搜索具体酒店'
          },
          hotel_ids: {
            type: 'array',
            description: '酒店ID数组，用于比较多个酒店',
            items: {
              type: 'string'
            }
          }
        },
        required: ['action']
      }
    }
  };
};

/**
 * 执行酒店工具调用
 */
exports.executeToolCall = async (args) => {
  try {
    const { action, query, hotel_id, hotel_name, hotel_ids } = args;

    switch (action) {
      case 'search':
        // 如果提供了酒店名称，使用酒店名称搜索
        if (hotel_name) {
          return await searchHotels(hotel_name);
        }
        return await searchHotels(query);
      case 'detail':
        // 如果提供了酒店名称，先搜索酒店获取ID，再获取详情
        if (hotel_name) {
          const searchResult = await searchHotels(hotel_name);
          if (searchResult.success && searchResult.matches.length > 0) {
            const foundHotelId = searchResult.matches[0].id;
            return await getHotelDetail(foundHotelId);
          }
          return { success: false, error: '未找到指定酒店' };
        }
        return await getHotelDetail(hotel_id);
      case 'compare':
        return await compareHotels(hotel_ids);
      default:
        return { success: false, error: '无效的操作类型' };
    }
  } catch (error) {
    console.error('Hotel Tool Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 搜索酒店
 */
async function searchHotels(query) {
  try {
    const hotels = await Hotel.findAll({
      where: {
        status: 'published',
        [Op.or]: [
          { hotel_name_cn: { [Op.iLike]: `%${query}%` } },
          { hotel_name_en: { [Op.iLike]: `%${query}%` } }
        ]
      },
      limit: 10,
      attributes: ['id', 'hotel_name_cn', 'hotel_name_en', 'star_rating', 'rating', 'location_info', 'main_image_url']
    });

    return {
      success: true,
      context: `搜索到 ${hotels.length} 家酒店`,
      matches: hotels.map(hotel => ({
        id: hotel.id,
        name: hotel.hotel_name_cn,
        star: hotel.star_rating,
        rating: hotel.rating,
        location: hotel.location_info?.city || hotel.location_info?.formatted_address,
        image: hotel.main_image_url
      }))
    };
  } catch (error) {
    console.error('Search Hotels Error:', error);
    return { success: false, error: '搜索酒店失败' };
  }
}

/**
 * 获取酒店详情
 */
async function getHotelDetail(hotel_id) {
  try {
    const hotel = await Hotel.findOne({
      where: { id: hotel_id },
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
          attributes: ['cancellation_policy', 'payment_policy', 'children_policy', 'pets_policy']
        }
      ],
      attributes: ['id', 'hotel_name_cn', 'hotel_name_en', 'star_rating', 'rating', 'location_info', 'description', 'phone', 'main_image_url', 'tags']
    });

    if (!hotel) {
      return { success: false, error: '酒店不存在' };
    }

    const roomTypes = await RoomType.findAll({
      where: { hotel_id },
      attributes: ['id', 'room_type_name', 'bed_type', 'area', 'description']
    });

    return {
      success: true,
      context: `获取到酒店 ${hotel.hotel_name_cn} 的详细信息`,
      matches: [{
        id: hotel.id,
        name: hotel.hotel_name_cn,
        star: hotel.star_rating,
        rating: hotel.rating,
        location: hotel.location_info,
        description: hotel.description,
        phone: hotel.phone,
        image: hotel.main_image_url,
        tags: hotel.tags,
        facilities: hotel.hotelFacilities?.map(hf => hf.facility?.name).filter(Boolean) || [],
        services: hotel.hotelServices?.map(hs => hs.service?.name).filter(Boolean) || [],
        policies: hotel.policy,
        room_types: roomTypes.map(room => ({
          id: room.id,
          name: room.room_type_name,
          bed_type: room.bed_type,
          area: room.area,
          description: room.description
        }))
      }]
    };
  } catch (error) {
    console.error('Get Hotel Detail Error:', error);
    return { success: false, error: '获取酒店详情失败' };
  }
}

/**
 * 比较酒店
 */
async function compareHotels(hotel_ids) {
  try {
    if (!Array.isArray(hotel_ids) || hotel_ids.length === 0) {
      return { success: false, error: '请提供要比较的酒店ID' };
    }

    const hotels = await Hotel.findAll({
      where: { id: hotel_ids },
      attributes: ['id', 'hotel_name_cn', 'hotel_name_en', 'star_rating', 'rating', 'location_info', 'main_image_url']
    });

    return {
      success: true,
      context: `比较 ${hotels.length} 家酒店`,
      matches: hotels.map(hotel => ({
        id: hotel.id,
        name: hotel.hotel_name_cn,
        star: hotel.star_rating,
        rating: hotel.rating,
        location: hotel.location_info?.city || hotel.location_info?.formatted_address,
        image: hotel.main_image_url
      }))
    };
  } catch (error) {
    console.error('Compare Hotels Error:', error);
    return { success: false, error: '比较酒店失败' };
  }
}

