/**
 * APP统一入口文件
 * @auther linzeyong
 * @date   2017.06.02
 */

import React, { Component } from 'react';
import { 
    AppRegistry,
    StatusBar,
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
} from 'react-native';
import { WeiXin } from './js/datas/protect';
import App from './js/';
var WeChat = require('react-native-wechat');
// import CodePush from "react-native-code-push";
import { Size, Color, PX } from './js/public/globalStyle';

if(!__DEV__){
    global.console = {
        info : () => {},
        log : () => {},
        warn : () => {},
        error : () => {},
    };
}

class JingtaoApp extends Component {
    componentDidMount() {
        // 直接更新
        // if(!__DEV__) CodePush.sync();
    }

    render() {
        return (
            <View style={styles.flex}>
                <StatusBar backgroundColor={Color.mainColor} barStyle="light-content" />
                {(Platform.OS === 'ios') ?
                    <View style={{
                        height: PX.statusHeight,
                        backgroundColor: Color.mainColor,
                    }} />
                    : null
                }
                <View style={styles.container}>
                    <App />
                </View>
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
        backgroundColor: '#FFF',
    },
});

//注册微信应用
WeChat.registerApp(WeiXin.appid);
AppRegistry.registerComponent('jingtao', () => JingtaoApp);