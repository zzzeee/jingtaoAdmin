/**
 * 生意宝APP主题
 * @auther linzeyong
 */

import {
  StyleSheet,
  AsyncStorage,
} from 'react-native';

//生意宝共用颜色
export const Color = {
    lightBgColor: '#F8F8F8',
    lightBgColor2: '#EFEFEF',
    borderColor: '#E7E7E7',
    mainFontColor: '#4A4A4A',
    mainColor: '#2B99F7',
    grayFontColor: '#9B9B9B',
    redFontColor: '#EB5144',
};

//生意宝APP主题1
export const theme = {
    'default' : {
        mainColor: '#2B99F7',
    },
};

var theme_key = 'jingtaoAdmin_theme';
//获取本地主题的设置
var getLocalData = async () => {
    return await AsyncStorage.getItem(theme_key, (error, result) => {
        if(!error && result) {
            return result;
        }else {
            return null;
        }
    });
}

//设置APP主题
const setTheme = (name = null, isSave = true) => {
    if(isSave && name) {
        AsyncStorage.setItem(theme_key, name);
    }
    let _name = name ? name : getLocalData();
    let _theme = (name && theme[name]) ? theme[name] : theme.default;
    return Object.assign({}, publicColor, _theme);
}

// export const selectTheme = setTheme();