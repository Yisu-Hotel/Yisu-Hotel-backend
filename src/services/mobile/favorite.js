const { Favorite, Hotel, HotelImage, RoomType } = require('../../models');

// 添加收藏
const addFavoriteService = async (user_id, hotel_id) => {
  // 检查是否已经收藏
  const existingFavorite = await Favorite.findOne({
    where: {
      user_id,
      hotel_id
    }
  });

  if (existingFavorite) {
    const error = new Error('已经收藏过该酒店');
    error.code = 5002;
    error.httpStatus = 400;
    throw error;
  }

  // 创建收藏
  const favorite = await Favorite.create({
    user_id,
    hotel_id
  });

  return {
    favorite_id: favorite.id
  };
};

// 取消收藏
const removeFavoriteService = async (user_id, hotel_id) => {
  // 查找并删除收藏
  const favorite = await Favorite.findOne({
    where: {
      user_id,
      hotel_id
    }
  });
  
  if (!favorite) {
    const error = new Error('收藏不存在');
    error.code = 5001;
    error.httpStatus = 404;
    throw error;
  }
  
  await favorite.destroy();
  
  return {
    hotel_id
  };
};

// 获取收藏列表
const getFavoriteListService = async (user_id, { page = 1, pageSize = 10 } = {}) => {
  try {
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    // 查询用户收藏的酒店
    const { count, rows: favorites } = await Favorite.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['id', 'hotel_name_cn', 'location_info', 'star_rating', 'main_image_url'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset: offset
    });
    
    // 格式化数据
    const formattedFavorites = favorites.map(favorite => {
      if (!favorite.hotel) {
        return {
          favorite_id: favorite.id,
          hotel_id: favorite.hotel_id,
          hotel_name: '未知酒店',
          hotel_address: '',
          hotel_star: 0,
          main_image_url: '',
          created_at: favorite.created_at
        };
      }

      return {
        favorite_id: favorite.id,
        hotel_id: favorite.hotel_id,
        hotel_name: favorite.hotel.hotel_name_cn || '未知酒店',
        hotel_address: favorite.hotel.location_info?.formatted_address || '',
        hotel_star: favorite.hotel.star_rating || 0,
        main_image_url: favorite.hotel.main_image_url?.[0] || '',
        created_at: favorite.created_at
      };
    });
    
    return {
      total: count,
      page: parseInt(page),
      page_size: parseInt(pageSize),
      list: formattedFavorites
    };
  } catch (error) {
    console.error('Get favorite list error:', error);
    // 抛出更友好的错误
    const friendlyError = new Error('获取收藏列表失败');
    friendlyError.code = 500;
    friendlyError.httpStatus = 500;
    throw friendlyError;
  }
};

module.exports = {
  getFavoriteListService,
  removeFavoriteService,
  addFavoriteService
};