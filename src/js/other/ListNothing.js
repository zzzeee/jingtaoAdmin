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

import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import ListFrame from './ListViewFrame';

export default class ListNothing extends Component {
    listHeadView = () => {
        let { text, boxStyle, imageStyle, txtStyle, image } = this.props;
        let img = image ? image : require('../../images/home/no_result.png');
        return (
            <View style={[styles.centerStyle, boxStyle]}>
                <Image source={img} style={[styles.centerImage, imageStyle]}>
                    <Text numberOfLines={1} style={[styles.centerText, txtStyle]}>{text}</Text>
                </Image>
            </View>
        );
    };

    render() {
        let { navigation, getListEment, get_list_ref, } = this.props;
        return (
            <ListFrame
                listStyle={{backgroundColor: '#fff',}}
                listHead={this.listHeadView()}
                navigation={navigation}
                getListEment={getListEment}
                get_list_ref={get_list_ref}
            />
        );
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    centerStyle: {
        height: 245,
        backgroundColor: Color.lightGrey,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerImage: {
        height: 97,
        width: 185,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    centerText: {
        fontSize: 14,
        color: Color.gainsboro2,
    },
});