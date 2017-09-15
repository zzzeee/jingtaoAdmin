/**
 * 公用小组件 (列表到底提示，正在加载视图，加载错误等)
 * @auther linzeyong
 * @date   2017.06.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import Lang, {str_replace} from '../public/language';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';

//列表到底
export const EndView = ({style,}) => (
    <View style={[styles.endBox, style]}>
        <Text style={styles.grayText}>{Lang[Lang.default].inTheEnd + 'O(∩_∩)O'}</Text>
    </View>
);

const styles = StyleSheet.create({
    endBox: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: Color.floralWhite,
    },
    grayText: {
        color: Color.gainsboro,
        fontSize: 14,
    },
});