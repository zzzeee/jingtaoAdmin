/**
 * 优惠券模块
 * @auther linzeyong
 * @date   2017.05.27
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import Utils from '../public/utils';
import Urls from '../public/apiUrl';
import { Size, pixel, Color, PX, errorStyles } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class CouponItem extends Component {
    // 默认参数
    static defaultProps = {
        canReceive: true,
        clearOverImg: false,
    };
    // 参数类型
    static propTypes = {
        type: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        coupon: PropTypes.object.isRequired,
        canReceive: PropTypes.bool,
        clearOverImg: PropTypes.bool,
    };
    constructor(props) {
        super(props);
        this.state = {
            receive: false,
        };
    }

    componentWillMount() {
        let { coupon, canReceive } = this.props;
        if(coupon && canReceive) {
            let id = coupon.hID || coupon.hId;
            let isReceive = this.isReceiveCoupon(id);
            this.setState({
                receive: isReceive,
            });
        }
    }
    //检查时间是否带有时分秒
    checkTimeString = (t) => {
        if(t) {
            let str = t.replace(/-/g, "/") || '';
            if(str && str.length <= 10 && str.indexOf(':') < 0) {
                str = str + ' 00:00:00';
            }
            return str
        }
        return t;
    };

    //点击领取优惠券
    clickCoupon = (id) => {
        let that = this;
        let { userid, callback, back, backObj, navigation, hideCouponBox, canReceive } = this.props;
        if(userid && canReceive) {
            if(id && id > 0 && !this.state.receive) {
                Utils.fetch(Urls.userGiveCoupon, 'POST', {
                    hID: id,
                    mToken: userid,
                }, (result) => {
                    console.log(result);
                    if(result) {
                        let ret = result.sTatus || 0;
                        let msg = result.sMessage || null;
                        if(ret == 1 || ret == 5) {
                            //领取成功、已领取
                            that.setState({
                                receive: true,
                            }, () => {
                                callback && callback(id);
                            });
                        }else if(ret == 4) {
                            //token验证失败
                            if(navigation) {
                                navigation.navigate('Login', {back: back, backObj: backObj,});
                            }
                        }else if(msg) {
                            alert(msg);
                        }
                    }
                }, null, {
                    catchFunc: (err) => {
                        console.log('获取数据出错');
                        console.log(err);
                        alert(Lang[Lang.default].serverError);
                    },
                });
            }
        }else {
            hideCouponBox && hideCouponBox();
            if(navigation) {
                navigation.navigate('Login', {back: back, backObj: backObj,});
            }
        }
    };

    //判断优惠券是否被领取
    isReceiveCoupon = (id) => {
        let { userCoupons, type, } = this.props;
        let isok = true;
        let _id = parseInt(id) || 0;
        let list = userCoupons || [];
        if(type == 3) {
            if(userCoupons && userCoupons == _id) return true;
        } else if(_id > 0 && list && list.length) {
            for(let i in list) {
                if(_id == list[i]) {
                    isok = false;
                    break;
                }
            }
        }
        return !isok;
    };

    render() {
        let { 
            type, 
            width, 
            style, 
            coupon, 
            clickCoupon, 
            backgroundColor, 
            canReceive, 
            callback,
            clearOverImg,
         } = this.props;
        if(!coupon || !type) return null;
        let leftRatio = 0.345; // 优惠券左边比率
        let id = coupon.hID || coupon.hId;
        let sid = coupon.sId || 0;
        let stime = coupon.hStartTime || null;
        let etime = coupon.hSendTime || null;
        let ntime = new Date().getTime();
        let isable = coupon.isable || 0;
        let money = parseFloat(coupon.hMoney) || null;
        let maxMoney = parseFloat(coupon.hUseMoney) || null;
        stime = this.checkTimeString(stime);
        etime = this.checkTimeString(etime);
        let _stime = new Date(stime).getTime();
        let _etime = new Date(etime).getTime();
        let color = sid > 0 ? Color.orange : Color.mainColor;
        let sname = sid > 0 ? Lang[Lang.default].shopCurrency : Lang[Lang.default].appCurrency;
        let hname = coupon.hName || null;
        let isUse = (coupon.mhuse && coupon.mhuse != '0') ? true : false;
        let bgColor = backgroundColor ? backgroundColor : '#fff';
        let couponBg = null, height = null;
        let isReceive = (this.state.receive || this.isReceiveCoupon(id)) ? true : false;
        let overImg = null;
        let theme = 1;
        if(type == 1) {
            height = 120;
            couponBg = sid > 0 ?
                require('../../images/find/coupons_bg_shop.png') :
                require('../../images/find/coupons_bg_self.png');
            if(canReceive && !clearOverImg) {
                if(isReceive) {
                    couponBg = require('../../images/find/coupons_bg_out.png');
                    overImg = require('../../images/car/receive.png');
                }
            }
            if(ntime >= _etime) overImg = require('../../images/personal/coupon_overdue.png');
            if(isUse) overImg = require('../../images/personal/coupon_used.png');
        }else if(type == 2 || type == 3) {
            height = 116;
            couponBg = sid > 0 ?
                require('../../images/car/coupons_bg_shop.png') :
                require('../../images/car/coupons_bg_self.png');
            if(canReceive && !clearOverImg) {
                if(isReceive) {
                    if(type == 3) {
                        theme = 2;
                        overImg = require('../../images/car/use_coupon.png');
                    }else {
                        couponBg = require('../../images/car/coupons_bg_out.png');
                        overImg = require('../../images/car/receive.png');
                    }
                }
            }
            if(ntime >= _etime) overImg = require('../../images/personal/coupon_overdue.png');
            if(isUse) overImg = require('../../images/personal/coupon_used.png');
        }
        if(overImg && type != 3) color = Color.gray;
        let overImgStyle = theme == 2 ? {
            width: 50, 
            height: 50,
            position: 'absolute',
            right: 5,
            bottom: 3,
        } : {
            width: height, 
            height: height,
            position: 'absolute',
            right: 0,
            top: 0,
        };
        if(id && id > 0) {
            return (
                <View style={style}>
                    <TouchableOpacity 
                        activeOpacity={1}
                        disabled={(type != 3 && (isReceive || !canReceive))}
                        style={{backgroundColor: bgColor}}
                        onPress={()=>{
                            if(type == 3) {
                                callback(coupon);
                            }else {
                                this.clickCoupon(id);
                            }
                        }}
                    >
                        <Image source={couponBg} style={{width: width, height: height}} resizeMode="stretch">
                            <View style={[styles.rowStyle, {flex: 1, height: height}]}>
                                <View style={[styles.couponsLeft, {height: height, width: width * leftRatio}]}>
                                    <View style={styles.rowStyle}>
                                        <Text style={{color: color, fontSize: 14, paddingTop: 9}}>{Lang[Lang.default].RMB}</Text>
                                        <Text style={{color: color, fontSize: 27, paddingLeft: 3}}>{money}</Text>
                                    </View>
                                    <Text numberOfLines={1} style={styles.maxMoneyText}>
                                        {str_replace(Lang[Lang.default].howMuch, maxMoney)}
                                    </Text>
                                </View>
                                <View style={[styles.couponsRight, {height: height}]}>
                                    <Text numberOfLines={1} style={[styles.couponShopName, {backgroundColor: color,}]}>
                                        {sname}
                                    </Text>
                                    <Text numberOfLines={1} style={styles.couponName}>{hname}</Text>
                                    <Text numberOfLines={1} style={styles.couponDate}>
                                        {Lang[Lang.default].usePeriod + ':' + stime.substr(0, 10) + ' - ' + etime.substr(0, 10)}
                                    </Text>
                                </View>
                            </View>
                            {overImg ?
                                <Image source={overImg} style={overImgStyle} />
                                : null
                            }
                        </Image>
                    </TouchableOpacity>
                </View>
            );
        }else {
            return null;
        }
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    couponsLeft: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
    },
    maxMoneyText: {
        fontSize: 13, 
        color: Color.lightBack,
        marginTop: 5,
    },
    couponsRight: {
        flex: 1, 
        marginLeft: 12,
        justifyContent: 'center',
    },
    couponShopName: {
        fontSize: 11,
        paddingBottom: 3,
        paddingTop: 3,
        paddingLeft: 8,
        paddingRight: 8,
        color: '#fff',
        borderRadius: 4.5,
        position: 'absolute',
        left: 0,
        top: 15,
    },
    couponName: {
        fontSize: 14, 
        color: Color.lightBack,
    },
    couponDate: {
        fontSize: 11,
        color: Color.lightGrey,
        position: 'absolute',
        left: 0,
        bottom: 20,
    },
});