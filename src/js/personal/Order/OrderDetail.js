/**
 * 个人中心 - 我的订单 - 订单详情
 * @auther linzeyong
 * @date   2017.06.27
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

import Utils from '../../public/utils';
import Urls from '../../public/apiUrl';
import { Size, PX, pixel, Color } from '../../public/globalStyle';
import Lang, {str_replace} from '../../public/language';
import ListFrame from '../../other/ListViewFrame';
import OrderGood from '../../car/OrderGood';
import PayOrder from '../../car/PayOrder';
import AppHead from '../../public/AppHead';
import OrderCancel from './OrderCancel';
import ErrorAlert from '../../other/ErrorAlert';
import AlertMoudle from '../../other/AlertMoudle';

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
        };
        this.mToken = null;
        this.orderNum = null;
        this.shopID = null;
        this.shopOrderNum = null;
        this.selectIndex = 0;
        this.ref_flatList = null;
        this.type = 1;
        this.alertMsg = '';
        this.isRefresh = false;   // 返回时是否刷新列表页
        this.actualTotal = 0;
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
            let params = navigation.state.params;
            let { mToken, shopOrderNum, selectIndex, isRefresh, } = params;
            this.mToken = mToken || null;
            this.shopOrderNum = shopOrderNum || null;
            this.selectIndex = selectIndex || 0;
            this.isRefresh = isRefresh || false;
        }
    };

    //获取订单信息
    getOrderInfo = () => {
        if(this.mToken && this.shopOrderNum) {
            Utils.fetch(Urls.getOrderDetails, 'post', {
                mToken: this.mToken,
                soID: this.shopOrderNum,
            }, (result)=>{
                console.log(result);
                if(result && result.sTatus == 1) {
                    this.setState({
                        orders: result.oAry,
                        load_or_error: null,
                    });
                }
            }, (view)=>{
                this.setState({
                    load_or_error: view,
                });
            }, {
                loadType: 2,
            });
        }
    };

    //显示取消订单
    showCancelWindow = () => {
        this.setState({showCancelBox: true, });
    };

    //隐藏取消订单
    hideCancelWindow = () => {
        this.setState({showCancelBox: false, });
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
            leftText: Lang[Lang.default].cancel,
            rightText: rText || Lang[Lang.default].determine,
            leftClick: ()=>this.setState({deleteAlert: false,}),
            rightClick: func,
            leftColor: Color.lightBack,
            leftBgColor: '#fff',
            rightColor: Color.lightBack,
            rightBgColor: '#fff',
        };
        this.setState({deleteAlert: true,});
    };

    //点击确认收货
    goodsReceipt = () => {
        let { navigation } = this.props;
        if(this.shopOrderNum && this.mToken) {
            Utils.fetch(Urls.updateOrderStatu, 'post', {
                mToken: this.mToken,
                oStatus: 4,
                orderNum: this.shopOrderNum,
            }, (result)=>{
                console.log(result);
                if(result) {
                    let type = 1;
                    let msg = result.sMessage || null;
                    let ret = result.sTatus || 0;
                    if(ret == 1) {
                        this.setState({
                            deleteAlert: false,
                        }, ()=>{
                            navigation.navigate('OrderNotify', {
                                mToken: this.mToken,
                                shopOrderNum: this.shopOrderNum,
                                pageType: 2,
                            });
                        });
                    }else {
                        this.alertMsg = msg;
                        this.type = type;
                        this.setState({
                            deleteAlert: false,
                            showAlert: true,
                        });
                    }
                }
            });
        }
    };

    //联系客服/商家
    sellTelphone = () => {
        this.setState({deleteAlert: false,}, ()=>{
            Linking.openURL('tel: ' + Lang.telephone)
            .catch(err => console.error('调用电话失败！', err));
        });
    };

    //取消订单事件
    cancelCallback = (type, msg) => {
        this.alertMsg = msg;
        this.type = type;
        this.isRefresh = true;
        this.setState({
            showCancelBox: false,
            deleteAlert: false,
            showAlert: true,
            orders: null,
        }, this.getOrderInfo);
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
                    title={Lang[Lang.default].orderDetail}
                    goBack={true}
                    leftPress={()=>{
                        if(this.isRefresh) {
                            navigation.navigate('MyOrder', {
                                mToken: this.mToken,
                                index: this.selectIndex,
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
                <View style={styles.flex}>
                    {load_or_error ?
                        load_or_error :
                        (orders ?
                            <ListFrame
                                listHead={this.orderComponent()}
                                navigation={navigation}
                                get_list_ref={(ref)=>this.ref_flatList=ref}
                            />
                            : null
                        )
                    }
                </View>
                {this.titleBtns ?
                    <View style={styles.footBox}>
                        <TouchableOpacity onPress={()=>{
                            this.showAlertMoudle(
                                Lang.telephone2,
                                this.sellTelphone,
                                Lang[Lang.default].call
                            );
                        }} style={styles.btnStyle2}>
                            <Image style={styles.custemIcon} source={require('../../../images/product/custem_center.png')} />
                            <Text style={styles.fontStyle3}>客服</Text>
                        </TouchableOpacity>
                        {this.titleBtns.btns2.length ?
                            <View style={styles.footBoxRight}>
                                {this.titleBtns.btns2.map((item, index)=>{
                                    return (
                                        <TouchableOpacity key={index} style={[styles.btnStyle3, {
                                            backgroundColor: item.bgColor,
                                        }]} onPress={item.fun}>
                                            <Text style={styles.fontStyle4}>{item.val}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            : null
                        }
                    </View>
                    : null
                }
                {showCancelBox ?
                    <OrderCancel
                        isShow={showCancelBox}
                        mToken={this.mToken}
                        orderID={this.shopOrderNum}
                        hideWindow={this.hideCancelWindow}
                        cancelCallback={this.cancelCallback}
                    />
                    : null
                }
                {showPayModal?
                    <PayOrder
                        mToken={this.mToken}
                        payMoney={this.actualTotal}
                        orderNumber={this.shopOrderNum}
                        visible={showPayModal}
                        hidePayBox={this.hidePaymentBox}
                        navigation={navigation}
                    />
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

    //隐藏支付框
    hidePaymentBox = (func = null) => {
        this.setState({ 
            showPayModal: false,
        }, ()=>{
            if(func) func();
        });
    };

    orderComponent = () => {
        let orders = this.state.orders;
        if(!orders) return null;
        let { navigation } = this.props;
        let sOrderInfo = orders.shopOrderAry || {};
        let tOrderInfo = orders.totalOrder || {};
        let expressInfo = orders.oExpress ? orders.oExpress : {};
        let expressData = expressInfo.showapi_res_body || {};
        let sid = sOrderInfo.sId || 0;
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
            <View style={styles.container}>
                <View style={styles.sessionBox}>
                    <View style={styles.grayBox}>
                        <Image 
                            source={require('../../../images/car/payok_bg.jpg')} 
                            resizeMode="stretch" 
                            style={styles.topBoxC1Img}
                        >
                            <View style={styles.topBoxC1ImgLeft}>
                                <Text style={styles.topBoxC1Text1}>{this.titleBtns.text1}</Text>
                                {this.titleBtns.text2 ?
                                    <Text style={styles.topBoxC1Text2}>{this.titleBtns.text2}</Text>
                                    : null
                                }
                            </View>
                            {this.titleBtns.image ?
                                <Image source={this.titleBtns.image} resizeMode="stretch" style={styles.topBoxC1ImgRight} />
                                : null
                            }
                        </Image>
                    </View>
                    {expressData.data && expressData.data[0] ?
                        <TouchableOpacity style={styles.expressDataBox} onPress={()=>{
                            navigation.navigate('OrderLogistics', {
                                Logistics: expressData,
                            });
                        }}>
                            <View style={{width: Size.width - 30 - 26 - 10}}>
                                <Text numberOfLines={2} style={styles.fontStyle5}>{expressData.data[0].context || ''}</Text>
                                <Text numberOfLines={1} style={[styles.fontStyle6, {
                                    paddingTop: 10,
                                }]}>{expressData.data[0].time || ''}</Text>
                            </View>
                            <View style={styles.moreIcon}>
                                <Image source={require('../../../images/list_more.png')} style={styles.moreIcon} />
                            </View>
                        </TouchableOpacity> :
                        (statuid == 3 ?
                            <View style={styles.rowStyle3}>
                                <Text style={styles.fontStyle5}>暂无物流信息</Text>
                            </View>
                            : null
                        )  
                    }
                    <View style={styles.addressBox}>
                        <View style={styles.rowStyle}>
                            <Text style={[styles.fontStyle1, {paddingRight: 20}]}>{Lang[Lang.default].consignee + ': ' + name}</Text>
                            <Text style={styles.fontStyle1}>{Lang[Lang.default].iphone + ': ' + phone}</Text>
                        </View>
                        <View>
                            <Text numberOfLines={2} style={styles.fontStyle1}>{Lang[Lang.default].address + ': ' + area + address}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.sessionBox}>
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
                    </View>
                    <View>
                        {goods.map((item, index)=>{
                            return <OrderGood onPress={()=>{
                                navigation.navigate('Product', {gid: item.gID, })
                            }} good={item} key={index} />;
                        })}
                    </View>
                    {this.getPriceRow('商品总金额(不含运费)', price)}
                    {this.getPriceRow('运费', freight)}
                    {this.getPriceRow('优惠券', oScoupon, true, false)}
                    {this.getPriceRow('积分抵现', oIntegral, true, false)}
                    <View style={styles.totalBox}>
                        <Text style={styles.totalNumber}>{str_replace(Lang[Lang.default].totalProductNumberL, totalNum)}</Text>
                        <Text style={styles.defaultFont}>
                            <Text>{Lang[Lang.default].total2 + ' '}</Text>
                            <Text style={styles.redColor}>{Lang[Lang.default].RMB + this.actualTotal}</Text>
                        </Text>
                    </View>
                </View>
                <View style={styles.sessionBox}>
                    {this.getPriceRow('订单号码', orderNum, false)}
                    {this.getPriceRow('下单时间', addTime, false)}
                    {this.getPriceRow('付款时间', payTime, false)}
                    {this.titleBtns.btns1 && this.titleBtns.btns1.length ?
                        <View style={[styles.rowStyle2, {justifyContent: 'center', }]}>
                            {this.titleBtns.btns1.map((item, index)=>{
                                return (
                                    <TouchableOpacity key={index} style={styles.btnStyle} onPress={()=>{
                                        if(item.fun) {
                                            item.fun();
                                        }else {
                                            this.notFinished();
                                        }
                                    }}>
                                        <Text style={styles.fontStyle2}>{item.val}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        : null
                    }
                </View>
            </View>
        )
    };

    //价格清单行样式
    getPriceRow = (text, price, isPrice = true, isAdd = true) => {
        if(!price) return null;
        if(isPrice) {
            if(isAdd) {
                price = Lang[Lang.default].RMB + price;
            }else {
                price = '-' + Lang[Lang.default].RMB + price;
            }
        }
        return (
            <View style={styles.rowStyle2}>
                <Text numberOfLines={1} style={styles.fontStyle1}>{text}</Text>
                <Text numberOfLines={1} style={[styles.fontStyle1, {
                    color: (isPrice && !isAdd) ? Color.mainColor : (isPrice ? Color.lightBack : Color.gainsboro),
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
            btns2: [],
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
            obj.text2 = '订单已取消';
            obj.image = require('../../../images/car/order_close.png');
        }else if(payid == 1) {
            //已付款
            switch(statuid) {
                case 0:
                case 1:
                    //待发货
                    obj.text1 = '付款成功';
                    obj.text2 = '您的宝贝马上就要出仓了';
                    obj.btns1.push({
                        val: '申请退换',
                    });
                    obj.image = require('../../../images/car/payok_right.png');
                    break;
                case 3:
                case 5:
                    //待收货
                    obj.text1 = '商品已发货';
                    obj.text2 = expirationDate + '后将自动确认收货';
                    obj.btns1.push({
                        val: '申请退换',
                    });
                    obj.btns2.push({
                        val: '查看物流',
                        bgColor: Color.orange,
                        fun: ()=>{
                            navigation.navigate('OrderLogistics', {
                                Logistics: expressData,
                            });
                        }
                    });
                    obj.btns2.push({
                        val: '确认收货',
                        bgColor: Color.mainColor,
                        fun: ()=>{
                            that.showAlertMoudle(Lang[Lang.default].confirmReceipt2, that.goodsReceipt);
                        },
                    });
                    obj.image = require('../../../images/car/order_yfh.png');
                    break;
                case 4:
                    //交易完成
                    obj.text1 = '交易成功';
                    obj.btns1.push({
                        val: '申请售后',
                    });
                    obj.image = require('../../../images/car/order_finish.png');
                    break;
                case 6:
                    obj.text1 = Lang[Lang.default].applyReturning;
                    break;
                case 7:
                    obj.text1 = Lang[Lang.default].applyFail;
                    break;
                case 8:
                    obj.text1 = Lang[Lang.default].applySuccess;
                    break;
                default:
                    obj.text1 = Lang[Lang.default].cnknownState;
                    break;
            }
        }else if(payid == 2) {
            //已退款
            obj.text1 = '订单' + Lang[Lang.default].isTuiKuan;
        }else {
            //未付款
            obj.text1 = '您还未付款';
            obj.text2 = '订单将在' + expirationDate + '后自动关闭';
            obj.btns2.push({
                val: '取消订单',
                bgColor: Color.orange,
                fun: that.showCancelWindow,
            });
            obj.btns2.push({
                val: '立即付款',
                bgColor: Color.mainColor,
                fun: ()=>that.setState({showPayModal: true,}),
            });
            obj.image = require('../../../images/car/order_dfk.png');
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
        marginTop: PX.marginTB,
    },
    sessionBox: {
        marginBottom: PX.marginTB,
        backgroundColor: '#fff',
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
        paddingRight: PX.marginLR,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
    },
    rowStyle3: {
        height: PX.rowHeight2,
        justifyContent: 'center',
        paddingLeft: PX.marginLR,
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
    },
    fontStyle1: {
        fontSize: 13,
        color: Color.lightBack,
        lineHeight: 20,
    },
    fontStyle2: {
        fontSize: 12,
        color: Color.mainColor,
    },
    fontStyle3: {
        fontSize: 10,
        color: Color.lightBack,
    },
    fontStyle4: {
        fontSize: 14,
        color: '#fff',
    },
    fontStyle5: {
        fontSize: 14,
        color: Color.lightBack,
        lineHeight: 20,
    },
    fontStyle6: {
        fontSize: 12,
        color: Color.gainsboro,
    },
    btnStyle: {
        paddingLeft: 38,
        paddingRight: 38,
        height: 27,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: Color.mainColor,
        marginLeft: 5,
        marginRight: 5,
    },
    btnStyle2: {
        justifyContent: 'center',
        alignItems: 'center',
        height: PX.rowHeight1,
        marginLeft: PX.marginLR,
    },
    btnStyle3: {
        width: 90,
        height: PX.rowHeight1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalBox: {
        height: PX.rowHeight1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
    },
    totalNumber: {
        color: Color.lightBack,
        fontSize: 13,
        paddingRight: 30,
    },
    defaultFont: {
        color: Color.lightBack,
        fontSize: 13,
    },
    redColor: {
        color: Color.red,
        fontSize: 14,
    },
    grayBox: {
        backgroundColor: Color.lightGrey,
    },
    topBoxC1Img: {
        width: Size.width,
        height: 120,
        flexDirection : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topBoxC1ImgLeft: {
        paddingLeft: 20,
        maxWidth: Size.width - 20 - 20 - 115,
        backgroundColor: 'transparent',
    },
    topBoxC1Text1: {
        fontSize: 20,
        color: '#fff',
    },
    topBoxC1Text2: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, .7)',
        paddingTop: 6,
    },
    topBoxC1ImgRight: {
        width: 115,
        height: 86,
        marginRight: 20,
    },
    expressDataBox: {
        flexDirection : 'row',
        minHeight: 65,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        paddingTop: 10,
        paddingBottom: 5,
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    moreIcon: {
        width: PX.iconSize26,
        height: PX.iconSize26,
    },
    addressBox: {
        minHeight: 65,
        marginLeft: PX.marginLR,
        marginRight: PX.marginLR,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: pixel,
        borderBottomColor: Color.floralWhite,
    },
    rowStyle: {
        flexDirection : 'row',
        alignItems: 'center',
    },
    footBox: {
        height: PX.rowHeight1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: pixel,
        borderTopColor: Color.lavender,
        backgroundColor: '#fff',
    },
    custemIcon: {
        width: 32,
        height: 32,
    },
    footBoxRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});