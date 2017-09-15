/**
 * 商品模块
 * @auther linzeyong
 * @date   2017.06.02
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import { CachedImage } from "react-native-img-cache";
import PropTypes from 'prop-types';
import Urls from '../public/apiUrl';
import { PX, Color, pixel } from '../public/globalStyle';
import Lang, { str_replace } from '../public/language';

export default class ProductItem extends Component {
    // 默认参数
    static defaultProps = {
        width: PX.productWidth1,
        product: null,
        showDiscount: false,
    };
    // 参数类型
    static propTypes = {
        width: PropTypes.number,
        bottomHeight: PropTypes.number,
        product: PropTypes.object,
        showDiscount: PropTypes.bool,
    };

    render() {
        let {
            product, 
            panicBuying, 
            width, 
            height, 
            boxStyle, 
            goodNameViewStyle, 
            goodNameStyle, 
            goodPriceStyle, 
            showDiscount,
            showLimit,
            navigation,
        } = this.props;
        if(!product) return null;
        let gid = product.gID || 0;
        let type = product.num || 0;
        let gimg = product.gThumBPic || (product.gThumbPic ? product.gThumbPic : null);
        let name = product.gName || '';
        let isLimit = product.aStatus == 1 ? true : false;
        let gPrice = parseFloat(product.gPrices) || '';
        let dPrice = panicBuying ? parseFloat(product.pbgPrice) : parseFloat(product.gDiscountPrice);
        let discount = (gPrice && dPrice && gPrice > 0 && dPrice > 0) ? (dPrice / gPrice).toFixed(2) : null;
        height = height ? height : width;
        
        if(type == 0) {
            let aimg = product.adImg || '';
            if(aimg) gimg = aimg;
        }
        if(gimg && gimg.indexOf('http') !== 0) gimg = Urls.host + gimg;
        let img = gimg ? {uri: gimg} : require('../../images/empty.jpg');
        return (
            <TouchableOpacity activeOpacity={1} onPress={()=>{
                if(gid > 0 && navigation) {
                    navigation.navigate('Product', {gid: gid});
                }else {
                    let type = product.adType || -1;
                    let id = product.adUrl || null;
                    if(navigation && id && type == 1) {
                        navigation.navigate('Product', {gid: id});
                    }else if(navigation && id && type == 0) {
                        navigation.navigate('Shop', {shopID: id});
                    }
                }
            }}>
                <View style={[styles.productBox, {width: width}, boxStyle]}>
                    <View style={[styles.gImageBox, {
                        width: width - 1,
                        height: height - 1,
                    }]}>
                        <CachedImage source={img} style={{
                            width: width - 1,
                            height: height - 1,
                        }} />
                    </View>
                    <View style={[styles.goodNameView, goodNameViewStyle]}>
                        <Text style={[styles.goodNameText, goodNameStyle]} numberOfLines={1}>
                            {name}
                        </Text>
                    </View>
                    <View style={[styles.gPriceBox, goodPriceStyle]}>
                        {dPrice ?
                            <Text style={styles.priceFH}>{Lang[Lang.default].RMB}</Text>
                            : null
                        }
                        <Text style={styles.gprice1}>{dPrice}</Text>
                        <Text style={styles.gprice2}>{gPrice}</Text>
                        {(showDiscount && discount && discount > 0 && discount < 1) ?
                            <View style={styles.discountView}>
                                <Text style={styles.discountText}>
                                    {isLimit ?
                                        Lang[Lang.default].timeLimit :
                                        str_replace(Lang[Lang.default].discount, (discount * 10).toFixed(1))
                                    }
                                </Text>
                            </View>
                            : null
                        }
                        {showLimit && isLimit ?
                            <View style={styles.discountView}>
                                <Text style={styles.discountText}>
                                    {Lang[Lang.default].timeLimit}
                                </Text>
                            </View>
                            : null
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

var styles = StyleSheet.create({
    productBox: {
        borderWidth : pixel,
        borderColor : Color.lavender,
        backgroundColor: '#fff',
        borderRadius: 2,
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: {'height': 0.5,},
        elevation: 3,
        margin: 1,
    },
    gImageBox: {
        borderBottomColor : Color.lavender,
        borderBottomWidth : pixel,
        backgroundColor: Color.floralWhite,
    },
    goodNameView: {
        height: 30,
        justifyContent: 'center',
    },
    goodNameText: {
        paddingLeft: 10,
        paddingRight: 2,
        fontSize: 13,
    },
    gPriceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        height: 35,
    },
    discountView: {
        minWidth: 30,
        height: 17,
        position: 'absolute',
        right: 5,
        top: 8,
        backgroundColor: Color.red,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    discountText: {
        paddingLeft: 6,
        paddingRight: 6,
        color: '#fff',
        fontSize: 10,
    },
    priceFH: {
        fontSize : 12,
        color : Color.red,
        paddingLeft: 2,
    },
    gprice1: {
        fontSize: 15,
        color: Color.red,
    },
    gprice2: {
        fontSize: 12,
        color: Color.gainsboro,
        paddingLeft: 6,
        paddingTop: 3,
        textDecorationLine: 'line-through',
    },
});