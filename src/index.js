/**
 * APP统一入口文件
 * @auther linzeyong
 */

import React, { Component } from 'react';
import { 
    AppRegistry,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import App from './js/';
// import CodePush from "react-native-code-push";
import { Size, PX } from './js/public/globalStyle';
import {Color} from './js/public/theme';
import { NavigationActions } from 'react-navigation';

if(!__DEV__){
    global.console = {
        info : () => {},
        log : () => {},
        warn : () => {},
        error : () => {},
    };
}

class JingtaoApp extends Component {
    // 构造函数
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // // 直接更新
        // if(!__DEV__) CodePush.sync();
    }

    render() {
        return (
            <View style={styles.flex}>
                <StatusBar backgroundColor={Color.mainColor} barStyle="light-content" />
                {__IOS__ ?
                    <View style={{
                        height: PX.statusHeight,
                        backgroundColor: Color.mainColor,
                    }} />
                    : null
                }
                <View style={styles.flex}>
                    <App />
                </View>
            </View>
        );
    }
}

AppRegistry.registerComponent('jingtaoAdmin', () => JingtaoApp);

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
});