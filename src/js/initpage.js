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

var DeviceInfo = require('react-native-device-info');
import JPushModule from 'jpush-react-native';
const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
const openNotificationEvent = "openNotification";
const getRegistrationIdEvent = "getRegistrationId";

import User from './public/user';
var _User = new User();

export default class PushActivity extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
        _User.getUserID()
        .then((result) => {
            if(result) {
                this.props.navigation.navigate('Main');
            }else {
                this.props.navigation.navigate('Login');
            }
        });
    }

    //活动记录和数据统计
    appActivityLog = () => {
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
            'userAgent': userAgent.replace(/Android/ig, '安卓系统').replace(/like/ig, '1ike'),
            'deviceName': dName,
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
        console.log(obj);
    };

	componentDidMount() {
        JPushModule.getInfo((map) => {
            console.log(map);
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
            console.log(resultCode);    //0
        });
        JPushModule.addReceiveCustomMsgListener((map) => {
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
                this.props.navigation.navigate('Main');
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
            console.log("新用户注册: ");
            //registrationId: 18071adc03370efe851
            console.log("Device register succeed, registrationId: " + registrationId);
        });
	}

	componentWillUnmount() {
		JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
		JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
		JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
		JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
		console.log("Will clear all notifications");
		JPushModule.clearAllNotifications();
	}

	render() {
        return null;
	}
}