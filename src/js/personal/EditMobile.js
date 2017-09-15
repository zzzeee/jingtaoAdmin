/**
 * 个人中心 - 手机号码修改
 * @auther linzeyong
 * @date   2017.08.14
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    ScrollView,
    Animated,
    TouchableOpacity,
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import User from '../public/user';
import Utils from '../public/utils';
import Urls from '../public/apiUrl';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace, TABKEY} from '../public/language';
import InputText from '../public/InputText';
import SendCode from '../login/verificationCode';
import ErrorAlert from '../other/ErrorAlert';
import FrequentModel from '../login/FrequentModel';

var _User = new User();

export default class EditMobile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            password: '',
            code: '',
            showAlert: false,
            onFocusMobile: false,
            onFocusCode: false,
            showFrequentModel: false,
        };
        this.timer = [];
        this.type = 1;
        this.alertMsg = '';
        this.sendResult = false;
        this.clickNumber = 1;
        this.frequentNumber = 3;
        this.mToken = null;
        this.userInfo = null;
        this.weixinInfo = null;
    }

    componentWillMount() {
        this.initDatas();
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        for(let t of this.timer) {
            clearTimeout(t);
        }
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if (navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { mToken, userInfo, weixinInfo, } = params;
            this.mToken = mToken || null;
            this.userInfo = userInfo || null;
            this.weixinInfo = weixinInfo || null;
        }
    };

    //设置哪个输入框获得焦点
    setInputFocus = (key) => {
        let obj = null;
        if(key == 'tel') {
            obj = {
                onFocusMobile: true,
                onFocusCode: false,
            };
        }else if(key == 'code') {
            obj = {
                onFocusMobile: false,
                onFocusCode: true,
            };
        }
        if(obj) this.setState(obj);
    };

    //隐藏频繁提示框
    hideFrequentBox = () => {
        this.clickNumber = 1;
        this.setState({showFrequentModel: false});
    };

    //设置手机号值
    setMobile = (value) => {
        this.setState({mobile: value});
    };

    //设置验证码值
    setCode = (value) => {
        this.setState({code: value});
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

    //检测用户名、密码格式是否正确
    checkFormat = () => {
        let mobile = this.state.mobile;
        let code = this.state.code;
        if(mobile && code) {
            return true;
        }
        return false;
    };

    //检测是否可以允许发送验证码
    checkCode = () => {
        let mobile = this.state.mobile;
        if(mobile) {
            return true;
        }
        return false;
    };

    //检测手机号码
    showInputIsAble = (callback = null) => {
        let mobile = this.state.mobile || '';
        let cNumber = this.clickNumber || 1;
        let oldMobile = (this.userInfo && this.userInfo.mPhone) ? this.userInfo.mPhone : null;
        if(!mobile) {
            this.showAutoModal(Lang[Lang.default].inputMobile);
        }else if(!Utils.checkMobile(mobile)) {
            this.showAutoModal(Lang[Lang.default].mobilePhoneFail);
        }else if(mobile == oldMobile) {
            this.showAutoModal('手机号码没有变化!');
        }else if(cNumber > 0 && cNumber % this.frequentNumber === 0) {
            this.setState({showFrequentModel: true});
        }else {
            return true;
        }
        callback && callback();
        return false;
    };

    //发送验证码
    clickSendCode = (callback, disLock) => {
        if(this.showInputIsAble(disLock)) {
            let that = this;
            let mobile = this.state.mobile || '';
            let cNumber = this.clickNumber || 1;
            Utils.fetch(Urls.sendCode, 'post', {
                mType: 'jb',
                mPhone: this.state.mobile,
            }, (result) => {
                console.log(result);
                that.clickNumber++;
                disLock();
                if(result) {
                    let ret = result.sTatus || 0;
                    if(ret == 1) {
                        callback();
                        that.sendResult = true;
                    }else if(result.sMessage) {
                        that.showAutoModal(result.sMessage);
                    }
                }
            });
        }
    };

    //点击确定
    userRegister = () => {
        let that = this;
        let { navigation } = this.props;
        let mobile = this.state.mobile || '';
        let code = this.state.code || '';
        if(this.weixinInfo && this.showInputIsAble()) {
            this.weixinInfo.mPhone = mobile;
            this.weixinInfo.mCode = code;
            Utils.fetch(Urls.weixinLoginApi, 'post', this.weixinInfo, (result)=>{
                if(result) {
                    let err = result.sTatus || null;
                    let msg = result.sMessage || null;
                    let token = result.mToken || null;
                    if(err == 1) {
                        if(token) {
                            _User.saveUserID(_User.keyMember, token)
                            .then(() => {
                                let resetAction = NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({
                                            routeName: 'TabNav', 
                                            params: {PathKey: TABKEY.personal},
                                        }),
                                    ]
                                });
                                navigation.dispatch(resetAction);
                            });
                            _User.delUserID(_User.keyTourist);
                        }
                    }else if(msg) {
                        this.showAutoModal(msg);
                    }
                }
            });
        }else if(this.userInfo && this.mToken && code && this.showInputIsAble()) {
            Utils.fetch(Urls.updateUserInfo, 'post', {
                mToken: this.mToken,
                mPhone: mobile,
                mPhoneCode: code,
            }, (result) => {
                console.log(result);
                that.clickNumber++;
                if(result) {
                    let err = result.sTatus || 0;
                    let msg = result.sMessage || null;
                    if(err == 1) {
                        this.userInfo.mPhone = mobile;
                        navigation.navigate('EditUser', {
                            mToken: this.mToken,
                            userInfo: this.userInfo,
                        });
                    }else if(msg) {
                        that.showAutoModal(msg);
                    }
                }
            });
        }
    };

    render() {
        let { navigation } = this.props;
        let color = this.checkFormat() ? '#fff' : Color.lightBack;
        let bgcolor = this.checkFormat() ? Color.mainColor : Color.gray;
        let disabled = this.checkFormat() ? false : true;
        let oldMobile = (this.userInfo && this.userInfo.mPhone) ? this.userInfo.mPhone : null;
        let title = this.userInfo ? '更改手机号码' : '绑定手机号码';
        let ptext = this.userInfo ? '请输入新的手机号码' : '请输入手机号码';
        return (
            <View style={styles.container}>
                <AppHead
                    title={title}
                    goBack={true}
                    navigation={navigation}
                />
                <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={styles.scrollStyle}>
                    {oldMobile ?
                        <View style={styles.inputRowStyle}>
                            <View style={styles.inputRowMain}>
                                <Text style={styles.txtStyle2}>{'当前手机号码为：' + oldMobile}</Text>
                            </View>
                        </View>
                        : null
                    }
                    <View style={styles.inputRowStyle}>
                        <View style={styles.inputRowMain}>
                            <View style={styles.inputLeftStyle}>
                                <Image source={require('../../images/login/iphone_gary.png')} style={styles.iconSize26} />
                            </View>
                            <View style={styles.inputMiddleStyle}>
                                <InputText
                                    vText={this.state.mobile}
                                    pText={ptext}
                                    onChange={this.setMobile}
                                    length={11}
                                    style={styles.inputStyle}
                                    keyType={"numeric"}
                                    onFocus={()=>this.setInputFocus('tel')}
                                />
                            </View>
                            <View style={styles.inputRightStyle}>
                                {(this.state.mobile && this.state.onFocusMobile) ?
                                    <TouchableOpacity style={styles.btnStyle} onPress={()=>this.setMobile('')}>
                                        <Image source={require('../../images/login/close.png')} style={styles.iconSize18} />
                                    </TouchableOpacity>
                                    : null
                                }
                            </View>
                        </View>
                    </View>
                    <View style={styles.inputRowStyle}>
                        <View style={styles.inputRowMain}>
                            <View style={styles.inputLeftStyle}>
                                <Image source={require('../../images/login/code.png')} style={styles.iconSize26} />
                            </View>
                            <View style={styles.inputMiddleStyle}>
                                <InputText
                                    vText={this.state.code}
                                    pText={Lang[Lang.default].inputCode}
                                    onChange={this.setCode}
                                    length={10}
                                    style={styles.inputStyle}
                                    onFocus={()=>this.setInputFocus('code')}
                                />
                            </View>
                            <View style={styles.inputRightStyle}>
                                {(this.state.code && this.state.onFocusCode) ?
                                    <TouchableOpacity style={styles.btnStyle} onPress={()=>this.setCode('')}>
                                        <Image source={require('../../images/login/close.png')} style={styles.iconSize18}/>
                                    </TouchableOpacity>
                                    : null
                                }
                                <SendCode sendCodeFunc={this.clickSendCode} enable={this.checkCode()} />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity disabled={disabled} onPress={this.userRegister} style={[styles.btnLoginBox, {
                        backgroundColor: bgcolor,
                    }]}>
                        <Text style={[styles.txtStyle1, {color: color}]}>{Lang[Lang.default].determine}</Text>
                    </TouchableOpacity>
                </ScrollView>
                {this.state.showAlert ?
                    <ErrorAlert 
                        type={this.type}
                        visiable={this.state.showAlert} 
                        message={this.alertMsg} 
                        hideModal={this.hideAutoModal} 
                    />
                    : null
                }
                {this.state.showFrequentModel ? 
                    <FrequentModel isShow={this.state.showFrequentModel} callBack={this.hideFrequentBox} />
                    : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Color.floralWhite,
    },
    scrollStyle: {
        paddingTop: 10,
    },
    iconSize26: {
        width: PX.iconSize26,
        height: PX.iconSize26,
    },
    iconSize18: {
        width: 18,
        height: 18,
    },
    iconSize12: {
        width: 12,
        height: 12,
    },
    btnStyle: {
        padding: 10,
    },
    txtStyle1: {
        fontSize: 13,
        color: Color.lightBack,
    },
    txtStyle2: {
        fontSize: 12,
        color: Color.gainsboro,
    },
    txtStyle3: {
        fontSize: 13,
        color: Color.mainColor,
    },
    inputRowStyle: {
        backgroundColor: '#fff',
    },
    inputRowMain: {
        flexDirection: 'row',
        height: PX.rowHeight1,
        marginLeft: PX.marginLR,
        paddingRight: 5,
        alignItems: 'center',
        borderBottomColor: Color.lavender,
        borderBottomWidth: 1,
    },
    inputLeftStyle: {
        marginRight: 28,
    },
    inputMiddleStyle: {
        flex: 1,
    },
    inputStyle: {
        borderWidth: 0,
        fontSize: 13,
    },
    inputRightStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textRowStyle: {
        flexDirection: 'row',
        height: 44,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
    },
    btnLoginBox: {
        height: 38,
        width: Size.width - (PX.marginLR * 2),
        marginLeft: PX.marginLR,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.gray,
        marginTop: 80,
        borderRadius: 3,
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    registerText: {
        fontSize: 12,
        color: Color.gainsboro,
        paddingRight: 5,
    },
});