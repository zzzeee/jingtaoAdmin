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

//模块调用, 方便统一修改
const MyNavScren = ({ navigation, NavScreen }) => (
    <NavScreen navigation={navigation} />
);

//首页主页
const InitScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Init} />
);

//首页主页
const MainScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Main} />
);

//登录页
const LoginScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Login} />
);

const AppNavigator = StackNavigator({
    Init: {screen: InitScreen, },
    Login: {screen: LoginScreen, },
    Main: {screen: MainScreen, },
}, {
    initialRouteName: 'Init',
    headerMode: 'none',
    mode: 'card',
});

export default AppNavigator;