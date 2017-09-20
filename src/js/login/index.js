/**
 * 登录页面
 * @auther linzeyong
 * @date   2017.06.07
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
    Modal,
    Platform,
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import Utils, { Loading } from '../public/utils';
import Urls from '../public/adminApiUrl';
import InputText from '../public/InputText';
import Lang, {str_replace, TABKEY} from '../public/language';
import {Size, pixel} from '../public/globalStyle';
import {Color} from '../public/theme';
import ErrorAlert from '../other/ErrorAlert';
import FrequentModel from './FrequentModel';

import User from '../public/user';
var _User = new User();

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            password: '',
            showPassword: false,
            showAlert: false,
            onFocusMobile: false,
            onFocusPassword: false,
            showFrequentModel: false,
            load_or_error: null,
            autoLogin: null,
        };
        this.minPword = 6;
        this.type = 1;
        this.alertMsg = '';
        this.clickNumber = 1;
        this.frequentNumber = 3;
        this.btnLock = false;
    }

    componentDidMount() {
        //如果已登录直接跳转至主页
        _User.getUserID()
        .then((result)=>{
            if(result) {
                this.props.navigation.navigate('Main');
            }else {
                this.setState({
                    autoLogin: false,
                });
            }
        });
    }

    //设置哪个输入框获得焦点
    setInputFocus = (key) => {
        let obj = null;
        if(key == 'tel') {
            obj = {
                onFocusMobile: true,
                onFocusPassword: false,
            };
        }else if(key == 'pwd') {
            obj = {
                onFocusMobile: false,
                onFocusPassword: true,
            };
        }
        if(obj) this.setState(obj);
    };

    //设置手机号值
    setMobile = (value) => {
        this.setState({mobile: value});
    };

    //设置密码值
    setPassword = (value) => {
        this.setState({password: value});
    };

    //密码可见切换
    toggleShowPassword = (value) => {
        this.setState({showPassword: value});
    };

    //检测用户名、密码格式是否正确
    checkFormat = () => {
        let mobile = this.state.mobile;
        let pword = this.state.password;
        if(mobile && pword) {
            return true;
        }
        return false;
    };

    //显示提示框
    showAutoModal = (msg) => {
        this.alertMsg = msg;
        this.setState({
            showAlert: true, 
            load_or_error: null,
        });
    };

    //隐藏提示框
    hideAutoModal = () => {
        this.setState({ showAlert: false });
    };

    //隐藏频繁提示框
    hideFrequentBox = () => {
        this.clickNumber = 1;
        this.setState({showFrequentModel: false});
    };

    //检测用户输入是否正确
    showInputIsAble = () => {
        let mobile = this.state.mobile || '';
        let pword = this.state.password || '';
        let cNumber = this.clickNumber || 1;
        if(!/^1[34578]\d{9}$/.test(mobile)) {
            this.showAutoModal(Lang[Lang.default].mobilePhoneFail);
        }else if(pword.length < this.minPword) {
            this.showAutoModal(str_replace(Lang[Lang.default].passwordMinLength, this.minPword));
        }else if(cNumber > 0 && cNumber % this.frequentNumber === 0) {
            this.setState({showFrequentModel: true});
        }else {
            return true;
        }
        return false;
    };

    //点击登录
    startLogin = () => {
        let navigation = this.props.navigation || null;
        let mobile = this.state.mobile || null;
        let pword = this.state.password || null;
        if(mobile && pword) {
            if(!this.showInputIsAble()) {
                this.btnLock = false;
                return;
            }
            Utils.fetch(Urls.checkUser, 'post', {
                mPhone: mobile,
                mPassword: pword,
            }, (result) => {
                console.log(result);
                this.btnLock = false;
                this.clickNumber++;
                if(result) {
                    let ret = result.sTatus || 0;
                    let msg = result.sMessage || null;
                    let token = result.sToken || null;
                    if(ret == 1 && token) {
                        _User.saveUserID(token)
                        .then(() => {
                            if(navigation) {
                                let params = navigation.state.params;
                                let _backTo = params && params.backTo ? params.backTo : 'Main';
                                let _backObj = params && params.backObj ? params.backObj : {};
                                navigation.navigate(_backTo, _backObj);
                            }
                        });
                    }else if(msg) {
                        this.showAutoModal(result.sMessage);
                    }
                }
            });
        }else {
            this.btnLock = false;
            this.showAutoModal(Lang[Lang.default].mobilePhoneEmpty);
        }
    };

    render() {
        let { navigation } = this.props;
        let {
            mobile, 
            onFocusMobile, 
            password, 
            showPassword, 
            onFocusPassword, 
            showAlert, 
            showFrequentModel, 
            load_or_error,
            autoLogin,
        } = this.state;
        if(autoLogin === null) {
            return null;
        }else if(autoLogin) {
            return null;
        }
        let color = this.checkFormat() ?  '#fff' : Color.mainFontColor;
        let bgcolor = this.checkFormat() ? Color.mainColor : '#ccc';
        let disabled = this.checkFormat() ? false : true;
        return (
            <View style={styles.flex}>
                <ScrollView keyboardShouldPersistTaps={'handled'}>
                    <View style={styles.headBox}>
                        <Image style={styles.logoImage} source={require('../../images/logo.png')} />
                        <Text style={styles.appName}>境淘生意宝</Text>
                        <Text style={styles.appTitle}>境淘土特产商家后台</Text>
                    </View>
                    <View style={styles.inputRowStyle}>
                        <View style={styles.inputRowMain}>
                            <View style={styles.inputMiddleStyle}>
                                <InputText
                                    vText={mobile}
                                    pText={'请输入绑定的手机'} 
                                    onChange={this.setMobile}
                                    length={11}
                                    style={styles.inputStyle}
                                    keyType={"numeric"}
                                    onFocus={()=>this.setInputFocus('tel')}
                                />
                            </View>
                            <View style={styles.inputRightStyle}>
                                {(mobile && onFocusMobile) ?
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
                            <View style={styles.inputMiddleStyle}>
                                <InputText
                                    vText={password}
                                    pText={'请输入密码'}
                                    onChange={this.setPassword}
                                    isPWD={!showPassword}
                                    length={26}
                                    style={styles.inputStyle}
                                    onFocus={()=>this.setInputFocus('pwd')}
                                />
                            </View>
                            {(password && onFocusPassword) ?
                                <View style={styles.inputRightStyle}>
                                    <TouchableOpacity style={styles.btnStyle} onPress={()=>this.setPassword('')}>
                                        <Image source={require('../../images/login/close.png')} style={styles.iconSize18}/>
                                    </TouchableOpacity>
                                    {showPassword ?
                                        <TouchableOpacity style={styles.btnStyle} onPress={()=>this.toggleShowPassword(false)}>
                                            <Image source={require('../../images/login/eyeOpen.png')} style={styles.iconSize26} />
                                        </TouchableOpacity> :
                                        <TouchableOpacity style={styles.btnStyle} onPress={()=>this.toggleShowPassword(true)}>
                                            <Image source={require('../../images/login/eyeClose.png')} style={styles.iconSize26} />
                                        </TouchableOpacity>
                                    }
                                </View>
                                : null
                            }
                        </View>
                    </View>
                    <TouchableOpacity disabled={disabled} onPress={()=>{
                        if(!this.btnLock) {
                            this.btnLock = true;
                            this.startLogin();
                        }
                    }} style={[styles.btnLoginBox, {
                        backgroundColor: bgcolor,
                    }]}>
                        <Text style={[styles.txtStyle1, {color: color}]}>登录</Text>
                    </TouchableOpacity>
                </ScrollView>
                {showAlert ?
                    <ErrorAlert 
                        type={this.type}
                        visiable={showAlert} 
                        message={this.alertMsg} 
                        hideModal={this.hideAutoModal} 
                    />
                    : null
                }
                {showFrequentModel ? 
                    <FrequentModel isShow={showFrequentModel} callBack={this.hideFrequentBox} />
                    : null
                }
                {load_or_error ?
                    <Modal
                        transparent={true}
                        visible={true}
                        onRequestClose={()=>{}}
                    >
                        <View style={styles.modalBody}>
                            {load_or_error}
                        </View>
                    </Modal>
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
    headBox: {
        marginTop: Size.height * 0.145,
        alignItems: 'center',
        marginBottom: Size.height * 0.095,
    },
    logoImage: {
        width: 80,
        height: 80,
    },
    appName: {
        color: Color.mainFontColor,
        fontSize: 16,
        marginTop: 10,
    },
    appTitle: {
        fontSize: 14,
        color: Color.borderColor,
        marginTop: 20,
    },
    iconSize26: {
        width: 26,
        height: 26,
    },
    iconSize18: {
        width: 18,
        height: 18,
        tintColor: '#999',
    },
    btnStyle: {
        padding: 10,
    },
    txtStyle1: {
        fontSize: 13,
        color: Color.mainFontColor,
    },
    inputRowStyle: {
        marginBottom: 25,
    },
    inputRowMain: {
        flexDirection: 'row',
        height: 40,
        marginLeft: 15,
        marginRight: 15,
        paddingRight: 5,
        alignItems: 'center',
        borderBottomColor: Color.borderColor,
        borderBottomWidth: pixel,
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
        textAlign: 'center',
    },
    inputRightStyle: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
    },
    btnLoginBox: {
        height: 40,
        width: Size.width * 0.8,
        marginLeft: Size.width * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 36,
        borderRadius: 3,
    },
    modalBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
});