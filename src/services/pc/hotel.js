const { Op } = require('sequelize');
const {
  sequelize,
  Hotel,
  HotelPolicy,
  Facility,
  Service,
  HotelFacility,
  HotelService,
  RoomType,
  RoomFacility,
  RoomService,
  RoomPrice,
  RoomTag,
  RoomPolicy
} = require('../../models');

/**
 * 创建酒店服务
 * 处理酒店及其相关信息（政策、设施、服务、房型等）的创建，使用事务确保数据一致性
 * @param {number} userId - 创建者用户ID
 * @param {Object} payload - 酒店创建数据载荷
 * @returns {Promise<Object>} - 创建结果，包含 hotel_id 和 status
 * @throws {Error} - 创建失败抛出异常
 */
const createHotelService = async (userId, payload) => {
  const transaction = await sequelize.transaction();
  try {
    // 判断是否为草稿状态
    const isDraft = payload.isDraft === true || payload.save_as_draft === true || payload.save_as_draft === 'true' || payload.save_as_draft === 1 || payload.save_as_draft === '1';
    const status = isDraft ? 'draft' : 'pending';

    // 如果不是草稿，检查酒店名称是否已存在
    if (!isDraft) {
      const exists = await Hotel.findOne({
        where: {
          [Op.or]: [
            { hotel_name_cn: payload.hotel_name_cn },
            { hotel_name_en: payload.hotel_name_en }
          ]
        },
        transaction
      });

      if (exists) {
        const error = new Error('酒店名称已存在');
        error.httpStatus = 400;
        error.code = 4002;
        throw error;
      }
    }

    // 创建酒店基本信息
    const hotel = await Hotel.create({
      hotel_name_cn: payload.hotel_name_cn,
      hotel_name_en: payload.hotel_name_en,
      star_rating: payload.star_rating,
      description: payload.description,
      phone: payload.phone,
      opening_date: payload.opening_date,
      nearby_info: payload.nearby_info,
      main_image_url: payload.main_image_url,
      main_image_base64: payload.main_image_base64,
      tags: payload.tags,
      location_info: payload.location_info,
      status,
      created_by: userId
    }, { transaction });

    // 创建酒店政策
    if (payload.policy) {
      await HotelPolicy.create({
        hotel_id: hotel.id,
        cancellation_policy: payload.policy.cancellation_policy,
        payment_policy: payload.policy.payment_policy,
        children_policy: payload.policy.children_policy,
        pets_policy: payload.policy.pets_policy
      }, { transaction });
    }

    // 处理酒店设施
    for (const f of payload.facilities || []) {
      await Facility.findOrCreate({
        where: { id: f.id },
        defaults: { id: f.id, name: f.name || f.id },
        transaction
      });
      await HotelFacility.findOrCreate({
        where: { hotel_id: hotel.id, facility_id: f.id },
        defaults: { hotel_id: hotel.id, facility_id: f.id },
        transaction
      });
    }

    // 处理酒店服务
    for (const s of payload.services || []) {
      await Service.findOrCreate({
        where: { id: s.id },
        defaults: { id: s.id, name: s.name || s.id },
        transaction
      });
      await HotelService.findOrCreate({
        where: { hotel_id: hotel.id, service_id: s.id },
        defaults: { hotel_id: hotel.id, service_id: s.id },
        transaction
      });
    }

    // 处理房型信息
    for (const rt of payload.room_types || []) {
      const roomType = await RoomType.create({
        hotel_id: hotel.id,
        room_type_name: rt.room_type_name,
        bed_type: rt.bed_type,
        area: rt.area,
        description: rt.description,
        room_image_url: rt.room_image_url,
        room_image_base64: rt.room_image_base64
      }, { transaction });

      // 房型政策
      if (rt.policy) {
        await RoomPolicy.create({
          room_type_id: roomType.id,
          cancellation_policy: rt.policy.cancellation_policy,
          payment_policy: rt.policy.payment_policy,
          children_policy: rt.policy.children_policy,
          pets_policy: rt.policy.pets_policy
        }, { transaction });
      }

      // 房型设施
      for (const f of rt.facilities || []) {
        await Facility.findOrCreate({
          where: { id: f.id },
          defaults: { id: f.id, name: f.name || f.id },
          transaction
        });
        await RoomFacility.findOrCreate({
          where: { room_type_id: roomType.id, facility_id: f.id },
          defaults: { room_type_id: roomType.id, facility_id: f.id },
          transaction
        });
      }

      // 房型服务
      for (const s of rt.services || []) {
        await Service.findOrCreate({
          where: { id: s.id },
          defaults: { id: s.id, name: s.name || s.id },
          transaction
        });
        await RoomService.findOrCreate({
          where: { room_type_id: roomType.id, service_id: s.id },
          defaults: { room_type_id: roomType.id, service_id: s.id },
          transaction
        });
      }

      // 房型标签
      for (const tagName of rt.tags || []) {
        await RoomTag.create({
          room_type_id: roomType.id,
          tag_name: tagName
        }, { transaction });
      }

      // 房型价格
      for (const priceItem of rt.prices || []) {
        await RoomPrice.create({
          room_type_id: roomType.id,
          price_date: priceItem.price_date,
          price: priceItem.price
        }, { transaction });
      }
    }

    await transaction.commit();
    return { hotel_id: hotel.id, status };
  } catch (error) {
    if (!transaction.finished || transaction.finished !== 'commit') {
      await transaction.rollback();
    }
    throw error;
  }
};

module.exports = {
  createHotelService
};
