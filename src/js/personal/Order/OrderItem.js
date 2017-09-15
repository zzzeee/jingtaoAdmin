/**
 * 订单框架
 * @auther linzeyong
 * @date   2017.06.23
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
} from 'react-native';

import PropTypes from 'prop-types';
import Utils from '../../public/utils';
import Urls from '../../public/apiUrl';
import { Size, PX, pixel, Color } from '../../public/globalStyle';
import Lang, {str_replace} from '../../public/language';
import Nothing from '../../other/ListNothing';
import OrderGood from '../../car/OrderGood';

export default class OrderComponent extends Component {
    // 默认参数
    static defaultProps = {
        orderType: null,
    };
    // 参数类型
    static propTypes = {
        mToken: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            isDelete: false,
        };
        this.expressNum = null;
    }

    render() {
        let { 
            mToken, 
            navigation, 
            orderInfo, 
            selectIndex,
        } = this.props;
        if(!orderInfo || this.state.isDelete) return null;
        let sid = orderInfo.sId || 0;
        let orderID = orderInfo.soID || null;
        let sName = orderInfo.sShopName || null;
        let totalNum = orderInfo.soNum || 0;
        let orderNum = orderInfo.orderNum || null;
        let freight = parseFloat(orderInfo.oExpressMoney) || 0;
        let price = parseFloat(orderInfo.soPrice) || 0;
        let oIntegral = parseFloat(orderInfo.oIntegral) || 0;
        let oScoupon = parseFloat(orderInfo.oScoupon) || 0;
        this.totalMoney = (freight + price - oIntegral - oScoupon).toFixed(2);
        if(this.totalMoney < 0) this.totalMoney = 0;
        let goods = orderInfo.oProduct || [];
        this.expressNum = orderInfo.oExpressNum || null;
        let payid = parseInt(orderInfo.oPay) || 0;
        let statuid = parseInt(orderInfo.oStatus) || 0;
        let addTime = orderInfo.oAddTime || null;
        let payTime = orderInfo.oPayTime || null;
        let orderTitleBtns = this.getOrderBtns(payid, statuid, addTime, payTime);
        return (
            <View style={styles.boxStyle}>
                <View style={styles.rowStyle1}>
                    <TouchableOpacity onPress={()=>navigation.navigate('Shop', {shopID: sid})} style={{
                        padding: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Image source={require('../../../images/car/shophead.png')} style={{
                            width: 26,
                            height: 26,
                        }} />
                        <Text style={{
                            color: Color.lightBack,
                            fontSize: 14,
                        }}>{sName}</Text>
                    </TouchableOpacity>
                    <Text style={styles.fontStyle3}>{orderTitleBtns.text}</Text>
                </View>
                <View>
                    {goods.map((item, index)=>{
                        return <OrderGood good={item} onPress={()=>{
                            navigation.navigate('OrderDetail', {
                                mToken: mToken,
                                orderNum: orderNum,
                                shopID: sid,
                                shopOrderNum: orderID,
                                selectIndex: selectIndex,
                            });
                        }} key={index} />;
                    })}
                </View>
                <View style={styles.rowStyle2}>
                    <Text style={[styles.fontStyle1, {
                        marginRight: 15,
                    }]}>{str_replace(Lang[Lang.default].totalProductNumberL, totalNum)}</Text>
                    <Text style={styles.fontStyle1}>
                        {Lang[Lang.default].total2 + ': '}
                        <Text style={styles.fontStyle2}>{Lang[Lang.default].RMB + this.totalMoney}</Text>
                        {str_replace(Lang[Lang.default].containPostage, freight)}
                    </Text>
                </View>
                <View style={styles.rowStyle2}>
                    {orderTitleBtns.btns.map((item, index)=>{
                        return (
                            <TouchableOpacity key={index} onPress={()=>{
                                if(item.fun) {
                                    item.fun(orderID);
                                }else {
                                    this.notFinished();
                                }
                            }} style={[styles.btnStyle, {
                                borderColor: item.red ? Color.mainColor : Color.lightBack,
                            }]}>
                                <Text style={{
                                    fontSize: 11,
                                    color: item.red ? Color.mainColor : Color.lightBack,
                                }}>{item.val}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    }

    //联系客服/商家
    sellTelphone = () => {
        Linking.openURL('tel: ' + Lang.telephone)
        .catch(err => console.error('调用电话失败！', err));
    };

    //未完成功能的提示
    notFinished = ()=> {
        this.props.showWarnMsg('正功能正在调整中...');
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

    /**
     * 获取订单标识符和操作按钮等信息
     * @param payid  number 付款状态
     * 注：0 未付款, 1 已付款, 2 已退款
     * @param status number 订单状态
     * 0 确认中, 1 已确认, 2 取消订单, 3 已发货, 4 收货成功, 5 收货失败, 6 申请退换货, 7 申请失败, 8 申请完成
     * @param addTime string 订单生成时间
     * @param fhTime  string 发货时间
     */
    getOrderBtns = (payid, _statuid, addTime, fhTime) => {
        let { 
            mToken, 
            navigation, 
            showCancel, 
            showAlert, 
            changeOrderStatu, 
            clickPay,
            showWarnMsg,
        } = this.props;
        let that = this;
        let statuid = parseInt(_statuid) || 0;
        let expirationDate = '';
        let obj = {
            text: '',
            btns: [{
                val: Lang[Lang.default].contactWaiter,
                red: false,
                fun: (soid)=>{
                    showAlert(
                        Lang.telephone2,
                        that.sellTelphone,
                        Lang[Lang.default].call
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
            obj.text = Lang[Lang.default].shopClose;
        }else if(payid == 1) {
            //已付款
            switch(statuid) {
                case 0:
                case 1:
                    //待发货
                    obj.btns.push({
                        val: Lang[Lang.default].applyReturn,
                        red: false,
                    });
                    obj.text = Lang[Lang.default].daifahuo;
                    break;
                case 3:
                case 5:
                    //待收货
                    obj.btns.push({
                        val: Lang[Lang.default].applyReturn,
                        red: false,
                    }, {
                        val: Lang[Lang.default].viewLogistics,
                        red: false,
                        fun: ()=>{
                            navigation.navigate('OrderLogistics', {
                                mToken: mToken,
                                expressNum: that.expressNum,
                            });
                        },
                    }, {
                        val: Lang[Lang.default].confirmReceipt,
                        red: true,
                        fun: (soid)=>{
                            showAlert(
                                Lang[Lang.default].confirmReceipt2,
                                ()=>{changeOrderStatu(
                                    soid, 
                                    4, 
                                    Lang[Lang.default].successfulReceipt, 
                                    null, 
                                    that.totalMoney
                                )}
                            );
                        }
                    });
                    obj.text = Lang[Lang.default].daishouhuo;
                    break;
                case 4:
                    //交易完成
                    obj.btns.push({
                        val: Lang[Lang.default].applySellAfter,
                        red: false,
                    });
                    obj.text = Lang[Lang.default].transactionOk;
                    break;
                case 6:
                    obj.text = Lang[Lang.default].applyReturning;
                    break;
                case 7:
                    obj.text = Lang[Lang.default].applyFail;
                    break;
                case 8:
                    obj.text = Lang[Lang.default].applySuccess;
                    break;
                default:
                    obj.text = Lang[Lang.default].cnknownState;
                    break;
            }
        }else if(payid == 2) {
            //已退款
            obj.text = Lang[Lang.default].isTuiKuan;
        }else {
            //未付款
            obj.text = Lang[Lang.default].noFuKuan;
            obj.btns.push({
                val: Lang[Lang.default].cancelOrder,
                red: false,
                fun: showCancel,
            }, {
                val: Lang[Lang.default].immediatePayment,
                red: true,
                fun: (soid)=>clickPay(soid, that.totalMoney),
            });
        }
        return obj;
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    boxStyle: {
        backgroundColor: '#fff',
        marginTop: PX.marginTB,
    },
    rowStyle1: {
        height: PX.rowHeight2,
        paddingLeft: 10,
        paddingRight: PX.marginLR,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowStyle2: {
        height: PX.rowHeight1,
        marginLeft: PX.marginLR,
        marginRight: PX.marginLR,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
    },
    fontStyle1: {
        fontSize: 13,
        color: Color.lightBack,
    },
    fontStyle2: {
        fontSize: 14,
        color: Color.red,
    },
    fontStyle3: {
        fontSize: 12,
        color: Color.mainColor,
    },
    btnStyle: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 27,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        marginLeft: 15,
    },
});