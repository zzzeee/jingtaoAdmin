/**
 * 个人中心 - 我的优惠券
 * @auther linzeyong
 * @date   2017.06.12
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Animated,
} from 'react-native';

import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import CouponItem from '../other/CouponItem';

export default class CouponList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coupons: [],
            leftValue: new Animated.Value(0),
        };
        this.selectIndex = 0;
        this.mToken = null;
        this.uCouponsIDs = [];
    }

    componentWillMount() {
        this.mToken = (this.props.navigation && 
            this.props.navigation.state &&
            this.props.navigation.state.params && 
            this.props.navigation.state.params.mToken) ?
            this.props.navigation.state.params.mToken : null;
    }

    componentDidMount() {
        this.initDatas();
    }

    initDatas = (use = null, expire = null) => {
        if(this.mToken) {
            let that = this;
            let obj = {mToken: this.mToken};
            if(use) obj.cUse = use;
            if(expire) obj.cStatus = expire;
            Utils.fetch(Urls.getUserCoupons, 'post', obj, (result)=>{
                console.log(result);
                if(result && result.sTatus && result.couponAry) {
                    let coupons = result.couponAry || [];
                    for(let i in coupons) that.uCouponsIDs.push(coupons[i].hId);
                    that.setState({ coupons });
                }
            });
        }
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].myCoupons}
                    goBack={true}
                    navigation={navigation}
                    onPress={() => {
                        this.ref_flatList && this.ref_flatList.scrollToOffset({offset: 0, animated: true});
                    }}
                />
                {this.mToken && this.state.coupons ?
                    <FlatList
                        ref={(_ref)=>this.ref_flatList=_ref} 
                        data={this.state.coupons}
                        contentContainerStyle={styles.flatListStyle}
                        keyExtractor={(item, index) => (index)}
                        enableEmptySections={true}
                        renderItem={this._renderItem}
                        ListHeaderComponent={this.pageHead}
                    />
                    : null
                }
            </View>
        );
    }

    changeSelect = (index) => {
        let left, use, expire;
        if(index == 0) {
            left = 0;
            use = 1;
            expire = 1;
        }else if(index == 1) {
            left = Size.width / 3;
            use = 2;
            expire = null;
        }else if(index == 2) {
            left = (Size.width / 3) * 2;
            use = 1;
            expire = 2;
        }
        this.selectIndex = index;
        Animated.timing(this.state.leftValue, {
            toValue: left,
            duration: 250,
        }).start();
        this.initDatas(use, expire);
    };

    pageHead = () => {
        return (
            <View style={styles.btnRowBg}>
                <View style={styles.btnRowTopBg}></View>
                <View style={styles.btnRowBottomBg}></View>
                <Animated.View style={[styles.animatedBg, {
                    left: this.state.leftValue,
                }]}>
                    <View  style={styles.animatedTopBg}></View>
                    <View  style={styles.animatedBottomBg}></View>
                </Animated.View>
                <TouchableOpacity onPress={()=>this.changeSelect(0)} style={[styles.btnItemBox, {left: 0}]}>
                    <Text style={styles.btnItemText}>{Lang[Lang.default].notUsed}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.changeSelect(1)} style={[styles.btnItemBox, {left: Size.width / 3}]}>
                    <Text style={styles.btnItemText}>{Lang[Lang.default].alreadyInUse}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.changeSelect(2)} style={[styles.btnItemBox, {right: 0}]}>
                    <Text style={styles.btnItemText}>{Lang[Lang.default].expired}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    _renderItem = ({item, index}) => {
        return (
            <View style={styles.couponRow}>
                <CouponItem
                    type={2}
                    width={Size.width * 0.907}
                    coupon={item}
                    userCoupons={this.uCouponsIDs}
                    clearOverImg={this.selectIndex == 0 ? true : false}
                />
            </View>
        );
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flatListStyle: {
        backgroundColor: '#fff',
    },
    btnRowBg: {
        width: Size.width,
        height: PX.rowHeight1,
        marginBottom: PX.marginLR,
    },
    btnRowTopBg: {
        width: Size.width,
        height: PX.rowHeight2,
        backgroundColor: Color.lightGrey,
    },
    btnRowBottomBg: {
        flex: 1,
        backgroundColor: '#fff',
    },
    animatedBg: {
        position: 'absolute',
        top: 0,
        height: PX.rowHeight2 + 5,
        alignItems: 'center',
    },
    animatedTopBg: {
        width: Size.width / 3,
        height: PX.rowHeight2,
        backgroundColor: Color.mainColor,
    },
    animatedBottomBg: {
        width: 0,
        height: 0,
        borderWidth: 5,
        borderColor: 'transparent',
        borderTopColor: Color.mainColor,
    },
    btnItemBox: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: Size.width / 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnItemText: {
        color: '#fff',
        fontSize: 14,
        backgroundColor: 'transparent',
    },
    couponRow: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
});