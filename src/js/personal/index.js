/**
 * APP个人中心
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Button,
    Animated,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';

import { CachedImage } from "react-native-img-cache";
import Utils from '../public/utils';
import User from '../public/user';
import Urls from '../public/apiUrl';
import BtnIcon from '../public/BtnIcon';
import { Size, PX, pixel, Color, FontSize } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import AppHead from '../public/AppHead';

/**
 * 显示头部背景的高度
 * 以超出个人头像背景的高度时，显示不透明背景
 */
var showHeadBgHeight = PX.userTopHeight - PX.headHeight;
var _User = new User();

export default class PersonalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            islogin: false,
            userInfo: null,
            opacityVal: new Animated.Value(0),
            mCouponNum: 0,
            orderNum: null,
            isRefreshing: true,
        };

        this.mToken = null;
        this.ref_scrollview = null;
    }

    componentDidMount() {
        this.initUser();
    }

    initUser = () => {
        _User.getUserID(_User.keyMember)
        .then((value) => {
            if(value) {
                this.mToken = value;
            }
            this.initDatas();
        });
    };

    initDatas = () => {
        if(this.mToken) {
            Utils.fetch(Urls.getUserInfo, 'post', {
                mToken: this.mToken,
            }, (result) => {
                console.log(result);
                if(result && result.sTatus == 1) {
                    this.setState({
                        islogin: true,
                        userInfo: result.mInfo || null,
                        orderNum: result.orderNum || null,
                        mCouponNum: result.mCouponNum || 0,
                        isRefreshing: false,
                    });
                }else if(result && result.sTatus == 4) {
                    _User.delUserID(_User.keyMember)
                    .then(()=>{
                        this.mToken = null;
                        this.setState({
                            islogin: false,
                            userInfo: null,
                            mCouponNum: 0,
                            orderNum: null,
                            isRefreshing: false,
                        });
                    });
                }else {
                    this.setState({isRefreshing: false,});
                }
            });
        }else {
            this.setState({isRefreshing: false,});
        }
    };

    render() {
        const { navigation } = this.props;
        let { islogin, userInfo, orderNum, mCouponNum, isRefreshing } = this.state;
        let name = '', integral = 0;
        let noPay = (orderNum && orderNum.noPay) ? (parseInt(orderNum.noPay) || 0) : 0;
        let noSend = (orderNum && orderNum.noSend) ? (parseInt(orderNum.noSend) || 0) : 0;
        let noReceipt = (orderNum && orderNum.noReceipt) ? (parseInt(orderNum.noReceipt) || 0) : 0;
        if(islogin && userInfo) {
            name = userInfo.mNickName || userInfo.mPhone;
            integral = parseInt(userInfo.mIntegral) || 0;
        }
        let couponOverdue = (mCouponNum && mCouponNum > 0) ? 
            str_replace(Lang[Lang.default].couponBeOverdue, mCouponNum) : '';
        let uHead = (userInfo && userInfo.mPicture) ? {uri: userInfo.mPicture} : require('../../images/personal/defaultHeadImg.png');
        return (
            <View style={styles.flex}>
                <ScrollView 
                    contentContainerStyle={styles.scrollStyle}
                    ref={(_ref)=>this.ref_scrollview=_ref}  
                    onScroll={this._onScroll}
                    scrollEventThrottle={10}
                    refreshControl={<RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={this.initUser}
                        title="释放立即刷新我..."
                        tintColor={Color.lightBack}
                        titleColor={Color.lightBack}
                    />}
                >
                    <Image source={require('../../images/personal/personalbg.png')} style={styles.userBgImg}>
                        {islogin ?
                            <View style={styles.headMainBox}>
                                <TouchableOpacity style={styles.headBox} onPress={()=>{
                                    if(this.mToken && this.state.userInfo) {
                                        navigation.navigate('EditUser', {
                                            mToken: this.mToken,
                                            userInfo: this.state.userInfo,
                                        });
                                    }
                                }}>
                                    <View style={[styles.userHeadImg, {
                                        borderWidth: pixel,
                                        borderColor: Color.lavender,
                                    }]}>
                                        <CachedImage source={uHead} style={styles.userHeadImg} />
                                    </View>
                                    <Text style={styles.userNameText}>{name}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.linkPage(true, 'MyIntegral')}>
                                    {/*<Image source={require('../../images/personal/integralbg.png')} style={styles.integralBg}>*/}
                                    <View style={styles.integralBg2}>
                                        <Text style={styles.integralText}>{str_replace(Lang[Lang.default].jingtaoIntegral, integral)}</Text>
                                        <Image source={require('../../images/more_white.png')} style={styles.smallIcon} />
                                    </View>
                                    {/*</Image>*/}
                                </TouchableOpacity>
                            </View> :
                            <View style={[styles.headMainBox, {justifyContent: 'center',}]}>
                                <TouchableOpacity style={[styles.btnLoginBox, {
                                    marginRight: 30,
                                }]} onPress={()=>{
                                    navigation.navigate('Login');
                                }}>
                                    <Text style={styles.bigBotton}>{Lang[Lang.default].logo}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnLoginBox} onPress={()=>{
                                    navigation.navigate('Register');
                                }}>
                                    <Text style={styles.bigBotton}>{Lang[Lang.default].register}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </Image>
                    <View style={{backgroundColor: '#fff'}}>
                        <TouchableOpacity style={styles.orderRow} onPress={()=>this.linkPage(true, 'MyOrder')}>
                            <Text style={styles.darkText}>{Lang[Lang.default].myOrder}</Text>
                            <View style={styles.lightTextBox}>
                                <Text style={styles.lightText}>{Lang[Lang.default].viewAllOrder}</Text>
                                <Image source={require('../../images/list_more.png')} style={styles.smallIcon} />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.ctrlBtnBox}>
                            <BtnIcon 
                                src={require('../../images/personal/daifukuan.png')} 
                                width={26} 
                                style={styles.btnCtrlOrder} 
                                text={Lang[Lang.default].daifukuan} 
                                txtStyle={[styles.normalText, {paddingTop: 5}]}
                                press={()=>this.linkPage(true, 'MyOrder', {index: 1})}
                            >
                                {noPay > 0 ?
                                    <TouchableOpacity style={styles.numberStyle}>
                                        <Text style={styles.numberTextStyle}>{noPay > 99 ? '99+' : noPay}</Text>
                                    </TouchableOpacity>
                                    : null
                                }
                            </BtnIcon>
                            <BtnIcon 
                                src={require('../../images/personal/daifahuo.png')} 
                                width={26} 
                                style={styles.btnCtrlOrder} 
                                text={Lang[Lang.default].daifahuo} 
                                txtStyle={[styles.normalText, {paddingTop: 5}]}
                                press={()=>this.linkPage(true, 'MyOrder', {index: 2})}
                            >
                                {noSend > 0 ?
                                    <TouchableOpacity style={styles.numberStyle}>
                                        <Text style={styles.numberTextStyle}>{noSend > 99 ? '99+' : noSend}</Text>
                                    </TouchableOpacity>
                                    : null
                                }
                            </BtnIcon>
                            <BtnIcon 
                                src={require('../../images/personal/daishouhuo.png')} 
                                width={26}
                                style={styles.btnCtrlOrder} 
                                text={Lang[Lang.default].daishouhuo} 
                                txtStyle={[styles.normalText, {paddingTop: 5}]}
                                press={()=>this.linkPage(true, 'MyOrder', {index: 3})}
                            >
                                {noReceipt > 0 ?
                                    <TouchableOpacity style={styles.numberStyle}>
                                        <Text style={styles.numberTextStyle}>{noReceipt > 99 ? '99+' : noReceipt}</Text>
                                    </TouchableOpacity>
                                    : null
                                }
                            </BtnIcon>
                            <BtnIcon 
                                src={require('../../images/personal/shouhou.png')} 
                                width={26} 
                                style={styles.btnCtrlOrder} 
                                text={Lang[Lang.default].shouhou}
                                txtStyle={[styles.normalText, {paddingTop: 5}]}
                            />
                        </View>
                    </View>
                    <View style={styles.btnsListBox}>
                        {this.btnRow(require('../../images/personal/myIntegral.png'), Lang[Lang.default].myIntegral, 'MyIntegral', null)}
                        {this.btnRow(
                            require('../../images/personal/coupon.png'), 
                            Lang[Lang.default].coupon, 
                            'CouponList', 
                            couponOverdue
                        )}
                        {/*this.btnRow(require('../../images/personal/myWallet.png'), Lang[Lang.default].myWallet, null, null)*/}
                        {this.btnRow(require('../../images/personal/myCollection.png'), Lang[Lang.default].myCollection, 'Collection', null)}
                        {this.btnRow(require('../../images/personal/myAddress.png'), Lang[Lang.default].myAddress, 'AddressList', null)}
                    </View>
                    <View style={styles.btnsListBox}>
                        {this.btnRow(require('../../images/personal/join.png'), Lang[Lang.default].jtJoiner, 'Join', null, false)}
                        {this.btnRow(require('../../images/personal/contactUs.png'), Lang[Lang.default].contactUs, 'About', null, false)}
                        {this.btnRow(require('../../images/personal/helpNote.png'), Lang[Lang.default].helpNote, 'Help', null, false)}
                    </View>
                </ScrollView>
                <Animated.View style={[styles.topHeadBg, {
                    opacity: this.state.opacityVal.interpolate({
                        inputRange: [0, showHeadBgHeight],
                        outputRange: [0, 1]
                    }),
                }]}>
                </Animated.View>
                <AppHead 
                    float={true}
                    style={{
                        elevation: this.state.opacityVal._value == 1 ? 4 : 0,
                        backgroundColor: 'transparent',
                        borderBottomWidth: 0,
                    }}
                    textStyle={{color: '#fff'}}
                    title={Lang[Lang.default].persional} 
                    left={<BtnIcon 
                        width={PX.headIconSize}
                        press={()=>navigation.navigate('SetApp', {
                            login: islogin,
                            mToken: this.mToken,
                        })} 
                        src={require("../../images/personal/config_white.png")} 
                    />}
                    // right={(<BtnIcon width={PX.headIconSize} src={require("../../images/personal/msg.png")} />)}
                />
            </View>);
    }

    _onScroll = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        if(offsetY < showHeadBgHeight) {
            this.state.opacityVal.setValue(offsetY);
        }else {
            this.state.opacityVal.setValue(showHeadBgHeight);
        }
    };

    // 跳转页面
    linkPage = (needLogin, nav, navParam = null) => {
        let navigation = this.props.navigation;
        let param = Object.assign({'mToken': this.mToken}, navParam);
        if(!this.state.islogin && needLogin) {
            navigation.navigate('Login');
        }else if(nav) {
            navigation.navigate(nav, param);
        }
    };

    //按钮栏
    btnRow = (img, txt, name, rightTxt, needLogin = true) => {
        return (
            <TouchableOpacity onPress={()=>this.linkPage(needLogin, name)}>
                <View style={styles.btnRowStyle}>
                    <Image style={styles.bigIcon} source={img} style={styles.bigIcon} />
                    <View style={styles.btnRowRightBox}>
                        <Text style={styles.defalueFont}>{txt}</Text>
                        <View style={styles.lightTextBox}>
                            <Text style={styles.btnRowRighText}>{rightTxt}</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.bigIcon} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    defalueFont: {
        color: Color.lightBack,
        fontSize: 14,
    },
    topHeadBg : {
        backgroundColor: Color.mainColor,
		height: PX.headHeight,
        position: 'absolute',
        left: 0, 
        right: 0,
	},
    scrollStyle: {
        // backgroundColor: Color.lightGrey,
        paddingBottom: PX.marginTB,
    },
    userBgImg: {
        justifyContent: "flex-end",
        width: Size.width,
        height: PX.userTopHeight,
    },
    headMainBox: {
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    btnLoginBox: {
        width: 110,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#fff',
        marginBottom: 10,
    },
    bigBotton: {
        color: '#fff',
        fontSize: 14,
        backgroundColor: 'transparent',
    },
    headBox: {
        height: PX.userHeadImgSize,
        marginLeft: PX.marginLR,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    userHeadImg: {
        width: PX.userHeadImgSize,
        height: PX.userHeadImgSize,
        borderRadius: PX.userHeadImgSize / 2,
        // borderWidth: pixel,
        // borderColor: Color.lavender,
    },
    userNameText: {
        paddingLeft: 10,
        color: '#fff',
        fontSize: 14,
        backgroundColor: 'transparent',
    },
    integralBg: {
        width: 130,
        height: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    integralBg2: {
        minWidth: 130,
        height: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
        backgroundColor: '#FDA93E',
    },
    integralText: {
        color: '#fff',
        fontSize: 12,
        paddingRight: 4,
        backgroundColor: 'transparent',
    },
    smallIcon: {
        width: 16,
        height: 16,
    },
    bigIcon: {
        width: 26,
        height: 26,
    },
    btnsListBox: {
        backgroundColor: '#fff',
        marginTop: PX.marginTB,
        marginBottom: -pixel,
    },
    orderRow: {
        height: 49,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Color.lavender,
        borderWidth: pixel,
        paddingRight: PX.marginLR,
    },
    ctrlBtnBox: {
        flexDirection: 'row',
        height: 100,
    },
    btnCtrlOrder: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberStyle: {
        position: 'absolute',
        left: Size.width / 8,
        top: 22,
        height: 13,
        borderRadius: 6.5,
        paddingLeft: 7,
        paddingRight: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Color.red,
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    numberTextStyle: {
        fontSize: 9,
        color: Color.red,
        paddingBottom: 1,
        backgroundColor: 'transparent',
    },
    darkText: {
        color: Color.lightBack,
        fontSize: 14,
        paddingLeft: PX.marginLR,
        fontWeight: 'bold',
    },
    lightTextBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lightText: {
        color: Color.gainsboro,
        fontSize: 12,
        paddingRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    normalText: {
        color: Color.lightBack,
        fontSize: 13,
    },
    btnRowStyle: {
        width: Size.width - PX.marginLR,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: PX.marginLR,
        paddingRight: PX.marginLR,
    },
    btnRowRightBox: {
        flex: 1,
        height: 50,
        borderBottomColor: Color.lavender,
        borderBottomWidth: pixel,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: PX.marginLR,
    },
    btnRowRighText: {
        paddingRight: 8,
        fontSize: 13,
        color: Color.red,
    },
});