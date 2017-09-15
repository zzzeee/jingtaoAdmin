/**
 * 个人中心 - 设置
 * @auther linzeyong
 * @date   2017.07.07
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    Linking,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

import User from '../public/user';
import Urls from '../public/apiUrl';
import Utils, {Loading} from '../public/utils';
import Lang, {str_replace, TABKEY} from '../public/language';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import ErrorAlert from '../other/ErrorAlert';
import AlertMoudle from '../other/AlertMoudle';

var _User = new User();

export default class SetApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            deleteAlert: false,
            alertObject: {},
        };
        this.type = 2;
        this.alertMsg = null;
        this.updateUrl = null;
    }

    //显示提示框
    showAutoModal = (msg) => {
        this.alertMsg = msg;
        this.setState({
            showAlert: true, 
            deleteAlert: false,
        });
    };

    //隐藏提示框
    hideAutoModal = () => {
        this.setState({ showAlert: false });
    };

    //显示删除提示框
    showAlertMoudle = (obj, callback = null) => {
        this.setState({
            deleteAlert: true,
            alertObject: obj,
        }, ()=>callback && callback());
    };

    //打开浏览器
    linkUpdate_www = () => {
        if(this.updateUrl) {
            Linking.openURL(this.updateUrl)
            .catch(err => console.error('跳转失败:', err));
        }
    };

    //检查更新
    checkAppUpdate = () => {
        this.showAlertMoudle({
            diyModalBody: Loading({
                loadText: '请稍等',
            }),
        }, ()=>{
            Utils.fetch(Urls.getVersion, 'get', {
                type: Platform.OS === 'ios' ? 2 : 0,
                code: DeviceInfo.getBuildNumber() || 0,
            }, (result)=>{
                console.log(result);
                if(result && result.sTatus == 1 && result.info && result.info.length) {
                    let version1 = result.info[0].versionName || null;
                    let version2 = DeviceInfo.getVersion() || null;
                    if(version1 && version2 && version1 != version2) {
                        let vs1 = version1.split('.') || [];
                        let vs2 = version2.split('.') || [];
                        let vs1_0 = parseInt(vs1[0]) || 0,
                            vs1_1 = parseInt(vs1[1]) || 0,
                            vs1_2 = parseInt(vs1[2]) || 0,
                            vs2_0 = parseInt(vs2[0]) || 0,
                            vs2_1 = parseInt(vs2[1]) || 0,
                            vs2_2 = parseInt(vs2[2]) || 0;
                        if(vs1_0 > vs2_0 || 
                        ((vs1_0 == vs2_0) && (vs1_1 > vs2_1)) || 
                        ((vs1_0 == vs2_0) && (vs1_1 == vs2_1) && (vs1_2 > vs2_2))) {
                            let type = 0;
                            if(result.info && result.info.length > 0) {
                                let obj = {
                                    rightText: '稍后再说',
                                    leftText: '立即下载',
                                    rightClick: ()=>this.setState({deleteAlert: false,}),
                                    leftClick: this.linkUpdate_www,
                                    contentStyle: styles.updateBox,
                                };
                                obj.textView = (
                                    <ScrollView contentContainerStyle={styles.scollStyle}>
                                        {result.info.map((item, index)=>{
                                            let contents = item.versionInfo || [];
                                            let title = item.versionTitle || null;
                                            let code = item.versionName || null;
                                            let _type = item.versionType || null;
                                            if(item.versionUrl && !this.updateUrl) this.updateUrl = item.versionUrl;
                                            if(_type && type != 9) type = _type;
                                            return (
                                                <View key={index} style={{
                                                    marginBottom: (index + 1 == result.info.length) ? 0 : 20,
                                                }}>
                                                    <Text numberOfLines={2} style={styles.updateTitle}>{title}</Text>
                                                    <Text numberOfLines={2} style={styles.versionCode}>
                                                        {_type == 9 ? `${code} (强制更新)` : code}
                                                    </Text>
                                                    {contents.map((item2, index2) => {
                                                        return <Text key={index2} style={styles.updateText}>{item2}</Text>;
                                                    })}
                                                </View>
                                            )
                                        })}
                                    </ScrollView>
                                );
                                this.showAlertMoudle(obj);
                                return;
                            }
                        }
                    }
                }
                this.showAutoModal('已经是最新版本');
            });
        });
    };

    render() {
        let { navigation, } = this.props;
        let { deleteAlert, alertObject, showAlert } = this.state;
        let version = DeviceInfo.getVersion() || '';
        let params = (navigation && navigation.state.params) ? navigation.state.params : {};
        let login = params.login ? true : false;
        let token = params.mToken ? params.mToken : null;
        return (
            <View style={styles.container}>
                <AppHead
                    title={'设置'}
                    goBack={true}
                    navigation={navigation}
                />
                <ScrollView>
                    <View style={styles.aboveBox}>
                        <Image source={require('../../images/logo2.png')} style={{
                            width: 60,
                            height: 60,
                        }} />
                        <Text style={styles.fontSize1}>境淘土特产</Text>
                        <Text style={styles.fontSize2}>{'版本号 ' + version}</Text>
                    </View>
                    <View style={styles.belowBox}>
                        <TouchableOpacity style={styles.btnRowStyle} onPress={this.checkAppUpdate}>
                            <Text style={styles.fontSize4}>检查更新</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.leftIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnRowStyle} onPress={()=>navigation.navigate('JTteam')}>
                            <Text style={styles.fontSize4}>境淘团队</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.leftIcon} />
                        </TouchableOpacity>
                        {login ?
                            <TouchableOpacity style={styles.btnRowStyle} onPress={()=>{
                                navigation.navigate('SendMessage', {
                                    mToken: token,
                                });
                            }}>
                                <Text numberOfLines={1} style={styles.fontSize4}>我要留言</Text>
                                <Image source={require('../../images/list_more.png')} style={styles.leftIcon} />
                            </TouchableOpacity>
                            : null
                        }
                        {login ?
                            <TouchableOpacity onPress={()=>{
                                this.showAlertMoudle({
                                    text: '是否注销当前帐号',
                                    rightText: Lang[Lang.default].cancel,
                                    leftText: '退出',
                                    rightClick: ()=>this.setState({deleteAlert: false,}),
                                    leftClick: ()=>{
                                        _User.delUserID(_User.keyMember)
                                        .then(()=>{
                                            this.setState({deleteAlert: false,}, ()=>{
                                                // navigation.navigate('Login', {
                                                //     leftPress: () => navigation.navigate('TabNav', {
                                                //         PathKey: TABKEY.personal,
                                                //     }),
                                                // });
                                                let resetAction = NavigationActions.reset({
                                                    index: 0,
                                                    actions: [
                                                        NavigationActions.navigate({routeName: 'TabNav', params: {
                                                            PathKey: TABKEY.personal,
                                                        }}),
                                                    ]
                                                });
                                                navigation.dispatch(resetAction);
                                            });
                                        });
                                    },
                                });
                            }} style={styles.btnLogOut}>
                                <Text style={styles.fontSize3}>退出登录</Text>
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                </ScrollView>
                {deleteAlert ?
                    <AlertMoudle visiable={deleteAlert} {...alertObject} />
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
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Color.floralWhite,
    },
    aboveBox: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    belowBox: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scollStyle: {
        width: Size.width * 0.8 - 30,
    },
    updateBox : {
        alignItems: 'flex-start',
        backgroundColor: Color.floralWhite,
        maxHeight: Size.height * 0.4,
    },
    updateTitle: {
        color: Color.mainColor,
        fontSize: 14,
        lineHeight: 22,
        paddingBottom: 2,
        fontWeight: 'bold',
        textShadowColor: '#ccc',
        textShadowOffset: {
            width: 1,
            height: 1.6,
        },
        textShadowRadius: 2,
    },
    versionCode: {
        paddingBottom: 10,
        fontSize: 12,
        color: Color.gray,
    },
    updateText: {
        color: Color.lightBack,
        fontSize: 12,
        lineHeight: 20,
    },
    btnRowStyle: {
        width: Size.width,
        height: PX.rowHeight2,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: Color.lavender,
        borderBottomWidth: pixel,
    },
    btnLogOut: {
        marginTop: 50,
        borderWidth: 1,
        borderColor: Color.mainColor,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: Size.width - 30,
        height: PX.rowHeight2,
    },
    fontSize1: {
        fontSize: 16,
        color: Color.lightBack,
        fontWeight: 'bold',
        paddingTop: 5,
        backgroundColor: 'transparent',
    },
    fontSize2: {
        fontSize: 12,
        color: Color.lightBack,
        paddingTop: 3,
        backgroundColor: 'transparent',
    },
    fontSize3: {
        fontSize: 14,
        color: Color.mainColor,
        backgroundColor: 'transparent',
    },
    fontSize4: {
        fontSize: 13,
        color: Color.lightBack,
        backgroundColor: 'transparent',
    },
});