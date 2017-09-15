/**
 * 带有推荐商品的列表框架
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
    FlatList,
} from 'react-native';

import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import ProductItem from './ProductItem';

export default class ListViewFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodList: null,     //猜你喜欢的商品列表
        };
        this.page = 1;
        this.pageNumber = 10;
        this.ref_flatList = null;
        this.loadMoreLock = false;
    }

    componentDidMount() {
        this.getProductList();
    }

    componentWillUnmount() {
        this.ref_flatList = null;
    }

    // 加载商品列表
    getProductList = () => {
        if(!this.loadMoreLock) {
            let that = this;
            this.loadMoreLock = true;
            Utils.fetch(Urls.getRecommendList, 'get', {
                pPage: this.page, 
                pPerNum: this.pageNumber,
            }, (result) => {
                if(result && result.sTatus && result.proAry && result.proAry.length) {
                    let oldList = that.state.goodList || [];
                    let goodList = oldList.concat(result.proAry);
                    that.page++;
                    that.setState({ goodList }, ()=>that.loadMoreLock = false);
                }
            }, null, {
                catchFunc: (err)=>{console.log(err)}
            });
        }
    };

    render() {
        if(!this.state.goodList) return null;
        let { listStyle, getListEment, get_list_ref, } = this.props;
        return (
            <FlatList
                ref={(_ref)=>{
                    if(_ref) {
                        this.ref_flatList=_ref;
                        get_list_ref && get_list_ref(_ref);
                        getListEment && getListEment(this);
                    }
                }}
                data={this.state.goodList}
                numColumns={2}
                contentContainerStyle={listStyle}
                keyExtractor={(item, index)=>(index)}
                enableEmptySections={true}
                renderItem={this._renderItem}
                ListHeaderComponent={this.pageHead}
                onEndReached={this.getProductList}
            />
        );
    }

    //页面头部
    pageHead = () => {
        let { headStyle, listHead } = this.props;
        return (
            <View style={[styles.flatlist, headStyle]}>
                {listHead}
                <View style={styles.goodlistTop}>
                    <View style={styles.goodTopLine}></View>
                    <View>
                        <Text style={styles.goodlistTopText}>{Lang[Lang.default].recommendGoods}</Text>
                    </View>
                    <View style={styles.goodTopLine}></View>
                </View>
            </View>
        );
    };

    //猜你喜欢商品
    _renderItem = ({item, index}) => {
        return (
            <ProductItem 
                product={item} 
                key={index}
                showDiscount={true}
                width={(Size.width - 20) / 2}
                navigation={this.props.navigation}
                boxStyle={{
                    marginLeft: 5,
                    marginRight: 5,
                    marginBottom: 8,
                }}
            />
        );
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    flatlist: {
        backgroundColor: Color.lightGrey,
    },
    goodlistTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: PX.rowHeight1 + PX.marginTB,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        backgroundColor: '#fff',
        paddingBottom: PX.marginTB,
    },
    goodTopLine: {
        flex: 1,
        borderBottomWidth: pixel,
        borderBottomColor: Color.mainColor,
    },
    goodlistTopText: {
        fontSize: 16,
        color: Color.mainColor,
        paddingLeft: 25,
        paddingRight: 25,
    },
});