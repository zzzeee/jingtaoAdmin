/**
 * 商品推荐列表
 * @auther linzeyong
 * @date   2017.06.02
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
} from 'react-native';

import PropTypes from 'prop-types';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, PX, pixel, Color, errorStyles } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import ProductItem from '../other/ProductItem';

export default class ProductScreen extends Component {
    // 默认参数
    static defaultProps = {
        listHead: null,
        removeClippedSubviews: true,
    };
    // 参数类型
    static propTypes = {
        removeClippedSubviews: PropTypes.bool,
        onScroll: PropTypes.func,
    };
    constructor(props) {
        super(props);
        this.state = {
            goodList: [],
        };
        this.page = 1;
        this.pageNumber = 10;
    }

    componentDidMount() {
        this.getDatas();
    }

    //初始化数据
    getDatas = () => {
        Utils.fetch(Urls.getRecommendList, 'get', {
            pPage: this.page, 
            pPerNum: this.pageNumber,
        }, function(result) {
            if(result && result.sTatus && result.proAry && result.proAry.length) {
                state.goodList = list.proAry;
                this.page++;
                this.setState({goodList: esult.proAry});
            }
        });
    };

    render() {
        let { onScroll, removeClippedSubviews } = this.props;
        return (
            <FlatList
                ref={(_ref)=>this.ref_flatList=_ref} 
                data={this.state.goodList}
                numColumns={2}
                onScroll={onScroll}
                removeClippedSubviews={removeClippedSubviews}
                contentContainerStyle={styles.flatListStyle}
                keyExtractor={(item, index) => (index)}
                enableEmptySections={true}
                renderItem={this._renderItem}
                ListHeaderComponent={this.pageHead}
                onEndReached={()=>{
                    console.log('加载更多');
                    // this.loadMore();
                }}
            />
        );
    }

    //页面头部 - 商品详情
    pageHead = () => {
        return (
            <View>
                {this.props.listHead}
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
    goodlistTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: PX.rowHeight1,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        marginTop: PX.marginTB,
        backgroundColor: '#fff',
    },
    goodTopLine: {
        flex: 1,
        height: 0,
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