/**
 * 全局样式
 * @auther linzeyong
 * @date   2017.04.18
 */

import React from 'react';
import {
  StyleSheet,
  Dimensions,
  PixelRatio,
} from 'react-native';

//屏幕尺寸
export const Size = Dimensions.get('window');

//细线
export const pixel = 1 / PixelRatio.get();

//其他样式尺寸
export const PX = {
    statusHeight: 20,       //状态栏高
    marginLR: 15,           //距左右边的距离
    marginTB: 10,           //距上下边的距离
    mapHeight: (Size.width - 30) * 0.791 + 92,  //地图高
    productWidth1: 174,     //产品尺寸(首页)
    headHeight: 50,         //标题栏高
    headIconSize: 26,       //标题栏图标大小
    tabHeight: 50,          //导航栏高
    tabIconSize: 26,        //导航栏图标大小
    userTopHeight: 160,     //个人中心顶部大背景
    userHeadImgSize: 66,    //个人中心头像大小
    integralDiskSize: 130,  //个人中心 - 我的积分 内的圆盘大小
    shopItemHeight: 320,    //发现 - 单个商家的大小
    iconSize26: 26,         //图标大小 26
    rowHeight1: 50,         //50的行高 适用于正文行
    rowHeight2: 44,         //44的行高 适用于列表行
};

//APP字体大小
export const FontSize = {
    defaultFontSize: 14,
    headFontSize: 16,
    headFontWeight: '600',
    integralNumber: 22,
};

//APP样式颜色
export const Color = {
    mainColor : '#E55645', //主色
    yellow: '#FFCF5B',
    orange: '#FA903C',
    orangeRed: '#E55645',
    red: '#D52438',         //警告、强调
    royalBlue: '#3979F3',
    steelBlue: '#1B87F5',
    blue: '#3453DB',
    lightBack: '#4A4A4A',   //默认/正常 字体
    gainsboro: '#9097A0',   //浅色字体
    gainsboro2: '#9B9B9B',
    gray:'#B3B7BE',         //取消、隐藏
    lightGrey:'#CED0D4',    //主背景色
    floralWhite:'#EFEFEF',  //浅背景色
    lavender:'#E7E7E7',     //描边
};

//网络出错的样式
export const errorStyles = StyleSheet.create({
    bodyView : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.lightGrey,
    },
    refaceBtn : {
		backgroundColor : '#ccc',
		borderWidth : 1,
		borderColor : '#888',
		minWidth : 80,
		marginBottom : 20,
		borderRadius : 8,
		padding : 10,
        fontSize: 14,
	},
    errRemind: {
        fontSize: 12,
    },
});
