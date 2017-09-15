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
} from 'react-native';

import Utils from '../../public/utils';
import Urls from '../../public/apiUrl';
import { Size, PX, pixel, Color } from '../../public/globalStyle';
import Lang, {str_replace} from '../../public/language';
import ListFrame from '../../other/ListViewFrame';
import { NavigationActions } from 'react-navigation';
import AppHead from '../../public/AppHead';

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

    getLogisticsData = () => {
        if(!this.state.logistics && this.mToken && this.expressNum) {
            Utils.fetch(Urls.getLogisticsInfo, 'post', {
                mToken: this.mToken,
                exPressNum: this.expressNum
            }, (result)=>{
                if(result && result.sTatus == 1) {
                    let express = result.exPreAy || null;
                    if(express && express.showapi_res_body) {
                        this.setState({
                            logistics: express.showapi_res_body,
                        });
                    }else {
                        this.setState({logistics: [], });
                    }
                }
            });
        }
    };

    render() {
        let { navigation, } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead 
                    title={Lang[Lang.default].logisticsInfo}
                    goBack={true}
                    navigation={navigation}
                    onPress={()=>this.ref_flatList.scrollToOffset({offset: 0, animated: true})}
                />
                {this.state.logistics ?
                    <View style={styles.flex}>
                        <ListFrame
                            listHead={this.listHeadView()}
                            navigation={navigation}
                            get_list_ref={(ref)=>this.ref_flatList=ref}
                        />
                    </View>
                    : null
                }
            </View>
        );
    }

    listHeadView = () => {
        let logistics = this.state.logistics || {};
        let expressData = logistics.data || [];
        let expressNum = logistics.mailNo || '';
        let expressName = logistics.expTextName || '';
        return (
            <View style={styles.container}>
                <View style={styles.sessionBox}>
                    <Text style={styles.defaultFont} numberOfLines={1}>
                        {Lang[Lang.default].expressNumber + ': ' + expressNum}
                    </Text>
                    <Text style={styles.defaultFont} numberOfLines={1}>
                        {Lang[Lang.default].expressName + ': ' + expressName}
                    </Text>
                </View>
                {expressData.length > 0 ?
                    <View style={styles.expressDataBox}>
                        {expressData.map((item, index)=>{
                            let img = index == 0 ? 
                                require('../../../images/personal/red_circle.png') :
                                require('../../../images/personal/gray_circle.png');
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
                                            color: index == 0 ? Color.mainColor : Color.lightBack,
                                            fontSize: 13,
                                            lineHeight: 17,
                                        }}>{content}</Text>
                                        <Text numberOfLines={1} style={{
                                            color: index == 0 ? Color.mainColor : Color.gray,
                                            fontSize: 12,
                                        }}>{time}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>:
                    <View style={styles.centerStyle}>
                        <Image source={require('../../../images/home/no_result.png')} style={styles.centerImage}>
                            <Text numberOfLines={1} style={styles.centerText}>{Lang[Lang.default].notExpressData}</Text>
                        </Image>
                    </View>
                }
            </View>
        );
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        marginTop: PX.marginTB,
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
        color: Color.lightBack,
    },
    expressDataBox: {
        marginTop: PX.marginTB,
        marginBottom: PX.marginTB,
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
        borderRightWidth: 1,
        borderRightColor: Color.lavender,
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
        borderBottomColor: Color.lavender,
    },
    centerStyle: {
        height: 245,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.lightGrey,
    },
    centerImage: {
        width: 185,
        height: 76,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    centerText: {
        fontSize: 14,
        color: Color.gainsboro2,
    },
});