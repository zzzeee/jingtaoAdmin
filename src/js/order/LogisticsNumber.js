/**
 * 订单 - 物流号填写页
 * @auther linzeyong
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';

import Toast from 'react-native-root-toast';
import { Size, pixel } from '../public/globalStyle';
import { Color } from '../public/theme';
import InputText from '../public/InputText';
import AppHead from '../public/AppHead';
import Utils from '../public/utils';
import Urls from '../public/adminApiUrl';

export default class LogisticsNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            canQuery: true,
            logistyNumber: null,
            logistyCompany: null,
            isRefreshing: false,
        };
        this.params = null;
    }

    componentWillMount() {
        this.initDatas();
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            this.params = navigation.state.params || {};
            if(!this.params.mToken) {
                navigation.navigate('Login', {
                    backTo: 'LogisticsNumber',
                });
            }else if(this.params.logistyNumber) {
                this.setState({
                    logistyNumber: this.params.logistyNumber,
                    isRefreshing: true,
                }, this.queryExpress);
            }
        }
    };

    //设置物流单号
    setLogistyNumber = (value) => {
        this.setState({
            canQuery: true,
            logistyNumber: value,
        });
    };

    //查询快递单号
    queryExpress = () => {
        let number = this.state.logistyNumber;
        if(this.params.mToken && number && this.state.canQuery) {
            if(this.state.isRefreshing) {
                Utils.fetch(Urls.getExpressInfo, 'post', {
                    sToken: this.params.mToken,
                    exPressNum: number,
                }, (result) => {
                    console.log(result);
                    let obj = {
                        canQuery: false,
                        isRefreshing: false,
                    };
                    if(result) {
                        if(result.sTatus == 1 && result.exPreAy) {
                            if(result.exPreAy.showapi_res_body && result.exPreAy.showapi_res_code == 0) {
                                let name = result.exPreAy.showapi_res_body.expTextName || null;
                                if(name) {
                                    obj.isError = false;
                                    obj.logistyCompany = name;
                                }
                            }else if(result.exPreAy.showapi_res_error) {
                                obj.isError = true;
                                obj.logistyCompany = '查询不到该物流单号';
                            }
                        }else {
                            obj.isError = true;
                            obj.logistyCompany = '输入错误';
                        }
                    }else {
                        obj.isError = true;
                        obj.logistyCompany = '输入错误';
                    }
                    this.setState(obj);
                });
            }else {
                this.setState({
                    isRefreshing: true,
                }, this.queryExpress);
            }
        }
    };

    //显示提示 
    showToast = (str) => {
        let toast = Toast.show(str, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            hideOnPress: true,
        });
    };

    //发货
    deliverGoods = () => {
        if(this.params.mToken && this.params.shopOrderNum && this.state.logistyNumber) {
            Utils.fetch(Urls.shopDeliverGoods, 'post', {
                sToken: this.params.mToken,
                exPressNum: this.state.logistyNumber,
                soID: this.params.shopOrderNum
            }, (result)=>{
                // console.log(result);
                if(result && result.sMessage) this.showToast(result.sMessage);
                if(result && result.sTatus == 1) {
                    this.params.selectIndex = 2;
                    this.params.isRefresh = true;
                    let _backTo = this.params.backTo || 'Order';
                    this.props.navigation.navigate(_backTo, this.params);
                }
            });
        }
    };

    render() {
        let { navigation } = this.props;
        let { logistyNumber, logistyCompany, isError, isRefreshing } = this.state;
        let number = logistyNumber || '';
        let company = logistyCompany || '输入物流单号自动识别快递公司';
        let color = isError ? Color.redFontColor : Color.grayFontColor;
        return (
            <View style={styles.flex}>
                <AppHead
                    title='发货页'
                    goBack={true}
                    navigation={navigation}
                    leftPress={()=>{
                        let _backTo = this.params.backTo || 'Order';
                        this.props.navigation.navigate(_backTo, this.params);
                    }}
                />
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    refreshControl={<RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={this.initPage}
                        title="释放立即刷新我..."
                        tintColor={Color.mainFontColor}
                        titleColor={Color.mainFontColor}
                    />}
                >
                    <View style={styles.itemBox}>
                        <View style={styles.textBox}>
                            <Text style={styles.itemTitle}>物流单号:</Text>
                        </View>
                        <View style={styles.inputBox}>
                            <InputText
                                vText={number}
                                onChange={this.setLogistyNumber}
                                length={32}
                                style={styles.inputStyle}
                                keyType={"numeric"}
                            />
                            <TouchableOpacity onPress={()=>{
                                navigation.navigate('Barcode', this.params);
                            }} style={styles.inputIcon}>
                                <Image style={styles.inputIconImg} source={require('../../images/order/barcode.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.itemBox}>
                        <View style={styles.textBox}>
                            <Text style={styles.itemTitle}>物流公司:</Text>
                        </View>
                        <TouchableOpacity style={styles.inputViewBox} onPress={this.queryExpress}>
                            <Text style={[styles.companyText, {
                                color: color,
                            }]}>{company}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.btnOk} onPress={this.deliverGoods}>
                        <Text style={styles.btnText}>确认发货</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    itemBox: {
        marginTop: 20,
        paddingLeft: 15,
        paddingRight: 15,
    },
    textBox: {
        height: 44,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 13,
        color: Color.mainFontColor,
    },
    inputViewBox: {
        height: 40,
        borderWidth: pixel,
        borderColor: Color.borderColor,
        borderRadius: 5,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    companyText: {
        fontSize: 12,
        color: Color.grayFontColor,
    },
    inputStyle: {
        height: 40,
        paddingHorizontal: 8,
    },
    inputIcon: {
        position: 'absolute',
        right: 0,
        top: 0,
        padding: 10,
    },
    inputIconImg: {
        width: 20,
        height: 20,
    },
    btnOk: {
        width: Size.width - 30,
        height: 44,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        backgroundColor: Color.mainColor,
        borderRadius: 3,
    },
    btnText: {
        fontSize: 16,
        color: '#fff',
    },
});