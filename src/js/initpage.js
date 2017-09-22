'use strict';

/**
 * APP统一入口文件
 * @auther linzeyong
 */

import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import JPushModule from 'jpush-react-native';
import Utils, { Loading, } from './public/utils';
import Urls from './public/adminApiUrl';
import User from './public/user';
var _User = new User();
const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
const openNotificationEvent = "openNotification";
const getRegistrationIdEvent = "getRegistrationId";

export default class PushActivity extends Component {
	constructor(props) {
        super(props);
        this.token = null;
        this.force = false;
	}

	componentWillMount() {
        //极光推送事件
        JPushModule.getInfo((map) => {
            // console.log(map);
            /**
             {
                myAppKey: "AppKey:4805ff13416b3cc4966f8e6f"
                myDeviceId: "DeviceId: c7437659d62df2b55b95a58c71e6d7d3"
                myImei: "IMEI: 000000000000000"
                myPackageName: "PackageName: com.jingtaoAdmin"
                myVersion: "Version: 1.0"
             }
             */
		});
        JPushModule.notifyJSDidLoad((resultCode)=>{
            //我他妈的也不知道这里应该写些啥, 但他娘的又不能不写。
            // console.log(resultCode);    //0
            if(!this.force) {
                // this.getLocalToken();
                _User.getUserID().then((result)=>{
                    //添加设备记录
                    let obj = this.AppDeviceInfo(result);
                    // console.log(obj);
                    Utils.fetch(Urls.addDeviceLog, 'post', obj, null);
                    if(!this.force && this.props && this.props.navigation) {
                        if(result) {
                            this.props.navigation.navigate('Main');
                        }else {
                            this.props.navigation.navigate('Login');
                        }
                    }
                });
            }
        });
        JPushModule.addReceiveCustomMsgListener((map) => {
            //暂不知作用
            console.log("addReceiveCustomMsgListener: ");
            console.log(map);
        });
        JPushModule.addReceiveNotificationListener((map) => {
            //收到通知
            console.log("收到通知 addReceiveNotificationListener: ");
            console.log(map);
        });
        JPushModule.addReceiveOpenNotificationListener((map) => {
            //打开通知
            console.log("打开通知 addReceiveOpenNotificationListener: ");
            console.log(map);
            if(map && map.extras) {
                this.force = true;
                let params = JSON.parse(map.extras) || {};
                if(params && params.orderID) {
                    this.autoLoopNav('OrderDetail', {
                        isRefresh: true,
                        shopOrderNum: params.orderID,
                    });
                }else {
                    this.autoLoopNav('Main');
                }
            }
            /*
            {
                alertContent: "我再一次测试一下，还没收到莫怪老夫血洗极光。222",
                extras: "{"a":"aaa","c":"ccc","b":"bbb"}",
                id: 188219914
            }
             */
        });
        JPushModule.addGetRegistrationIdListener((registrationId) => {
            //registrationId: 18071adc03370efe851
            console.log("新用户注册, registrationId: " + registrationId);
        });
    }

	componentDidMount() {
        
    }

    //APP设备记录
    AppDeviceInfo = (token = null) => {
        let dArea = DeviceInfo.getDeviceLocale();   //设备地区
        let dCity = DeviceInfo.getDeviceCountry();  //设备城市
        let userAgent = DeviceInfo.getUserAgent();  //操作系统及版本
        let dName = DeviceInfo.getDeviceName();     //设备名称
        let readableVersion = DeviceInfo.getReadableVersion();
        let version = DeviceInfo.getVersion();      //版本名称
        let buildNumber = DeviceInfo.getBuildNumber();
        let bundleId = DeviceInfo.getBundleId();    //包名
        let systemVersion = DeviceInfo.getSystemVersion();
        let systemName = DeviceInfo.getSystemName();
        let deviceID = DeviceInfo.getDeviceId();
        let model = DeviceInfo.getModel();  //型号
        let brand = DeviceInfo.getBrand();  //品牌
        let manufacturer = DeviceInfo.getManufacturer();    //制造商
        let isEmulator = DeviceInfo.isEmulator();           //是否为虚拟机
        let obj = {
            'userAgent': userAgent,
            'deviceName': 'aaaaa' + dName,
            'version': version,
            'buildNumber': buildNumber,
            'bundleId': bundleId,
            'sysVersion': systemVersion,
            'sysName': systemName,
            'deviceID': deviceID,
            'dModel': model,
            'dBrand': brand,
            'manufacturer': manufacturer,
            'isEmulator': isEmulator ? 2 : 1,
            'uniqueID': DeviceInfo.getUniqueID(),
        };
        if(token) obj.mToken = token;
        // console.log(obj);
        return obj;
    };
    
    /**
     * 循环跳转罗拉
     * @param nav           string  跳转的router
     * @param navObj        object  跳转的params
     * @param startTime     int     每次检查的时间
     * @param loopNumber    int     超时次数
     */
    autoLoopNav = (nav, navObj = {}, startTime = 250, loopNumber = 5) => {
        if(loopNumber <= 0) return false; 
        if(this.props && this.props.navigation) {
            this.props.navigation.navigate(nav, navObj);
        }else {
            this.timer = setTimeout(()=>{
                if(this.props && this.props.navigation) {
                    this.props.navigation.navigate(nav, navObj);
                }else {
                    return this.autoLoopNav(nav, navObj, startTime, --loopNumber);
                }
            }, startTime);
        }
    };

	componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
		JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
		JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
		JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
		JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
		// console.log("Will clear all notifications");
		// JPushModule.clearAllNotifications();
    }
    
    getLocalToken = async () => {
        if(!this.force && this.props && this.props.navigation) {
            this.token = await _User.getUserID().then((result)=>result);
            if(this.token) {
                this.props.navigation.navigate('Main');
            }else {
                this.props.navigation.navigate('Login');
            }
        }
    };

	render() {
        return null;
	}
}