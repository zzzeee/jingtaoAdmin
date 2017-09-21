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
        this.token = null;
        this.force = false;
	}

	componentWillMount() {
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
                    if(this.props && this.props.navigation) {
                        this.props.navigation.navigate('OrderDetail', {
                            isRefresh: true,
                            shopOrderNum: params.orderID,
                        });
                    }else {
                        this.timer = setTimeout(()=>{
                            if(this.props && this.props.navigation) {
                                this.props.navigation.navigate('OrderDetail', {
                                    isRefresh: true,
                                    shopOrderNum: params.orderID,
                                });
                            }else {
                                this.timer = setTimeout(()=>{
                                    if(this.props && this.props.navigation) {
                                        this.props.navigation.navigate('OrderDetail', {
                                            isRefresh: true,
                                            shopOrderNum: params.orderID,
                                        });
                                    }else {
                                        this.timer = setTimeout(()=>{
                                            if(this.props && this.props.navigation) {
                                                this.props.navigation.navigate('OrderDetail', {
                                                    isRefresh: true,
                                                    shopOrderNum: params.orderID,
                                                });
                                            }
                                        }, 500);
                                    }
                                }, 400);
                            }
                        }, 300);
                    }
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
        this.token = await _User.getUserID().then((result)=>result);
        if(this.token) {
            this.props.navigation.navigate('Main');
        }else {
            this.props.navigation.navigate('Login');
        }
    };

	render() {
        return null;
	}
}