/**
 * 购物车 - 提交订单/订单列表 - 商品
 * @auther linzeyong
 * @date   2017.05.02
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

export default class OrderGood extends Component {
    render() {
        let { good, onPress } = this.props;
        if(!good) return null;
        let goodImgUrl = good.gPicture || null;
        if(!goodImgUrl) goodImgUrl = good.gThumbPic || null;
        let goodImg = goodImgUrl ? {uri: goodImgUrl} : require('../../images/empty.jpg');
        let goodName = good.gName || null;
        let goodAttr = good.mcAttr || null;
        let goodPrice = parseFloat(good.gPrice) || 0;
        let martPrice = parseFloat(good.gShopPrice) || 0;
        let goodNumber = good.gNum || 0;
        let isLimit = good.aStatus == 1 ? true : false;
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={1} style={styles.goodItemBox}>
                <Image source={goodImg} style={styles.goodImageStyle} />
                <View style={styles.goodRightBox}>
                    <Text style={styles.goodNameStyle}>{goodName}</Text>
                    <Text style={styles.goodAttrStyle}>{'规格: ' + goodAttr}</Text>
                    <View style={[styles.rowViewStyle, {justifyContent: 'space-between'}]}>
                        <View style={styles.rowViewStyle}>
                            <Text style={styles.goodPriceStyle}>{'¥' + goodPrice}</Text>
                            <Text style={[styles.goodAttrStyle, {
                                paddingRight: 10,
                                textDecorationLine: 'line-through',
                            }]}>{martPrice}</Text>
                            {isLimit ?
                                <Text style={styles.timeLimit}>限时</Text>
                                : null
                            }
                        </View>
                        <Text style={styles.goodNameStyle}>{'× ' + goodNumber}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    rowViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goodItemBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 3,
        backgroundColor: '#F3F4F8',
    },
    goodImageStyle: {
        width: 90,
        height: 90,
    },
    goodRightBox: {
        flex: 1,
        height: 90,
        marginLeft: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 3,
        paddingBottom: 3,
    },
    goodNameStyle: {
        fontSize: 14,
        color: Color.mainFontColor,
    },
    goodAttrStyle: {
        fontSize: 12,
        color: Color.grayFontColor,
    },
    goodPriceStyle: {
        fontSize: 16,
        color: Color.redFontColor,
        paddingRight: 10,
    },
    timeLimit: {
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 2,
        color: '#fff',
        fontSize: 12,
        backgroundColor: Color.redFontColor,
    },
});