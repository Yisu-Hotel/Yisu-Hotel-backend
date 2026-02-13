const { Banner } = require('../../models');
const { Op } = require('sequelize');

const getBannerListService = async () => {
  const now = new Date();
  
  const banners = await Banner.findAll({
    where: {
      is_active: true,
      start_time: {
        [Op.lte]: now
      },
      end_time: {
        [Op.gte]: now
      }
    },
    order: [['sort', 'ASC']],
    attributes: ['id', 'title', 'image_url', 'target_type', 'target_id', 'url', 'sort']
  });

  // 转换为前端需要的格式
  return banners.map(banner => {
    let link_url = '';
    
    switch (banner.target_type) {
      case 'hotel':
        link_url = `/mobile/hotel/${banner.target_id}`;
        break;
      case 'promotion':
        link_url = `/mobile/promotion/${banner.target_id}`;
        break;
      case 'url':
        link_url = banner.url;
        break;
      default:
        link_url = '';
    }

    return {
      id: banner.id,
      title: banner.title,
      image_url: banner.image_url,
      link_url: link_url,
      order: banner.sort,
      status: banner.is_active ? 'active' : 'inactive'
    };
  });
};

module.exports = {
  getBannerListService
};