/**
 * api url地址
 * @auther linzeyong
 * @date   2017.04.18
 */

// var host = 'http://vpn.jingtaomart.com';
host = 'http://api.jingtaomart.com';

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
};

export default urls;