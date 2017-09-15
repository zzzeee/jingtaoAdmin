/**
 * api url地址
 * @auther linzeyong
 * @date   2017.04.18
 */

var host = 'http://vpn.jingtaomart.com';
// host = 'http://api.jingtaomart.com';

var urls = {
    //服务器地址
    host: host,
    //首页地图
    homeMap: 'file:///android_asset/newmap/index.html',
    //首页省份及城市的商品列表
    getCityAndProduct: host + '/api/IndexNController/getProvincialInformationAndCities',
    //获取分类
    getProductClassify: host + '/api/ClassificationNController/getClassificationByClassType',
    //获取限时抢购商品
    getPanicBuyingProductList: host + '/api/FindNController/getPanicBuyingActivityProductList',
    //获取发现频道的推荐商家及主推的三个商品
    getFindShopList: host + '/api/FindNController/getFindShopAndProductsList',
    //获取优惠券的图片
    getCouponImages: host + '/api/CouponNController/getCouponInfoByCouponID?couponID=',
    //获取产品列表 (城市，店铺，分类)
    getProductList: host + '/api/ProductNController/getProductListByParame',
    //获取城市的店铺列表
    getCityShopList: host + '/api/ShopNController/getCityShopListByParame',
    //获取商品详情
    getProductInfo: host + '/api/ProductNController/getProductInfoByProID',
    //获取图文详情
    getProductDetails: host + '/api/ProductController/getProductDetailInfoByProID?gID=',
    //获取推荐商品列表
    getRecommendList: host + '/api/ProductNController/getRecommendedProductsList',
    //获取指定地区的运费
    getProductFreight: host + '/api/ProductNController/getProductFreightByProvinceID',
    //添加商品到购物车
    addCarProduct: host + '/api/ShoppingCartController/productShoppingCartInsert',
    //获取购物车信息
    getCarInfo: host + '/api/ShoppingCartController/getMemberShopCartProductList',
    //更新购物车商品数量
    addCarProductNumber: host + '/api/ShoppingCartController/memberShopCartProductNumEditByCartID',
    //删除购物车商品
    delCarProductNumber: host + '/api/ShoppingCartController/memberShopCartProductDeleteByCartID',
    //登录验证
    checkUser: host + '/api/MemberNController/checkMemberLoginStatus',
    //发送验证码
    sendCode: host + '/api/RegisterNController/sendRegisterMessage',
    //用户注册
    userRegister: host + '/api/RegisterNController/registerMemberInfoAdd',
    //收藏、取消收藏
    collection: host + '/api/MemberNController/memberFollowStatusEditBymID',
    //获取收藏列表
    getCollection: host + '/api/MemberNController/getMemberFollowListBymID',
    //批量收藏商品
    batchCollection: host + '/api/MemberNController/memberFollowProductListByPidAry',
    //修改用户登录密码
    updateUserPassword: host + '/api/MemberNController/memberPasswordEditByMID',
    //会员领取优惠券
    userGiveCoupon: host + '/api/CouponNController/memberReceiveCouponAdd',
    //获取城市图片及广告
    getCityImgBanner: host + '/api/AdsNController/getCityAdsByCityId',
    //获取用户的优惠券列表
    getUserCoupons: host + '/api/CouponNController/getMemberCouponListByMID',
    //获取商家的优惠券列表
    getShopCoupons: host + '/api/CouponNController/getShopProductCouponList',
    //获取用户的地址列表
    getUserAddressList: host + '/api/AddressNController/getMemberShopAddressListByMID',
    //获取所有的省市区
    getAllAreas: host + '/api/RegionNController/getMemberAddressAreaList',
    //添加用户地址
    addUserAddress: host + '/api/AddressNController/memberAddressAdd',
    //编辑用户地址
    editUserAddress: host + '/api/AddressNController/memberShopAddressEdit',
    //删除用户地址
    deleteUserAddress: host + '/api/AddressNController/memberShopAddressDeleteBySaID',
    //获取会员基本信息
    getUserInfo: host + '/api/MemberNController/getMemberInfoByToken',
    //获取积分信息及消费记录
    getIntegralData: host + '/api/MemberNController/getMemberIntegralRecord',
    //结算购物车商品
    confirmOrder: host + '/api/OrderNController/getConfirmOrderListByCartID',
    //提交订单
    updateOrder: host + '/api/OrderNController/memberGenerateOrder',
    //获取店铺信息
    getShopInfo: host + '/api/ShopNController/getShopDetailInfoByShopID',
    //获取订单列表
    getOrderList: host + '/api/OrderNController/getMemberOrderList',
    //获取订单详细信息
    getOrderDetails: host + '/api/OrderNController/getOrderInfoByOrderNum',
    //更新订单状态
    updateOrderStatu: host + '/api/OrderNController/memberOrderStatusEditByOrderNum',
    //立即购买接口
    buyNowAPI: host + '/api/OrderNController/productUnderstandingBuyingConfirm',
    //获取物流信息
    getLogisticsInfo: host + '/api/OrderNController/getExpressListByExpressNum',
    //获取支付宝支付信息
    getAlipayInfo: host + '/api/AplipayNController/getAlipayInfo',
    //获取微信支付信息
    getWeiXinPayInfo: host + '/api/AplipayNController/getWeiXinPayInfo',
    //录入商家入驻信息
    updateSellerInfo: host + '/api/ApplyNController/applySettledMerchant',
    //浦发信用卡
    gotoPuFa: 'https://ecentre.spdbccc.com.cn/creditcard/indexActivity.htm?data=P1520716',
    //浦发注册接口
    pufaRegister: host + '/api/MemberNController/memberPudongDevelopmentUser',
    //获取版本信息
    getVersion: host + '/api/Version/getNewestAPPVersion',
    //更新会员资料
    updateUserInfo: host + '/api/MemberNController/memberInfoUpdateByMID',
    //获取微信AccessToken
    getWXAccessToken: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    //获取微信个人信息
    getWXUserInfo: 'https://api.weixin.qq.com/sns/userinfo',
    //获取QQ的个人信息
    getQQuserInfo: 'https://graph.qq.com/user/get_user_info',
    //获取微博的个人信息
    getWBUserInfo: 'https://api.weibo.com/2/eps/user/info.json',
    //微信或QQ登陆接口
    weixinLoginApi: host + '/api/WeChatNController/memberWeChartOrQqQuickLanding',
    //分享链接
    weixinShareUrl: 'http://www.hrbxinya.cn/product/detail.html?gID=',
    //ios更新地址
    iosUpdateUrl: 'https://itunes.apple.com/us/app//u5883/u6dd8/u7f51/id1203113966?mt=8',
    //基本更新地址
    basicUpdateUrl: 'http://vpn.jingtaomart.com/resource/static/api/down/download.html',
    //线上LOGO图标
    appJingTaoLogo: 'http://vpn.jingtaomart.com/resource/static/api/images/logo.png',
    //添加设备记录
    addDeviceLog: host + '/api/Version/addUserActivityLog',
    //提交用户建议信息
    updateUserMessage: host + '/api/ApplyNController/memberLeavingMessage',
};

export default urls;