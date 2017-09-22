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
    Linking,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

import User from '../public/user';
import { Size, pixel, } from '../public/globalStyle';
import { Color } from '../public/theme';
import AppHead from '../public/AppHead';
import ErrorAlert from '../other/ErrorAlert';
import AlertMoudle from '../other/AlertMoudle';

var _User = new User();

export default class SetApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteAlert: false,
            alertObject: {},
        };
        this.type = 2;
        this.alertMsg = null;
        this.updateUrl = null;
    }

    //显示删除提示框
    showAlertMoudle = (obj, callback = null) => {
        this.setState({
            deleteAlert: true,
            alertObject: obj,
        }, ()=>callback && callback());
    };

    render() {
        let { navigation, } = this.props;
        let { deleteAlert, alertObject, } = this.state;
        let version = DeviceInfo.getVersion() || '';
        let params = (navigation && navigation.state.params) ? navigation.state.params : {};
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
                        <Image source={require('../../images/logo.png')} style={{
                            width: 60,
                            height: 60,
                        }} />
                        <Text style={styles.fontSize1}>境淘生意宝</Text>
                        <Text style={styles.fontSize2}>{'版本号 ' + version}</Text>
                    </View>
                    <View style={styles.belowBox}>
                        <TouchableOpacity style={styles.btnRowStyle} onPress={()=>{
                            this.showAlertMoudle({
                                text: '客服号码: 400-023-7333',
                                rightText: '呼叫',
                                leftText: '取消',
                                rightColor: '#fff',
                                leftClick: ()=>this.setState({deleteAlert: false,}),
                                rightClick: ()=>{
                                    this.setState({deleteAlert: false,}, ()=>{
                                        Linking.openURL('tel: 4000237333')
                                        .catch(err => console.error('调用电话失败！', err));
                                    });
                                },
                            });
                        }}>
                            <Text style={styles.fontSize4}>联系境淘</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.leftIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnRowStyle} onPress={()=>navigation.navigate('JTteam')}>
                            <Text style={styles.fontSize4}>开发团队</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.leftIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnRowStyle, {
                            marginTop: 30,
                        }]} onPress={()=>{
                            this.showAlertMoudle({
                                text: '是否注销当前帐号',
                                rightText: '退出',
                                leftText: '取消',
                                rightColor: '#fff',
                                leftClick: ()=>this.setState({deleteAlert: false,}),
                                rightClick: ()=>{
                                    _User.delUserID()
                                    .then(()=>{
                                        this.setState({deleteAlert: false,}, ()=>{
                                            let resetAction = NavigationActions.reset({
                                                index: 0,
                                                actions: [
                                                    NavigationActions.navigate({routeName: 'Login',}),
                                                ]
                                            });
                                            navigation.dispatch(resetAction);
                                        });
                                    });
                                },
                            });
                        }}>
                            <Text style={styles.fontSize4}>退出登陆</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.leftIcon} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {deleteAlert ?
                    <AlertMoudle visiable={deleteAlert} {...alertObject} />
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
        backgroundColor: Color.lightBgColor2,
    },
    aboveBox: {
        marginTop: 30,
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
    btnRowStyle: {
        width: Size.width,
        height: 44,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: Color.borderColor,
        borderBottomWidth: pixel,
    },
    fontSize1: {
        fontSize: 16,
        color: Color.mainFontColor,
        fontWeight: 'bold',
        paddingTop: 5,
        backgroundColor: 'transparent',
    },
    fontSize2: {
        fontSize: 12,
        color: Color.mainFontColor,
        paddingTop: 3,
        backgroundColor: 'transparent',
    },
    fontSize4: {
        fontSize: 13,
        color: Color.mainFontColor,
        backgroundColor: 'transparent',
    },
});