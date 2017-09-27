/**
 * 个人中心 - 我的订单 - 订单详情 - 物流信息
 * @auther linzeyong
 * @date   2017.06.28
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import Utils from '../public/utils';
import Urls from '../public/adminApiUrl';
import { Size, pixel } from '../public/globalStyle';
import { Color } from '../public/theme';
import Lang, {str_replace} from '../public/language';
import AppHead from '../public/AppHead';

export default class OrderLogistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logistics: null,
        };
        this.mToken = null;
        this.expressNum = null;
        this.ref_flatList = null;
    }

    componentWillMount() {
        this.initDatas();
    }

    componentDidMount() {
        this.getLogisticsData();
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { Logistics, mToken, expressNum, } = params;
            this.mToken = mToken;
            this.expressNum = expressNum;
            if(Logistics && Logistics.data) {
                this.setState({
                     logistics: Logistics,
                });
            }
        }
    };

    //获取物流数据
    getLogisticsData = () => {
        if(!this.state.logistics && this.mToken && this.expressNum) {
            Utils.fetch(Urls.getExpressInfo, 'post', {
                sToken: this.mToken,
                exPressNum: this.expressNum
            }, (result)=>{
                console.log(result);
                if(result && result.sTatus == 1) {
                    let express = result.exPreAy || null;
                    let info = express && express.showapi_res_body ? express.showapi_res_body : {};
                    this.setState({logistics: info});
                }
            });
        }
    };

    render() {
        let { navigation, } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead 
                    title={'物流信息'}
                    goBack={true}
                    navigation={navigation}
                    onPress={()=>this.ref_flatList.scrollTo({x: 0, y: 0, animated: true})}
                />
                <View style={styles.flex}>
                    {this.state.logistics ?
                        this.listHeadView() : this.notDataView()
                    }
                </View>
            </View>
        );
    }

    //物流轨迹视图
    listHeadView = () => {
        let logistics = this.state.logistics || {};
        let expressData = logistics.data || [];
        let expressNum = logistics.mailNo || '';
        let expressName = (!logistics.flag && logistics.msg) ? logistics.msg : ('物流公司: ' + logistics.expTextName || '');
        return (
            <ScrollView 
                ref={(_ref)=>this.ref_flatList=_ref}
                contentContainerStyle={styles.scrollStyle}
            >
                <View style={styles.sessionBox}>
                    <Text style={styles.defaultFont} numberOfLines={1}>
                        {'物流单号: ' + expressNum}
                    </Text>
                    <Text style={styles.defaultFont}>
                        {expressName}
                    </Text>
                </View>
                {expressData.length > 0 ?
                    <View style={styles.expressDataBox}>
                        {expressData.map((item, index)=>{
                            let img = index == 0 ? 
                                require('../../images/order/red_circle.png') :
                                require('../../images/order/gray_circle.png');
                            let content = item.context || '';
                            let time = item.time || '';
                            return (
                                <View key={index} style={styles.itemBox}>
                                    <View style={styles.itemLeft}>
                                        <View style={styles.bgLineStyle} />
                                        <Image source={img} style={styles.circleStyle} />
                                    </View>
                                    <View style={styles.itemRight}>
                                        <Text numberOfLines={2} style={{
                                            color: index == 0 ? Color.mainColor : Color.mainFontColor,
                                            fontSize: 13,
                                            lineHeight: 17,
                                        }}>{content}</Text>
                                        <Text numberOfLines={1} style={{
                                            color: index == 0 ? Color.mainColor : Color.grayFontColor,
                                            fontSize: 12,
                                        }}>{time}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    : this.notDataView()
                    
                }
            </ScrollView>
        );
    };

    //无物流数据视图
    notDataView = () => {
        return (
            <View style={styles.centerStyle}>
                <Image source={require('../../images/order/no_logistics.png')} style={styles.centerImage} />
                <Text numberOfLines={1} style={styles.centerText}>暂无物流信息</Text>
            </View>
        );
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    scrollStyle: {
        paddingTop: 10,
    },
    sessionBox: {
        backgroundColor: '#fff',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 13,
        paddingBottom: 12,
        justifyContent: 'space-between',
    },
    defaultFont: {
        fontSize: 13,
        color: Color.mainFontColor,
    },
    expressDataBox: {
        marginTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    itemBox: {
        height: 80,
        flexDirection: 'row',
    },
    itemLeft: {
        width: 40,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgLineStyle: {
        height: 80,
        borderRightWidth: pixel,
        borderRightColor: Color.borderColor,
    },
    circleStyle: {
        position: 'absolute',
        left: 12,
        top: 10,
        width: 16,
        height: 16,
    },
    itemRight: {
        width: Size.width - 40,
        paddingTop: 10,
        paddingRight: 15,
        paddingBottom: 8,
        justifyContent: 'space-between',
        borderBottomWidth: pixel,
        borderBottomColor: Color.borderColor,
    },
    centerStyle: {
        marginTop: Size.height * 0.2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerImage: {
        width: 110,
        height: 110,
    },
    centerText: {
        marginTop: 10,
        fontSize: 14,
        color: Color.mainColor,
    },
});