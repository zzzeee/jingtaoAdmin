/**
 * 订单框架
 * @auther linzeyong
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import PropTypes from 'prop-types';
import Utils from '../public/utils';
import Urls from '../public/adminApiUrl';
import { Size, pixel, } from '../public/globalStyle';
import { Color } from '../public/theme';
import Lang, {str_replace} from '../public/language';
import OrderItem from './OrderItem';
import { EndView } from '../other/publicEment';
import ErrorAlert from '../other/ErrorAlert';
import AlertMoudle from '../other/AlertMoudle';

export default class OrderComponent extends Component {
    // 默认参数
    static defaultProps = {
        orderType: null,
        get_list_ref: (ref)=>{},
    };
    // 参数类型
    static propTypes = {
        mToken: PropTypes.string.isRequired,
        orderType: PropTypes.number,
        get_list_ref: PropTypes.func,
        selectIndex: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            orders: null,
            load_or_error: null,
            showAlert: false,
            deleteAlert: false,
            showPayModal: false,
            isRefreshing: true,
        };
        this.page = 1;
        this.pageNumber = 10;
        this.loadMoreLock = false;
        this.orderID = null;
        this.type = 1;
        this.alertMsg = '';
        this.alertObject = {};
        this.payMoney = 0;
    }

    componentDidMount() {
        this.loadOrderList();
    }

    //加载订单列表
    loadOrderList = (isHideLoad = true, isConcat = true) => {
        let { mToken, orderType, navigation, selectIndex } = this.props;
        if(mToken && !this.loadMoreLock) {
            this.loadMoreLock = true;
            Utils.fetch(Urls.getOrderList, 'post', {
                sToken: mToken,
                oStatus: orderType ? orderType : '',
                soPage: this.page,
                soPerNum: this.pageNumber,
            }, (result)=>{
                console.log(result);
                let obj = {
                    isRefreshing: false,
                    load_or_error: false,
                };
                if(result && result.sTatus == 4) {
                    navigation.navigate('Login', {
                        backTo: 'Order',
                        backObj: {selectIndex: selectIndex},
                    });
                    return;
                }else if(result && result.sTatus == 1 && result.orderAry) {
                    let newOrders = result.orderAry || [];
                    let oldOrders = this.state.orders;
                    if(newOrders.length) {
                        this.page++;
                        this.loadMoreLock = false;
                        obj.orders = (oldOrders && isConcat) ? oldOrders.concat(newOrders) : newOrders;
                    }
                }
                this.setState(obj);
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

    //刷新页面
    refreshList = (_type, _msg) => {
        this.page = 1;
        this.loadMoreLock = false;
        this.alertMsg = _msg;
        this.type = _type;
        this.setState({
            deleteAlert: false,
            showAlert: true,
        }, ()=>this.loadOrderList(true, false));
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
    showAlertMoudle = (msg, rclick, rText = null) => {
        this.alertObject = {
            text: msg,
            leftText: Lang[Lang.default].cancel,
            rightText: rText || Lang[Lang.default].determine,
            leftClick: ()=>this.setState({deleteAlert: false,}),
            rightClick: rclick,
            leftColor: Color.mainFontColor,
            leftBgColor: '#fff',
            rightColor: Color.mainFontColor,
            rightBgColor: '#fff',
        };
        this.setState({deleteAlert: true,});
    };

    //点击立即支付
    clickPay = (soid, money) => {
        if(soid) {
            this.orderID = soid;
            this.payMoney = money;
            this.setState({showPayModal: true, });
        }
    };

    //隐藏支付框
    hidePaymentBox = (func = null) => {
        this.setState({ 
            showPayModal: false,
        }, ()=>{
            if(func) func();
        });
    };

    /**
     * 更改订单状态
     * @param soid  number 订单号
     * @param statu number 订单状态 2 取消订单, 4 确认收货
     * @param successMsg string 操作成功后的提示信息
     * @param param object 附加数据
     * @param money float  支付金额
     */
    changeOrderStatu = (soid, statu, successMsg, param = null, money = null) => {
        let { mToken, navigation, } = this.props;
        if(soid && mToken) {
            let obj = Object.assign({
                mToken: mToken,
                oStatus: statu,
                orderNum: soid,
            }, param);
            Utils.fetch(Urls.updateOrderStatu, 'post', obj, (result)=>{
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
                                pageType: 2,
                                mToken: mToken,
                                payMoney: money,
                                shopOrderNum: soid,
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
    }

    render() {
        let { 
            navigation, 
            get_list_ref, 
            getListEment, 
            notingString,
            mToken,
        } = this.props;
        let { 
            load_or_error, 
            orders,
            showAlert, 
            deleteAlert, 
            showPayModal,
            isRefreshing,
        } = this.state;
        return (
            <View style={styles.flex}>
                {load_or_error ?
                    load_or_error :
                    <View style={styles.flex}>
                        <FlatList
                            ref={get_list_ref}
                            data={orders}
                            keyExtractor={(item, index)=>(index)}
                            renderItem={this._renderItem}
                            refreshing={isRefreshing}
                            onRefresh={()=>{
                                this.page = 1;
                                this.loadMoreLock = false;
                                this.setState({
                                    isRefreshing: true,
                                    orders: null,
                                }, this.loadOrderList);
                            }}
                            onEndReached={()=>this.loadOrderList(true)}
                            ListFooterComponent={()=>{
                                if(orders && orders.length > 1) {
                                    return <EndView />;
                                }else {
                                    return <View />;
                                }
                            }}
                            ListHeaderComponent={()=>{
                                if(orders && orders.length) return null;
                                else {
                                    return (
                                        <View style={styles.centerStyle}>
                                            <Image source={require('../../images/order/no_order.png')} style={styles.centerImage} />
                                            <Text numberOfLines={1} style={styles.centerText}>这里没有订单</Text>
                                        </View>
                                    );
                                }
                            }}
                        />
                        {showAlert ?
                            <ErrorAlert 
                                type={this.type}
                                visiable={showAlert}
                                message={this.alertMsg}
                                hideModal={this.hideAutoModal}
                            />
                            : null
                        }
                        {deleteAlert ?
                            <AlertMoudle visiable={deleteAlert} {...this.alertObject} />
                            : null
                        }
                    </View>
                }
            </View>
        );
    }

    _renderItem = ({item, index}) => {
        let { mToken, navigation, selectIndex, } = this.props;
        return (
            <OrderItem
                mToken={mToken}
                navigation={navigation}
                orderInfo={item}
                showAlert={this.showAlertMoudle}
                showWarnMsg={this.showAutoModal}
                changeOrderStatu={this.changeOrderStatu}
                clickPay={this.clickPay}
                selectIndex={selectIndex}
            />
        )
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    centerStyle: {
        height: Size.height - 20 - 50 - 50 -10,
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
});