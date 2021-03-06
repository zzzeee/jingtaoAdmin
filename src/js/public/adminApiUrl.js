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
    //登录验证
    checkUser: host + '/api/settled/LoginController/checkSettledMerchantLoginStatus',
    //基本信息
    shopBasicInfo: host + '/api/settled/BasicController/getBasicSettledMerchantInfo',
    //获取订单列表
    getOrderList: host + '/api/settled/SorderController/getSettledOrderList',
    //获取订单详情
    getOrderDetail: host + '/api/settled/SorderController/getSettledOrderDetail',
    //获取物流信息
    getExpressInfo: host + '/api/settled/SorderController/getShopOrderExpressByExpressNum',
    //商家发货
    shopDeliverGoods: host + '/api/settled/SorderController/shopOrderExpressNumInsdert',
    //添加极光ID
    addPUSHID: host + '/api/settled/BasicController/shopPushUniqueIDSave',
    //添加设备信息
    addDeviceLog: host + '/api/Version/addUserActivityLog',
};

export default urls;