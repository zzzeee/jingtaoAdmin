/**
 * 列表没有内容的框架
 * @auther linzeyong
 * @date   2017.06.22
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import { Size, pixel, } from '../public/globalStyle';
import { Color } from '../public/theme';

export default class ListNothing extends Component {
    render() {
        let { text, boxStyle, imageStyle, txtStyle, image } = this.props;
        let img = image ? image : require('../../images/order/no_result.png');
        return (
            <View style={[styles.centerStyle, boxStyle]}>
                <Image source={img} style={[styles.centerImage, imageStyle]} />
                <Text numberOfLines={1} style={[styles.centerText, txtStyle]}>{text}</Text>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    centerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerImage: {
        height: 110,
        width: 110,
    },
    centerText: {
        fontSize: 14,
        color: '#72A5F6',
        marginTop: 10,
    },
});