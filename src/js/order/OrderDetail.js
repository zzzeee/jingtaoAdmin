/**
 * 我的订单 - 订单详情
 * @auther linzeyong
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Linking,
    Clipboard,
    RefreshControl,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Utils from '../public/utils';
import Urls from '../public/adminApiUrl';
import { Size, pixel, } from '../public/globalStyle';
import { Color } from '../public/theme';
import OrderGood from './OrderGood';
import AppHead from '../public/AppHead';
import ErrorAlert from '../other/ErrorAlert';
import AlertMoudle from '../other/AlertMoudle';

import User from '../public/user';
var _User = new User();

export default class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: null,
            showAlert: false,
            showCancelBox: false,
            load_or_error: null,
            deleteAlert: false,
            showPayModal: false,
            isRefreshing: true,
        };
        this.mToken = null;
        this.shopOrderNum = null;
        this.selectIndex = 0;
        this.ref_flatList = null;
        this.type = 1;
        this.alertMsg = '';
        this.isRefresh = false;   // 返回时是否刷新列表页
        this.actualTotal = 0;
        this.params = null;
    }

    componentWillMount() {
        this.initDatas();
    }

    componentDidMount() {
        this.getOrderInfo();
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            this.params = navigation.state.params || {};
            let { mToken, shopOrderNum, selectIndex, isRefresh, } = this.params;
            this.mToken = mToken || null;
            this.shopOrderNum = shopOrderNum || null;
            this.selectIndex = selectIndex || 0;
            this.isRefresh = isRefresh || false;
        }
    };

    //获取订单信息
    getOrderInfo = async () => {
        let { navigation } = this.props;
        if(!this.mToken) this.mToken = await _User.getUserID().then((result)=>result);
        // console.log(this.mToken);
        if(!this.mToken) {
            navigation.navigate('Login', {
                backTo: 'OrderDetail',
                backObj: {
                    isRefresh: true,
                    selectIndex: this.selectIndex,
                    shopOrderNum: this.shopOrderNum,
                },
            });
        }else if(!this.shopOrderNum) {
            this.setState({
                isRefreshing: false,
                load_or_error: this.notFindOrder(),
            });
        }else {
            Utils.fetch(Urls.getOrderDetail, 'post', {
                sToken: this.mToken,
                soID: this.shopOrderNum,
            }, (result)=>{
                console.log(result);
                if(result && result.sTatus == 1) {
                    this.setState({
                        isRefreshing: false,
                        orders: result.oAry,
                        load_or_error: null,
                    });
                }else if(result && result.sTatus == 4) {
                    _User.delUserID()
                    .then(()=>{
                        navigation.navigate('Login', {
                            backTo: 'OrderDetail',
                            backObj: {
                                isRefresh: true,
                                selectIndex: this.selectIndex,
                                shopOrderNum: this.shopOrderNum,
                            },
                        });
                    });
                }else {
                    this.setState({
                        isRefreshing: false,
                        load_or_error: this.notFindOrder(),
                    });
                }
            }, (view)=>{
                this.setState({
                    isRefreshing: false,
                    load_or_error: view,
                });
            }, {
                loadType: 2,
                hideLoad: true,
            });
        }
    };

    //显示提示 
    showToast = (str) => {
        let toast = Toast.show(str, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            hideOnPress: true,
        });
    };

    //显示取消订单
    showCancelWindow = () => {
        this.setState({showCancelBox: true, });
    };

    //显示提示框
    showAutoModal = (msg) => {
        this.alertMsg = msg;
        this.setState({showAlert: true, });
    };

    //隐藏提示框
    hideAutoModal = () => {
        this.setState({ showAlert: false });
    };

    //显示删除提示框
    showAlertMoudle = (msg, func, rText = null) => {
        this.alertObject = {
            text: msg,
            leftText: '取消',
            rightText: rText || '确认',
            leftClick: ()=>this.setState({deleteAlert: false,}),
            rightClick: func,
            leftBgColor: '#fff',
            rightColor: Color.mainFontColor,
            rightBgColor: '#fff',
        };
        this.setState({deleteAlert: true,});
    };

    //联系客服
    sellTelphone = () => {
        this.setState({deleteAlert: false,}, ()=>{
            Linking.openURL('tel: 4000237333')
            .catch(err => console.error('调用电话失败！', err));
        });
    };

    render() {
        let { navigation } = this.props;
        let { 
            orders, 
            showCancelBox, 
            deleteAlert, 
            showAlert, 
            load_or_error, 
            showPayModal,
        } = this.state;
        return (
            <View style={styles.flex}>
                <AppHead
                    title={'订单详情'}
                    goBack={true}
                    leftPress={()=>{
                        if(this.isRefresh) {
                            navigation.navigate('Order', {
                                mToken: this.mToken,
                                selectIndex: this.selectIndex,
                            });
                        }else {
                            navigation.goBack(null);
                        }
                    }}
                    onPress={()=>{
                        if(this.ref_flatList) {
                            this.ref_flatList.scrollToOffset({offset: 0, animated: true});
                        }
                    }}
                />
                <View style={styles.container}>
                    {load_or_error ?
                        load_or_error : 
                        <ScrollView
                            refreshControl={<RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={()=>{
                                    this.setState({isRefreshing: true}, this.getOrderInfo);
                                }}
                                title="释放立即刷新我..."
                                tintColor={Color.mainFontColor}
                                titleColor={Color.mainFontColor}
                            />}
                        >
                            {this.orderComponent()}
                        </ScrollView>
                    }
                </View>
                {this.titleBtns && this.titleBtns.btns2.length > 0 ?
                    <View style={styles.totalBox}>
                        {this.titleBtns.btns2.map((item, index)=>{
                            let _bgColor = item.bgColor || Color.mainColor;
                            return (
                                <TouchableOpacity key={index} style={[].concat(styles.btnStyle3, {
                                    backgroundColor: _bgColor,
                                })} onPress={item.fun}>
                                    <Text style={styles.fontStyle4}>{item.val}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    : null
                }
                {deleteAlert ?
                    <AlertMoudle visiable={deleteAlert} {...this.alertObject} />
                    : null
                }
                {showAlert ?
                    <ErrorAlert 
                        type={this.type}
                        visiable={showAlert}
                        message={this.alertMsg}
                        hideModal={this.hideAutoModal}
                    />
                    : null
                }
            </View>
        );
    }

    //找不到订单的视图
    notFindOrder = () => {
        return (
            <View style={styles.centerView}>
                <Image source={require('../../images/order/no_order.png')} style={styles.centerImage} />
                <Text style={styles.centerText}>找不到该订单信息</Text>
            </View>
        )
    };

    //订单详情内容
    orderComponent = () => {
        let orders = this.state.orders;
        if(!orders) return null;
        let { navigation } = this.props;
        let sOrderInfo = orders.shopOrderAry || {};
        let tOrderInfo = orders.totalOrder || {};
        let expressInfo = orders.oExpress ? orders.oExpress : {};
        let expressData = expressInfo.showapi_res_body || {};
        let sid = sOrderInfo.sId || 0;
        let msg = sOrderInfo.oMessage || null;
        let orderID = sOrderInfo.soID || null;
        let orderNum = sOrderInfo.orderNum || null;
        let sName = sOrderInfo.sShopName || null;
        let totalNum = sOrderInfo.soNum || 0;
        let freight = parseFloat(sOrderInfo.oExpressMoney) || 0;
        let price = parseFloat(sOrderInfo.soPrice) || 0;
        let totalMoney = freight + price;
        let goods = sOrderInfo.oProAry || [];
        let payid = parseInt(sOrderInfo.oPay) || 0;
        let statuid = parseInt(sOrderInfo.oStatus) || 0;
        let addTime = sOrderInfo.oAddTime || null;
        let payTime = sOrderInfo.oPayTime || null;
        let fhTime = sOrderInfo.oExpressTime || null;
        let name = tOrderInfo.oBuyName || '';
        let phone = tOrderInfo.oBuyPhone || '';
        let area = tOrderInfo.oBuyArea || '';
        let address = tOrderInfo.oBuyAddress || '';
        let oIntegral = parseFloat(sOrderInfo.oIntegral) || 0;
        let oScoupon = parseFloat(sOrderInfo.oScoupon) || 0;
        this.titleBtns = this.getOrderBtns(payid, statuid, addTime, fhTime, expressData);
        this.actualTotal = (totalMoney - oIntegral - oScoupon).toFixed(2);
        if(this.actualTotal < 0) this.actualTotal = 0;
        return (
            <View>
                <View style={{marginTop: 10}}>
                    <View style={styles.bgboxStyle} />
                    <View style={styles.bgboxBody}>
                        <View style={styles.bgboxBodyTop}>
                            {this.titleBtns.image ?
                                <Image source={this.titleBtns.image} resizeMode="stretch" style={styles.topBoxLeftImg} />
                                : null
                            }
                            <View>
                                <View style={styles.rowStyle}>
                                    <Text style={styles.bgboxBodyTopText1}>
                                        {this.titleBtns.text1}
                                    </Text>
                                    {this.titleBtns.text2 ?
                                        <Text style={styles.bgboxBodyTopText2}>{this.titleBtns.text2}</Text>
                                        : null
                                    }
                                </View>
                                <Text style={[styles.grayFont, {marginTop: 10}]}>{'下单时间： ' + addTime}</Text>
                            </View>
                        </View>
                        <View style={styles.bgboxBodyBottom}>
                            <Text style={styles.grayFont}>{'订单号: ' + orderNum}</Text>
                            <TouchableOpacity style={styles.btnCopy} onPress={()=>{
                                Clipboard.setString(orderNum);
                                this.showToast('已复制');
                            }}>
                                <Text style={styles.btnCopyText}>复制</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.leftCircular} />
                        <View style={styles.rightCircular} />
                        <View style={styles.bottomCircular} />
                        <Image source={require('../../images/order/dotted.png')} resizeMode="stretch" style={styles.bgboxLineStyle} />
                    </View>
                    <Image source={require('../../images/order/gradient.png')} resizeMode="stretch" style={styles.bgboxBodyTopFloat} />
                </View>
                <View style={styles.sessionBox}>
                    <View style={styles.addressBody}>
                        <View style={styles.addressInfo}>
                            <Text style={styles.defaultFont}>{'收货人:' + name}</Text>
                            <Text style={[styles.defaultFont, {
                                marginLeft: 30,
                            }]}>{'电话：' + phone}</Text>
                        </View>
                        <Text style={styles.defaultFont}>{'地址：' + area}</Text>
                    </View>
                    {(msg && msg != '') ?
                        <View style={styles.memoBox}>
                            <Text style={styles.grayFont}>{'备注: ' + msg}</Text>
                        </View>
                        : null
                    }
                </View>
                <View style={styles.sessionBox}>
                    <View>
                        {goods.map((item, index)=>{
                            return <OrderGood onPress={()=>{
                                // navigation.navigate('Product', {gid: item.gID, })
                            }} good={item} key={index} />;
                        })}
                    </View>
                    {this.getPriceRow('商品总金额(不含运费)', price)}
                    {this.getPriceRow('运费', freight)}
                    {this.getPriceRow('优惠券', oScoupon, true, false)}
                    {this.getPriceRow('积分抵现', oIntegral, true, false)}
                    <View style={[styles.rowStyle2, {
                        justifyContent: 'flex-end',
                    }]}>
                        <Text style={styles.defaultFont}>
                            共
                            <Text style={styles.redColor}>{' ' + totalNum + ' '}</Text>
                            件商品, 合计：
                            <Text style={styles.redColor}>{' ¥' + this.actualTotal}</Text>
                        </Text>
                    </View>
                </View>
            </View>
        )
    };

    //价格清单行样式
    getPriceRow = (text, price, isPrice = true, isAdd = true) => {
        if(!price) return null;
        if(isPrice) {
            if(isAdd) {
                price = '¥'+ price;
            }else {
                price = '- ¥' + price;
            }
        }
        return (
            <View style={styles.rowStyle2}>
                <Text numberOfLines={1} style={styles.fontStyle1}>{text}</Text>
                <Text numberOfLines={1} style={[styles.fontStyle1, {
                    color: (isPrice && !isAdd) ? Color.redFontColor : (isPrice ? Color.mainFontColor : Color.grayFontColor),
                }]}>{price}</Text>
            </View>
        );
    };

    /**
     * 返回指定时长的过期时间
     * @param timeStr  string 开始计算时间
     * @param hour     number 几个小时之后
     */
    returnExpressTime = (timeStr, hour) => {
        let _date = '';
        if(timeStr && hour) {
            let time = hour * 60 * 60 * 1000;
            let ntime = new Date().getTime();
            let stime = new Date(timeStr.replace(/-/g, "/")).getTime();
            let _time = time + stime - ntime;
            if(_time > 0) {
                let etime = new Date(ntime + _time);
                let _day = etime.getDate();
                let _month = etime.getMonth() + 1;
                let _hour = etime.getHours();
                let _minute = etime.getMinutes();
                _date = _month + '月' + _day + '日' + _hour + ':' + _minute;
            }else {
                _date = null;
            }
        }
        return _date;
    };

    //未完成功能的提示
    notFinished = ()=> {
        this.showAutoModal('正功能正在调整中...');
    };

    /**
     * 获取订单标识符和操作按钮等信息
     * @param payid  number 付款状态
     * 注：0 未付款, 1 已付款, 2 已退款
     * @param status number 订单状态
     * 0 确认中, 1 已确认, 2 取消订单, 3 已发货, 4 收货成功, 5 收货失败, 6 申请退换货, 7 申请失败, 8 申请完成
     * @param addTime           string 订单生成时间
     * @param fhTime            string 发货时间
     * @param notExpressData    object 物流信息
     */
    getOrderBtns = (payid, _statuid, addTime, fhTime, expressData = {}) => {
        let { 
            navigation, 
            showCancel, 
            showAlert, 
            changeOrderStatu, 
            clickPay, 
        } = this.props;
        let that = this;
        let statuid = parseInt(_statuid) || 0;
        let expirationDate = '';
        let obj = {
            text1: '',
            text2: '',
            image: null,
            btns1: [],
            btns2: [{
                val: '联系境淘',
                bgColor: '#3E99E7',
                fun: ()=>{
                    that.showAlertMoudle(
                        '客服号码: 400-023-7333',
                        that.sellTelphone,
                        '呼叫'
                    );
                }
            }],
        };

        if(payid == 0) {
            //自动取消
            expirationDate = this.returnExpressTime(addTime, 23);
            if(expirationDate === null) statuid = 2;
        }else if(payid == 1 && statuid == 3) {
            //自动收货
            expirationDate = this.returnExpressTime(fhTime, (15 * 24 - 1));
            if(expirationDate === null) statuid = 4;
        }
        
        if(statuid == 2) {
            obj.text1 = '订单关闭';
            obj.text2 = '用户取消订单';
            obj.image = require('../../images/order/order_finish.png');
        }else if(payid == 1) {
            //已付款
            switch(statuid) {
                case 0:
                case 1:
                    //待发货
                    obj.text1 = '等待商家发货';
                    obj.text2 = '';
                    obj.btns2.push({
                        val: '立即发货',
                        bgColor: '#2989DB',
                        fun: ()=>{
                            let obj = Object.assign({backTo: 'OrderDetail'}, this.params);
                            navigation.navigate('LogisticsNumber', obj);
                        }
                    });
                    obj.image = require('../../images/order/payok_right.png');
                    break;
                case 3:
                case 5:
                    //待收货
                    obj.text1 = '等待用户收货';
                    obj.text2 = expirationDate ? expirationDate + '后自动确认收货' : '';
                    obj.btns2.push({
                        val: '查看物流',
                        bgColor: '#2989DB',
                        fun: ()=>{
                            let obj = Object.assign({
                                Logistics: expressData,
                                backTo: 'OrderDetail',
                            }, that.params);
                            navigation.navigate('OrderLogistics', obj);
                        }
                    });
                    obj.image = require('../../images/order/order_yfh.png');
                    break;
                case 4:
                    //交易完成
                    obj.text1 = '交易成功';
                    obj.image = require('../../images/order/order_finish.png');
                    break;
                case 6:
                    obj.text1 = '申请退换中';
                    break;
                case 7:
                    obj.text1 = '申请失败';
                    break;
                case 8:
                    obj.text1 = '申请成功';
                    break;
                default:
                    obj.text1 = '未知状态';
                    break;
            }
        }else if(payid == 2) {
            //已退款
            obj.text1 = '订单已退款';
        }else {
            //未付款
            obj.text1 = '等待用户付款';
            obj.text2 = expirationDate ? expirationDate + '后自动关闭' : '';
            obj.image = require('../../images/order/order_dfk.png');
        }
        return obj;
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    centerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerImage: {
        height: 110,
        width: 110,
    },
    centerText: {
        fontSize: 14,
        color: '#72A5F6',
        marginTop: 10,
    },
    sessionBox: {
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    rowStyle: {
        flexDirection : 'row',
        alignItems: 'center',
    },
    rowStyle2: {
        height: 50,
        marginLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: pixel,
        borderBottomColor: Color.borderColor,
    },
    fontStyle1: {
        fontSize: 13,
        color: Color.mainFontColor,
        lineHeight: 20,
    },
    fontStyle4: {
        fontSize: 13,
        color: '#fff',
    },
    btnStyle3: {
        width: 106,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalBox: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderTopColor: Color.borderColor,
        borderTopWidth: pixel,
        backgroundColor: '#fff',
    },
    defaultFont: {
        color: Color.mainFontColor,
        fontSize: 13,
        lineHeight: 20,
    },
    grayFont: {
        fontSize: 12,
        color: Color.grayFontColor,
        lineHeight: 20,
    },
    redColor: {
        color: Color.redFontColor,
        fontSize: 14,
    },
    bgboxStyle: {
        height: 20,
        borderWidth: 3,
        borderColor: '#85BDFF',
        backgroundColor: '#A0CCFF',
        borderRadius: 10,
    },
    bgboxBody: {
        height: 138,
        marginLeft: 8,
        marginRight: 8,
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    bgboxBodyTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topBoxLeftImg: {
        marginLeft: 20,
        width: 40,
        height: 40,
        marginRight: 20,
    },
    bgboxBodyTopText1: {
        fontSize: 14,
        color: Color.mainFontColor,
    },
    bgboxBodyTopText2: {
        fontSize: 11,
        color: Color.grayFontColor,
        marginLeft: 10,
    },
    bgboxBodyBottom: {
        flexDirection: 'row',
        paddingLeft: 20,
        marginTop: 15,
        alignItems: 'center',
        height: 35,
        backgroundColor: '#FBFBFB',
        marginLeft: 1,
        marginRight: 1,
    },
    btnCopy: {
        paddingVertical: 2,
        paddingHorizontal: 10,
        marginLeft: 20,
        borderColor: '#E7E7E7',
        borderWidth: 1,
    },
    btnCopyText: {
        fontSize: 12,
        color: Color.grayFontColor,
    },
    leftCircular: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: 'absolute',
        backgroundColor: '#eee',
        left: -6,
        top: 6,
    },
    rightCircular: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: 'absolute',
        backgroundColor: '#eee',
        right: -6,
        top: 6,
    },
    bgboxLineStyle: {
        position: 'absolute',
        width: Size.width - 36,
        height: 1,
        left: 10,
        top: 12,
        tintColor: '#ddd',
    },
    bottomCircular: {
        width: 20,
        height: 20,
        borderRadius: 10,
        position: 'absolute',
        backgroundColor: '#eee',
        bottom: -10,
        left: Size.width / 2 - 10,
    },
    bgboxBodyTopFloat: {
        position: 'absolute',
        left: 8,
        top: 8,
        width: Size.width - 16,
        height: 20,
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    addressBody: {
        marginLeft: 15,
        padding: 8,
        paddingLeft: 0,
    },
    addressInfo: {
        flexDirection : 'row',
        marginBottom: 4,
    },
    memoBox: {
        padding: 8,
        paddingLeft: 0,
        marginLeft: 15,
        borderTopColor: '#E7E7E7',
        borderTopWidth: 1,
    },
});