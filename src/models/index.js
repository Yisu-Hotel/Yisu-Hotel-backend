const sequelize = require('../config/database');

const User = require('./entities/User');
const Hotel = require('./entities/Hotel');
const Facility = require('./entities/Facility');
const Service = require('./entities/Service');
const HotelFacility = require('./entities/HotelFacility');
const HotelService = require('./entities/HotelService');
const HotelPolicy = require('./entities/HotelPolicy');
const RoomType = require('./entities/RoomType');
const RoomFacility = require('./entities/RoomFacility');
const RoomService = require('./entities/RoomService');
const RoomPrice = require('./entities/RoomPrice');
const RoomTag = require('./entities/RoomTag');
const RoomPolicy = require('./entities/RoomPolicy');
const AuditLog = require('./entities/AuditLog');
const HotelHistory = require('./entities/HotelHistory');
const UserProfile = require('./entities/UserProfile');
const Favorite = require('./entities/Favorite');
const Booking = require('./entities/Booking');
const Coupon = require('./entities/Coupon');
const UserCoupon = require('./entities/UserCoupon');
const VerificationCode = require('./entities/VerificationCode');
const UserThirdPartyAuth = require('./entities/UserThirdPartyAuth');
const Banner = require('./entities/Banner');
const City = require('./entities/City');
const HotelReview = require('./entities/HotelReview');

User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(UserThirdPartyAuth, { foreignKey: 'user_id', as: 'thirdPartyAuths' });
UserThirdPartyAuth.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(UserCoupon, { foreignKey: 'user_id', as: 'userCoupons' });
UserCoupon.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Hotel, { foreignKey: 'created_by', as: 'createdHotels' });
Hotel.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(AuditLog, { foreignKey: 'auditor_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'auditor_id', as: 'auditor' });

User.hasMany(HotelHistory, { foreignKey: 'modified_by', as: 'hotelHistories' });
HotelHistory.belongsTo(User, { foreignKey: 'modified_by', as: 'modifier' });

Hotel.hasMany(HotelFacility, { foreignKey: 'hotel_id', as: 'hotelFacilities' });
HotelFacility.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

Hotel.hasMany(HotelService, { foreignKey: 'hotel_id', as: 'hotelServices' });
HotelService.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

Hotel.hasOne(HotelPolicy, { foreignKey: 'hotel_id', as: 'policy' });
HotelPolicy.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

Hotel.hasMany(RoomType, { foreignKey: 'hotel_id', as: 'roomTypes' });
RoomType.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

Hotel.hasMany(AuditLog, { foreignKey: 'hotel_id', as: 'auditLogs' });
AuditLog.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

Hotel.hasMany(HotelHistory, { foreignKey: 'hotel_id', as: 'histories' });
HotelHistory.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

Hotel.hasMany(Favorite, { foreignKey: 'hotel_id', as: 'favorites' });
Favorite.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

Hotel.hasMany(Booking, { foreignKey: 'hotel_id', as: 'bookings' });
Booking.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

Facility.hasMany(HotelFacility, { foreignKey: 'facility_id', as: 'hotelFacilities' });
HotelFacility.belongsTo(Facility, { foreignKey: 'facility_id', as: 'facility' });

Facility.hasMany(RoomFacility, { foreignKey: 'facility_id', as: 'roomFacilities' });
RoomFacility.belongsTo(Facility, { foreignKey: 'facility_id', as: 'facility' });

Service.hasMany(HotelService, { foreignKey: 'service_id', as: 'hotelServices' });
HotelService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

Service.hasMany(RoomService, { foreignKey: 'service_id', as: 'roomServices' });
RoomService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

RoomType.hasMany(RoomFacility, { foreignKey: 'room_type_id', as: 'roomFacilities' });
RoomFacility.belongsTo(RoomType, { foreignKey: 'room_type_id', as: 'roomType' });

RoomType.hasMany(RoomService, { foreignKey: 'room_type_id', as: 'roomServices' });
RoomService.belongsTo(RoomType, { foreignKey: 'room_type_id', as: 'roomType' });

RoomType.hasMany(RoomPrice, { foreignKey: 'room_type_id', as: 'roomPrices' });
RoomPrice.belongsTo(RoomType, { foreignKey: 'room_type_id', as: 'roomType' });

RoomType.hasMany(RoomTag, { foreignKey: 'room_type_id', as: 'roomTags' });
RoomTag.belongsTo(RoomType, { foreignKey: 'room_type_id', as: 'roomType' });

RoomType.hasOne(RoomPolicy, { foreignKey: 'room_type_id', as: 'policy' });
RoomPolicy.belongsTo(RoomType, { foreignKey: 'room_type_id', as: 'roomType' });

RoomType.hasMany(Booking, { foreignKey: 'room_type_id', as: 'bookings' });
Booking.belongsTo(RoomType, { foreignKey: 'room_type_id', as: 'roomType' });

Hotel.hasMany(HotelReview, { foreignKey: 'hotel_id', as: 'reviews' });
HotelReview.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

User.hasMany(HotelReview, { foreignKey: 'user_id', as: 'reviews' });
HotelReview.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

RoomType.hasMany(HotelReview, { foreignKey: 'room_type_id', as: 'reviews' });
HotelReview.belongsTo(RoomType, { foreignKey: 'room_type_id', as: 'roomType' });

Booking.hasMany(HotelReview, { foreignKey: 'booking_id', as: 'reviews' });
HotelReview.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

Coupon.hasMany(UserCoupon, { foreignKey: 'coupon_id', as: 'userCoupons' });
UserCoupon.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'coupon' });

module.exports = {
  sequelize,
  User,
  Hotel,
  Facility,
  Service,
  HotelFacility,
  HotelService,
  HotelPolicy,
  RoomType,
  RoomFacility,
  RoomService,
  RoomPrice,
  RoomTag,
  RoomPolicy,
  AuditLog,
  HotelHistory,
  UserProfile,
  Favorite,
  Booking,
  Coupon,
  UserCoupon,
  VerificationCode,
  UserThirdPartyAuth,
  Banner,
  City,
  HotelReview
};
