const { Hotel } = require('../../models');

const homeController = {
  // 获取首页推荐酒店列表
  getRecommendedHotels: async (req, res) => {
    try {
      // 从数据库获取推荐酒店，按评分和预订量排序
      const hotels = await Hotel.findAll({
        where: {
          status: 'approved', // 只显示已通过审核的酒店
          is_recommended: true // 只显示推荐的酒店
        },
        attributes: [
          'id',
          'hotel_name_cn',
          'hotel_name_en',
          'star_rating',
          'rating',
          'address',
          'description',
          'main_image_url',
          'min_price'
        ],
        order: [
          ['rating', 'DESC'], // 按评分降序
          ['booking_count', 'DESC'] // 按预订量降序
        ],
        limit: 10, // 限制返回10条
        raw: true
      });

      // 如果数据库中没有推荐酒店，返回模拟数据
      if (!hotels || hotels.length === 0) {
        const mockHotels = [
          {
            id: 'hotel_001',
            hotel_name_cn: '易宿酒店北京王府井店',
            hotel_name_en: 'Yisu Hotel Beijing Wangfujing',
            star_rating: 4,
            rating: 4.5,
            address: '北京市东城区王府井大街88号',
            description: '位于北京市中心的豪华酒店，交通便利，设施齐全',
            main_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=北京豪华酒店外观，现代风格，高端大气，王府井地区&image_size=landscape_4_3',
            min_price: 399
          },
          {
            id: 'hotel_002',
            hotel_name_cn: '易宿酒店上海外滩店',
            hotel_name_en: 'Yisu Hotel Shanghai Bund',
            star_rating: 5,
            rating: 4.8,
            address: '上海市黄浦区外滩18号',
            description: '俯瞰黄浦江美景的五星级酒店，奢华体验',
            main_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=上海外滩五星级酒店，江景房，现代化设计，高端奢华&image_size=landscape_4_3',
            min_price: 599
          },
          {
            id: 'hotel_003',
            hotel_name_cn: '易宿酒店广州天河店',
            hotel_name_en: 'Yisu Hotel Guangzhou Tianhe',
            star_rating: 4,
            rating: 4.3,
            address: '广州市天河区天河路385号',
            description: '位于广州商业中心的舒适酒店，购物便利',
            main_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=广州天河商业区酒店，现代风格，交通便利，购物方便&image_size=landscape_4_3',
            min_price: 329
          }
        ];
        
        return res.json({
          code: 0,
          msg: '获取推荐酒店成功',
          data: {
            total: mockHotels.length,
            list: mockHotels
          }
        });
      }

      return res.json({
        code: 0,
        msg: '获取推荐酒店成功',
        data: {
          total: hotels.length,
          list: hotels
        }
      });
    } catch (error) {
      console.error('Get recommended hotels error:', error);
      // 数据库连接失败时，返回模拟数据
      const mockHotels = [
        {
          id: 'hotel_001',
          hotel_name_cn: '易宿酒店北京王府井店',
          hotel_name_en: 'Yisu Hotel Beijing Wangfujing',
          star_rating: 4,
          rating: 4.5,
          address: '北京市东城区王府井大街88号',
          description: '位于北京市中心的豪华酒店，交通便利，设施齐全',
          main_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=北京豪华酒店外观，现代风格，高端大气，王府井地区&image_size=landscape_4_3',
          min_price: 399
        },
        {
          id: 'hotel_002',
          hotel_name_cn: '易宿酒店上海外滩店',
          hotel_name_en: 'Yisu Hotel Shanghai Bund',
          star_rating: 5,
          rating: 4.8,
          address: '上海市黄浦区外滩18号',
          description: '俯瞰黄浦江美景的五星级酒店，奢华体验',
          main_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=上海外滩五星级酒店，江景房，现代化设计，高端奢华&image_size=landscape_4_3',
          min_price: 599
        },
        {
          id: 'hotel_003',
          hotel_name_cn: '易宿酒店广州天河店',
          hotel_name_en: 'Yisu Hotel Guangzhou Tianhe',
          star_rating: 4,
          rating: 4.3,
          address: '广州市天河区天河路385号',
          description: '位于广州商业中心的舒适酒店，购物便利',
          main_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=广州天河商业区酒店，现代风格，交通便利，购物方便&image_size=landscape_4_3',
          min_price: 329
        }
      ];
      
      return res.json({
        code: 0,
        msg: '获取推荐酒店成功',
        data: {
          total: mockHotels.length,
          list: mockHotels
        }
      });
    }
  },

  // 获取首页热门活动列表
  getHotActivities: async (req, res) => {
    try {
      // 模拟数据，实际项目中应该从数据库获取
      const activities = [
        {
          id: 1,
          title: '春节特惠',
          description: '春节期间预订酒店，享受8折优惠',
          start_date: '2026-02-01',
          end_date: '2026-02-15',
          image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=春节酒店促销活动，喜庆红色背景，金色装饰，优惠信息&image_size=landscape_4_3',
          link_url: '/mobile/hotels/search?promotion=spring_festival'
        },
        {
          id: 2,
          title: '新用户专享',
          description: '新用户首次预订酒店，立减100元',
          start_date: '2026-01-01',
          end_date: '2026-12-31',
          image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=新用户酒店优惠活动，蓝色背景，现代设计，吸引人的优惠信息&image_size=landscape_4_3',
          link_url: '/mobile/promotions/new-user'
        },
        {
          id: 3,
          title: '周末特价',
          description: '周末预订酒店，享受9折优惠',
          start_date: '2026-01-01',
          end_date: '2026-12-31',
          image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=周末酒店特价活动，绿色背景，休闲风格，周末度假主题&image_size=landscape_4_3',
          link_url: '/mobile/hotels/search?weekend_special=true'
        }
      ];

      return res.json({
        code: 0,
        msg: '获取热门活动成功',
        data: {
          total: activities.length,
          list: activities
        }
      });
    } catch (error) {
      console.error('Get hot activities error:', error);
      return res.status(500).json({
        code: 500,
        msg: '服务器错误',
        data: null
      });
    }
  },

  // 获取首页数据（综合）
  getHomeData: async (req, res) => {
    try {
      // 并行获取首页所有数据
      const [banners, recommendedHotels, hotActivities] = await Promise.all([
        // 获取Banner列表
        (async () => {
          return [
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
              link_url: '/mobile/promotions/new-user',
              order: 2,
              status: 'active'
            }
          ];
        })(),

        // 获取推荐酒店
        (async () => {
          try {
            const hotels = await Hotel.findAll({
              where: {
                status: 'approved',
                is_recommended: true
              },
              attributes: [
                'id',
                'hotel_name_cn',
                'hotel_name_en',
                'star_rating',
                'rating',
                'address',
                'main_image_url',
                'min_price'
              ],
              order: [
                ['rating', 'DESC'],
                ['booking_count', 'DESC']
              ],
              limit: 10,
              raw: true
            });
            return hotels.length > 0 ? hotels : [
              {
                id: 'hotel_001',
                hotel_name_cn: '易宿酒店北京王府井店',
                hotel_name_en: 'Yisu Hotel Beijing Wangfujing',
                star_rating: 4,
                rating: 4.5,
                address: '北京市东城区王府井大街88号',
                main_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=北京豪华酒店外观，现代风格，高端大气，王府井地区&image_size=landscape_4_3',
                min_price: 399
              }
            ];
          } catch (error) {
            console.error('Get recommended hotels error:', error);
            return [
              {
                id: 'hotel_001',
                hotel_name_cn: '易宿酒店北京王府井店',
                hotel_name_en: 'Yisu Hotel Beijing Wangfujing',
                star_rating: 4,
                rating: 4.5,
                address: '北京市东城区王府井大街88号',
                main_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=北京豪华酒店外观，现代风格，高端大气，王府井地区&image_size=landscape_4_3',
                min_price: 399
              }
            ];
          }
        })(),

        // 获取热门活动
        (async () => {
          return [
            {
              id: 1,
              title: '春节特惠',
              description: '春节期间预订酒店，享受8折优惠',
              start_date: '2026-02-01',
              end_date: '2026-02-15',
              image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=春节酒店促销活动，喜庆红色背景，金色装饰，优惠信息&image_size=landscape_4_3',
              link_url: '/mobile/hotels/search?promotion=spring_festival'
            }
          ];
        })()
      ]);

      return res.json({
        code: 0,
        msg: '获取首页数据成功',
        data: {
          banners,
          recommended_hotels: {
            total: recommendedHotels.length,
            list: recommendedHotels
          },
          hot_activities: {
            total: hotActivities.length,
            list: hotActivities
          }
        }
      });
    } catch (error) {
      console.error('Get home data error:', error);
      return res.status(500).json({
        code: 500,
        msg: '服务器错误',
        data: null
      });
    }
  }
};

module.exports = homeController;