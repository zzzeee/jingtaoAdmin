/**
 * 常用工具
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';

import Lang, {str_replace} from './language';
import { Size, pixel, PX, Color, errorStyles } from './globalStyle';

//加载中
export const Loading = ({ loadType, bgStyle, loadText, loadColor, loadStyle, load_textStyle }) => {
    let _loadType = loadType || 1;
    let txt = loadText || Lang[Lang.default].loading;
    let color = loadColor || (_loadType == 1 ? '#fff' : Color.mainColor);
    let loadEment = _loadType == 1 ?
        <View style={[styles.modalBody, loadStyle]}>
            <ActivityIndicator animating={true} color={color} size="small" />
            <Text numberOfLines={1} style={[styles.modalText, {color: color}, load_textStyle]} >{txt}</Text>
        </View> :
        <ActivityIndicator animating={true} color={color} size="small" />;

    return (
        <View style={[styles.bodyView, bgStyle]}>
            {loadEment}
        </View>
    );
};

//获取失败
const ErrorView = (obj, func) => {
    const {bgStyle, errText1, errText2, errColor, errStyle, err_textStyle1, err_textStyle2, fetchFunc} = obj;
    let txt1 = errText1 || Lang[Lang.default].reconnect;
    let txt2 = errText2 || Lang[Lang.default].fetchError;
    let color = errColor || Lang[Lang.default].lightBack;
    return (
        <View style={[errorStyles.bodyView, bgStyle]}>
            <Text 
                style={[errorStyles.refaceBtn, {color: color}, err_textStyle1]}
                onPress={fetchFunc}
            >
                {txt1}
            </Text>
            <Text style={[errorStyles.errRemind, {color: color}, err_textStyle2]}>{txt2}</Text>
        </View>
    );
};

var Util = {
    /**
     * 生成API访问JSON参数
     */
    createJson: function(data) {
        if(typeof(data) == 'object') {
            //data参数格式化
            var str_data = '';
            for (let key in data) {
                if (typeof(data[key]) !== 'undefined' && data[key] !== null) {
                    str_data += key + '=' + data[key] + '&';
                }
            }
            if (str_data.length > 0) {
                str_data = str_data.substring(0, str_data.length - 1);
                str_data = str_data.replace(/\+/g,"%2B");
            }
            return str_data;
        }
        return data;
    },
    /* fetch 网络请求数据
     * @param String url  请求地址
     * @param String type 请求方式： get / post
     * @param Object data 请求参数
     * @param function callback 回调函数
     * @param function load_error 返回加载状态或错误状态 
     * @param Object load_error_config 返回加载状态或错误状态的配置
     */
    fetch: function (url, type, data, callback, load_error = null, load_error_config = {}) {
        var fetchOptions = {};
        var str_data = this.createJson(data) || '';
        if(load_error && !load_error_config.hideLoad) {
            load_error && load_error(Loading({...load_error_config}), 'load');
        }

        //判断请求方式
        if (type.toUpperCase() == 'POST') {
            fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: str_data
            };
        }else {
            url += '?' + str_data;
            url = encodeURI(url);
        }
        
        let fetchFunc = () => this.fetch(url, type, data, callback, load_error, load_error_config);
        load_error_config.fetchFunc = fetchFunc;
        try {
            fetch(url, fetchOptions)
            .then((response) => {
                if(callback && response && response.status == '200') return response.json();
            })
            .then((responseText) => {
                // load_error && load_error(null);
                callback && callback(responseText);
            })
            .catch((error1) => {
                console.log(error1)
                if(load_error) {
                    load_error(ErrorView(load_error_config, fetchFunc), 'error');
                }else if(load_error_config.catchFunc) {
                    load_error_config.catchFunc(error1);
                }
            });
        } catch(error2) {
            console.error(error2);
            load_error_config.errText2 = Lang[Lang.default].programError;
            load_error && load_error(ErrorView(load_error_config, fetchFunc), 'error');
        }
    },

    //仅用于异步请求 (async / await)
    async_fetch: function (url, type, data) {
        let str_param = this.createJson(data) || '';
        let head = {};
        if(type.toUpperCase() == 'POST') {
            head.body = str_param;
            head.method = 'POST';
            head.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            };
        }else {
            url += '?' + str_param;
            url = encodeURI(url);
        }
        return fetch(url, head)
        .then((response) => response.json())
        .then((responseText) => {
            return responseText;
        })
        .catch((error) => {
            return null;
        });
    },

    //网络请求出错
    fetchError: function (err, data) {
        if (err) {
            console.log(err);
        }
    },

    //检查手机格式
    checkMobile: function (mobile) {
        let ret = /^1[34578]\d{9}$/.test(mobile);
        return ret;
    },

    //去除前后空格
    trim: function (str) {
        let _str = str;
        if(str) {
            _str = str.replace(/(^\s*)|(\s*$)/g, "");
        }
        return _str;
    },

    //替换多个字符串
    replaces: function(str, ...args) {
        if(str) {
            for(let a of args) {
                str = str.replace(/%s/, a);
            }
        }
        return str;
    },

    // 格式“yyyy-MM-dd HH:MM:SS”
    /*
     * 获取指定的日期时间
     * type = 1 时，返回  yyyy-MM-dd HH:MM:SS
     * type = 2 时，返回 yyyy-MM-dd
     */
    getFormatDate: function (date, type) {
        if (date) {
            date = new Date(date);
        }
        else {
            date = new Date();
        }

        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var currentdate;
        var DD = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        month = month < 10 ? DD[month] : month;
        day = day < 10 ? DD[day] : day;
        hour = hour < 10 ? DD[hour] : hour;
        minute = minute < 10 ? DD[minute] : minute;
        second = second < 10 ? DD[second] : second;

        if (type == 1) {
            currentdate = date.getFullYear() + seperator1 + month + seperator1
                + day + " " + hour + seperator2 + minute + seperator2 + second;
        }
        else if (type == 2) {
            currentdate = date.getFullYear() + seperator1 + month + seperator1 + day;
        }
        else {
            currentdate = '';
        }

        return currentdate;
    },
};

var styles = StyleSheet.create({
    bodyView : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: Color.lightGrey,
    },
    modalBody : {
        height: Size.width * 0.25,
        minWidth: Size.width * 0.26,
        maxWidth: Size.width * 0.8,
        // flexDirection : 'row',
		alignItems: 'center',
        justifyContent: 'center',
        borderWidth : pixel,
        borderColor : '#aaa',
		backgroundColor : 'rgba(0, 0, 0, 0.7)',
		borderRadius : 8,
        // paddingVertical: 30,    //上下内边距
        paddingHorizontal: 20,  //左右内边距
	},
	modalText : {
		color : '#fff',
        fontSize : 14,
        paddingTop: 15,
	},
});

export default Util;