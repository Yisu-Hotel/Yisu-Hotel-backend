const { getAdminHotelAuditListService } = require('../../services/pc/admin');

const getAdminHotelAuditList = async (req, res) => {
  try {
    const { page, pageSize, status, startDate, endDate, keyword } = req.adminHotelFilter || {
      page: 1,
      pageSize: 10,
      status: null,
      startDate: null,
      endDate: null,
      keyword: null
    };

    const data = await getAdminHotelAuditListService({
      page,
      pageSize,
      status,
      startDate,
      endDate,
      keyword
    });

    return res.json({
      code: 0,
      msg: '查询成功',
      data
    });
  } catch (error) {
    console.error('Get admin audit list error:', error);
    return res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

module.exports = {
  getAdminHotelAuditList
};
