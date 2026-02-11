const { Hotel, AuditLog } = require('../../models');
const { buildAdminHotelFilterWhere, getAuditStatusText } = require('../../utils/hotel');

const adminHotelAttributes = [
  'id',
  'hotel_name_cn',
  'hotel_name_en',
  'location_info',
  'status',
  'created_at',
  'created_by'
];

const getAdminHotelAuditListService = async ({ status, startDate, endDate, keyword, page, pageSize }) => {
  const whereClause = buildAdminHotelFilterWhere({ status, startDate, endDate, keyword });

  const total = await Hotel.count({ where: whereClause });

  const hotels = await Hotel.findAll({
    where: whereClause,
    attributes: adminHotelAttributes,
    order: [['created_at', 'DESC']],
    limit: pageSize,
    offset: (page - 1) * pageSize,
    raw: true
  });

  const hotelIds = hotels.map((item) => item.id);
  const auditMap = new Map();
  if (hotelIds.length) {
    const logs = await AuditLog.findAll({
      where: { hotel_id: hotelIds },
      order: [['audited_at', 'DESC']],
      raw: true
    });
    for (const log of logs) {
      if (!auditMap.has(log.hotel_id)) {
        auditMap.set(log.hotel_id, log);
      }
    }
  }

  const list = hotels.map((hotel) => {
    const log = auditMap.get(hotel.id);
    const item = {
      hotel_id: hotel.id,
      hotel_name_cn: hotel.hotel_name_cn,
      hotel_name_en: hotel.hotel_name_en,
      submitted_at: hotel.created_at,
      submitted_by: hotel.created_by,
      status: hotel.status,
      status_text: getAuditStatusText(hotel.status),
      location_info: hotel.location_info || null
    };
    if (log) {
      if (log.audited_at) {
        item.audited_at = log.audited_at;
      }
      if (log.auditor_id) {
        item.audited_by = log.auditor_id;
      }
      if (log.reject_reason) {
        item.reject_reason = log.reject_reason;
      }
    }
    return item;
  });

  return {
    total,
    page,
    page_size: pageSize,
    list
  };
};

module.exports = {
  getAdminHotelAuditListService
};
