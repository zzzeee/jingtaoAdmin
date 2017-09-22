/**
 * 导航管理
 * @auther linzeyong
 */

import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Init from './initpage';
import Main from './main';
import Login from './login';
import Order from './order';
import OrderDetail from './order/OrderDetail';
import LogisticsNumber from './order/LogisticsNumber';
import OrderLogistics from './order/OrderLogistics';
import Barcode from './order/barcode';
import SetApp from './personal/SetApp';
import JTteam from './personal/JTteam';

//模块调用, 方便统一修改
const MyNavScren = ({ navigation, NavScreen }) => (
    <NavScreen navigation={navigation} />
);

//初始页
const InitScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Init} />
);

//登录页
const LoginScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Login} />
);

//首页主页
const MainScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Main} />
);

//订单列表
const OrderScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Order} />
);

//订单详情
const OrderDetailScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={OrderDetail} />
);

//订单详情 - 发货页
const LogisticsNumberScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={LogisticsNumber} />
);

//订单详情 - 发货页
const OrderLogisticsScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={OrderLogistics} />
);

//订单详情 - 发货页 - 条形码扫描
const BarcodeScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Barcode} />
);

//系统设置
const SetAppScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={SetApp} />
);

//系统设置
const JTteamScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={JTteam} />
);

const AppNavigator = StackNavigator({
    Init: {screen: InitScreen, },
    Login: {screen: LoginScreen, },
    Main: {screen: MainScreen, },
    Order: {screen: OrderScreen, },
    OrderDetail: {screen: OrderDetailScreen, },
    LogisticsNumber: {screen: LogisticsNumberScreen, },
    OrderLogistics: {screen: OrderLogisticsScreen, },
    Barcode: {screen: BarcodeScreen, },
    SetApp: {screen: SetAppScreen, },
    JTteam: {screen: JTteamScreen, },
}, {
    initialRouteName: 'Init',
    headerMode: 'none',
    mode: 'card',
});

export default AppNavigator;