const bannerController = {
  // 获取首页Banner列表
  getBannerList: async (req, res) => {
    try {
      // 模拟数据，实际项目中应该从数据库获取
      const banners = [
        {
          id: 1,
          title: '春节特惠',
          image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=春节酒店促销横幅，喜庆红色背景，金色装饰，现代风格&image_size=landscape_16_9',
          link_url: '/mobile/hotels/search?promotion=spring_festival',
          order: 1,
          status: 'active'
        },
        {
          id: 2,
          title: '新用户专享',
          image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=新用户酒店优惠横幅，蓝色背景，现代设计，吸引人的优惠信息&image_size=landscape_16_9',
          link_url: '/mobile/promotion/new-user',
          order: 2,
          status: 'active'
        },
        {
          id: 3,
          title: '周末特价',
          image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=周末酒店特价横幅，绿色背景，休闲风格，周末度假主题&image_size=landscape_16_9',
          link_url: '/mobile/hotels/search?weekend_special=true',
          order: 3,
          status: 'active'
        }
      ];

      return res.json({
        code: 0,
        msg: '获取成功',
        data: banners
      });
    } catch (error) {
      console.error('Get banner list error:', error);
      return res.status(500).json({
        code: 500,
        msg: '服务器错误',
        data: null
      });
    }
  }
};

module.exports = bannerController;