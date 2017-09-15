/**
 * 个人中心 - 我的地址
 * @auther linzeyong
 * @date   2017.06.13
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
    Alert,
} from 'react-native';

import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace, TABKEY} from '../public/language';
import AlertMoudle from '../other/AlertMoudle';

export default class AddressList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addresss: [],
            deleteAlert: false,
        };
        this.mToken = null;
        this.previou = null;
        this.carIDs = null;
        this.orderParam = null;
        this.alertObject = {};
    }

    componentWillMount() {
        this.initDatas();
    }

    componentDidMount() {
        this.getAddressList();
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { mToken, previou, carIDs, orderParam } = params;
            this.mToken = mToken || null;
            this.previou = previou || null;
            this.carIDs = carIDs || null;
            this.orderParam = orderParam || null;
        }
    };

    //获取地址列表
    getAddressList = () => {
        if(this.mToken) {
            let that = this;
            Utils.fetch(Urls.getUserAddressList, 'post', {
                mToken: this.mToken,
            }, (result)=>{
                console.log(result);
                if(result && result.sTatus && result.addressAry) {
                    let addresss = result.addressAry || [];
                    that.setState({ 
                        addresss: addresss,
                        deleteAlert: false,
                     });
                }
            });
        }
    };

    addNewAddress = () => {
        let { navigation } = this.props;
        if(this.mToken && navigation) {
            navigation.navigate('AddressAdd', {
                mToken: this.mToken,
                addressInfo: null,
                addressNum: this.state.addresss.length,
                previou: this.previou,
                carIDs: this.carIDs,
                orderParam: this.orderParam,
            });
        }
    };

    //隐藏删除提示框
    hideAlertMoudle = () => {
        this.setState({deleteAlert: false,});
    };

    //显示删除提示框
    showAlertMoudle = (said) => {
        this.alertObject = {
            text: Lang[Lang.default].deleteThisAddress,
            leftText: Lang[Lang.default].cancel,
            rightText: Lang[Lang.default].determine,
            leftColor: Color.lightBack,
            leftBgColor: '#fff',
            leftClick: this.hideAlertMoudle,
            rightClick: ()=>this.delUserAddress(said),
            rightColor: Color.lightBack,
            rightBgColor: '#fff',
        };
        this.setState({deleteAlert: true,});
    };

    delUserAddress = (said) => {
        if(said && this.mToken) {
            Utils.fetch(Urls.deleteUserAddress, 'post', {
                mToken: this.mToken,
                saID: said,
            }, (result) => {
                console.log(result);
                if(result && result.sTatus == 1) {
                    this.getAddressList();
                }
            });
        }
    };

    setDefaultAddress = (index, said) => {
        if(said && this.mToken) {
            let that = this;
            let addresss = this.state.addresss;
            Utils.fetch(Urls.editUserAddress, 'post', {
                mToken: this.mToken,
                saID: said,
                saSelected: 1,
            }, (result) => {
                console.log(result);
                if(result && result.sTatus == 1) {
                    for(let i in addresss) {
                        if(i == index) {
                            addresss[i].saSelected = 1;
                        }else {
                            addresss[i].saSelected = 0;
                        }
                    }
                    that.setState({ addresss });
                }
            });
        }
    };

    render() {
        let { navigation } = this.props;
        let that = this, scrollref = null;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].addressList}
                    goBack={true}
                    leftPress={()=>{
                        if(that.previou) {
                            navigation.goBack(null);
                        }else {
                            navigation.navigate('TabNav', {PathKey: TABKEY.personal});
                        }
                    }}
                    onPress={() => {
                        scrollref && scrollref.scrollTo({x: 0, y: 0, animated: true});
                    }}
                />
                <ScrollView contentContainerStyle={styles.scrollStyle} ref={(_ref)=>scrollref=_ref}>
                    {this.state.addresss.map((item, index) => {
                        let said = item.saID || null;
                        let name = item.saName || '';
                        let phone = item.saPhone || '';
                        let province = item.saProvince || '';
                        let city = item.saCity || '';
                        let regoin = item.saDistinct || '';
                        let address = item.saAddress || '';
                        let fullAddress = province + city + regoin + address;
                        let isSelect = (item.saSelected && item.saSelected != '0') ? 1 : 0;
                        let img = isSelect ? 
                            require("../../images/car/select.png") :
                            require("../../images/car/no_select.png");
                        return (
                            <TouchableOpacity key={index} onPress={()=>{
                                if(that.previou && said && that.previou == 'AddOrder') {
                                    navigation.navigate(that.previou, {
                                        mToken: that.mToken,
                                        carIDs: that.carIDs,
                                        orderParam: that.orderParam,
                                        addressID: said,
                                    });
                                }
                            }} style={styles.addressItem}>
                                <View style={styles.addressFristRow}>
                                    <Text numberOfLines={1} style={styles.defaultFont}>{name}</Text>
                                    <Text numberOfLines={1} style={styles.defaultFont}>{phone}</Text>
                                </View>
                                <View style={styles.addressMiddleRow}>
                                    <Text numberOfLines={3} style={styles.defaultFont}>{fullAddress}</Text>
                                </View>
                                <View style={styles.addressFootRow}>
                                    <View>
                                        <TouchableOpacity onPress={()=>{
                                            if(!isSelect && said) that.setDefaultAddress(index, said);
                                        }} style={{
                                            padding: 5,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                            <Image source={img} style={{
                                                width: 18,
                                                height: 18,
                                            }} />
                                            <Text style={styles.txtFont}>{Lang[Lang.default].setDefault}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.rowStyle}>
                                        <TouchableOpacity onPress={()=>{
                                            navigation.navigate('AddressAdd', {
                                                mToken: that.mToken,
                                                addressInfo: item,
                                                addressNum: that.state.addresss.length,
                                                previou: that.previou,
                                                carIDs: that.carIDs,
                                                orderParam: that.orderParam,
                                            });
                                        }} style={{
                                            padding: 5,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                            <Image source={require("../../images/edit.png")} style={{
                                                width: 16,
                                                height: 16,
                                            }} />
                                            <Text style={styles.txtFont}>{Lang[Lang.default].edit}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>that.showAlertMoudle(said)} style={{
                                            padding: 5,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginLeft: 20,
                                        }}>
                                            <Image source={require("../../images/delete.png")} style={{
                                                width: 16,
                                                height: 16,
                                            }} />
                                            <Text style={styles.txtFont}>{Lang[Lang.default].delete}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity onPress={this.addNewAddress} style={styles.btnAddAddress}>
                        <Image source={require('../../images/personal/add.png')} style={styles.addAddressImg} />
                        <Text style={styles.addAddressText}>{Lang[Lang.default].addAddress}</Text>
                    </TouchableOpacity>
                </ScrollView>
                {this.state.deleteAlert ?
                    <AlertMoudle visiable={this.state.deleteAlert} {...this.alertObject} />
                    : null
                }
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
        backgroundColor: Color.lightGrey,
    },
    defaultFont: {
        fontSize: 13,
        color: Color.lightBack,
        lineHeight: 19,
    },
    txtFont: {
        color: Color.lightBack,
        fontSize: 12,
        paddingLeft: 2,
    },
    rowStyle: {
        flexDirection: 'row',
    },
    scrollStyle: {
        // minHeight: Size.height - PX.statusHeight - PX.headHeight - 5,
    },
    addressItem: {
        width: Size.width,
        backgroundColor: '#fff',
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        marginTop: PX.marginTB,
        paddingTop: 5,
    },
    addressFristRow: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressMiddleRow: {
        minHeight: 50,
    },
    addressFootRow: {
        height: PX.rowHeight2,
        borderTopWidth: pixel,
        borderTopColor: Color.lavender,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btnAddAddress: {
        width: Size.width - (PX.marginLR * 2),
        height: PX.rowHeight2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: Color.mainColor,
        flexDirection: 'row',
        marginLeft: PX.marginLR,
        marginBottom: PX.marginTB,
        marginTop: 50,
    },
    addAddressImg: {
        width: 20,
        height: 20,
    },
    addAddressText: {
        paddingLeft: 8,
        fontSize: 13,
        color: '#fff',
    },
});