/**
 * 个人中心 - 我的地址 - 新增地址
 * @auther linzeyong
 * @date   2017.06.12
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';

import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import AddressArea from './AddressArea';
import InputText from '../public/InputText';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import ErrorAlert from '../other/ErrorAlert';

export default class AddressAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            areas: null,
            consignee: '',
            mobile: '',
            homeAddress: '',
            onFocusConsignee: false,
            onFocusMobile: false,
            onFocusHomeAddress: false,
            showAreas: false,
            showAlert: false,
            setDefault: true,
        };
        this.addressID = null;
        this.mToken = null;
        this.province = null;
        this.city = null;
        this.region = null;
        this.addressNum = 0;
        this.alertMsg = null;
        this.previou = null;
        this.carIDs = null;
        this.orderParam = null;
    }

    componentWillMount() {
        this.initDatas();
    }

    componentDidMount() {
        this.getAreaList();
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { mToken, addressInfo, addressNum, previou, carIDs, orderParam, } = params;
            this.mToken = mToken;
            this.previou = previou;
            this.carIDs = carIDs;
            this.orderParam = orderParam;
            this.addressNum = addressNum || 0;
            if(addressInfo) {
                this.addressID = addressInfo.saID || null;
                this.province = {
                    id: addressInfo.saProvinceID || null,
                    name: addressInfo.saProvince || null,
                };
                this.city = {
                    id: addressInfo.saCityID || null,
                    name: addressInfo.saCity || null,
                };
                this.region = {
                    id: addressInfo.saAreaID || null,
                    name: addressInfo.saDistinct || null,
                };
                this.setState({
                    consignee: addressInfo.saName || '',
                    mobile: addressInfo.saPhone || '',
                    homeAddress: addressInfo.saAddress || '',
                    setDefault: addressInfo.saSelected == 1 ? true : false,
                });
            }
        }
    };

    //获取地区列表
    getAreaList = () => {
        Utils.fetch(Urls.getAllAreas, 'post', {}, (result) => {
            if(result && result.sTatus && result.regionAry) {
                let areas = result.regionAry || [];
                this.setState({ areas });
            }
        });
    };

    //设置哪个输入框获得焦点
    setInputFocus = (key) => {
        let obj = null;
        if(key == 'name') {
            obj = {
                onFocusConsignee: true,
                onFocusMobile: false,
                onFocusHomeCity: false,
            };
        }else if(key == 'tel') {
            obj = {
                onFocusConsignee: false,
                onFocusMobile: true,
                onFocusHomeCity: false,
            };
        }else if(key == 'home') {
            obj = {
                onFocusConsignee: false,
                onFocusMobile: false,
                onFocusHomeAddress: true,
            };
        }
        if(obj) this.setState(obj);
    };

    //设置收货人名称
    setConsignee = (value) => {
        this.setState({consignee: value});
    };

    //设置手机号值
    setMobile = (value) => {
        this.setState({mobile: value});
    };

    //设置家庭地址
    setHomeAddress = (value) => {
        this.setState({homeAddress: value});
    };

    //显示地区列表
    showAreasBox = () => {
        this.setState({showAreas: true});
    };

    //隐藏地区列表
    hideAreasBox = () => {
        this.setState({showAreas: false});
    };

    //显示提示框
    showAutoModal = (msg) => {
        this.alertMsg = msg;
        this.setState({showAlert: true, });
    };

    //隐藏提示框
    hideAutoModal = () => {
        this.setState({ showAlert: false });
    };

    //获取选择的地区
    getSelectArea = (province, city, region) => {
        if(province && city && region) {
            this.province = province;
            this.city = city;
            this.region = region;
            this.hideAreasBox();
        }
    };

    //点击新增/修改地址
    clickAddAddress = () => {
        let name = this.state.consignee || null;
        let phone = this.state.mobile || null;
        let provinceID = (this.province && this.province.id) ? this.province.id : null;
        let cityID = (this.city && this.city.id) ? this.city.id : null;
        let regionID = (this.region && this.region.id) ? this.region.id : null;
        let address = this.state.homeAddress || null;
        if(!this.mToken) {
            this.showAutoModal(Lang[Lang.default].notUserToken);
        }else if(!name) {
            this.showAutoModal(Lang[Lang.default].inputConsigneeName);
        }else if(!phone) {
            this.showAutoModal(Lang[Lang.default].inputMobile);
        }else if(!/^1[34578]\d{9}$/.test(phone)) {
            this.showAutoModal(Lang[Lang.default].mobilePhoneFail);
        }else if(!provinceID || !provinceID || !regionID) {
            this.showAutoModal(Lang[Lang.default].selectAddressArea);
        }else if(!address) {
            this.showAutoModal(Lang[Lang.default].detailedAddress);
        }else {
            let provinceName = this.province.name || '';
            let cityName = this.city.name || '';
            let regionName = this.region.name || '';
            let url = Urls.addUserAddress;
            let obj = {
                mToken: this.mToken,
                saName: Utils.trim(name),
                saProvince: provinceName,
                saCity: cityName,
                saDistinct: regionName,
                saAddress: Utils.trim(address),
                saPhone: phone,
                saProvinceID: provinceID,
                saCityID: cityID,
                saAreaID: regionID,
                saSelected: this.state.setDefault ? 1 : 0,
            };
            if(this.addressID && this.addressID > 0) {
                obj.saID = this.addressID;
                url = Urls.editUserAddress;
            }
            Utils.fetch(url, 'post', obj, (result) => {
                if(result) {
                    if(result.sTatus == 1) {
                        this.props.navigation.navigate('AddressList', {
                            mToken: this.mToken,
                            previou: this.previou,
                            carIDs: this.carIDs,
                            orderParam: this.orderParam,
                        });
                    }else if(result.sMessage) {
                        this.showAutoModal(result.sMessage);
                    }
                }
            });
        }
    };

    render() {
        let { navigation } = this.props;
        let scrollref = null;
        let selectNames = null;
        if(this.province && this.city && this.region) {
            selectNames = this.province.name + ' ' + this.city.name + ' ' + this.region.name;
        }
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].addAddress}
                    goBack={true}
                    navigation={navigation}
                    onPress={() => {
                        scrollref && scrollref.scrollTo({x: 0, y: 0, animated: true});
                    }}
                />
                <View style={styles.flex}>
                    <ScrollView 
                        contentContainerStyle={styles.scrollStyle} 
                        ref={(_ref)=>scrollref = _ref}
                         keyboardShouldPersistTaps={'handled'}
                    >
                        <View style={styles.rowBox}>
                            <View style={styles.rowContent}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.defaultFont}>{Lang[Lang.default].consignee}</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <InputText
                                        vText={this.state.consignee}
                                        onChange={this.setConsignee} 
                                        isPWD={false} 
                                        length={20}
                                        style={styles.inputStyle}
                                        onFocus={()=>this.setInputFocus('name')}
                                    />
                                </View>
                                <View style={styles.inputClearBox}>
                                    {(this.state.consignee && this.state.onFocusConsignee) ?
                                        <TouchableOpacity style={styles.btnStyle} onPress={()=>this.setConsignee('')}>
                                            <Image source={require('../../images/login/close.png')} style={styles.iconSize18} />
                                        </TouchableOpacity>
                                        : null
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={styles.rowBox}>
                            <View style={styles.rowContent}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.defaultFont}>{Lang[Lang.default].contactMobile}</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <InputText
                                        vText={this.state.mobile}
                                        onChange={this.setMobile} 
                                        isPWD={false} 
                                        length={11}
                                        style={styles.inputStyle}
                                        keyType={"numeric"}
                                        onFocus={()=>this.setInputFocus('tel')}
                                    />
                                </View>
                                <View style={styles.inputClearBox}>
                                    {(this.state.mobile && this.state.onFocusMobile) ?
                                        <TouchableOpacity style={styles.btnStyle} onPress={()=>this.setMobile('')}>
                                            <Image source={require('../../images/login/close.png')} style={styles.iconSize18} />
                                        </TouchableOpacity>
                                        : null
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={styles.rowBox}>
                            <View style={styles.rowContent}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.defaultFont}>{Lang[Lang.default].homeAddress}</Text>
                                </View>
                                <TouchableOpacity onPress={this.showAreasBox} style={[styles.rowRight, {
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                    paddingRight: PX.marginLR,
                                    alignItems: 'center',
                                }]}>
                                    {selectNames ?
                                        <Text style={styles.defaultFont}>{selectNames}</Text> :
                                        <Text style={styles.grayFont}>{Lang[Lang.default].pleaseSelect}</Text>
                                    }
                                    <Image source={require('../../images/list_more.png')} style={styles.iconSize18} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.homeAddressBox}>
                            <View style={styles.rowRight}>
                                <InputText
                                    vText={this.state.homeAddress}
                                    pText={Lang[Lang.default].detailedAddress}
                                    onChange={this.setHomeAddress} 
                                    isPWD={false}
                                    multiline={true}
                                    length={80}
                                    style={styles.inputHomeAddress}
                                    onFocus={()=>this.setInputFocus('home')}
                                />
                            </View>
                            <View style={styles.inputClearBox}>
                                {(this.state.homeAddress && this.state.onFocusHomeAddress) ?
                                    <TouchableOpacity style={styles.btnStyle} onPress={()=>this.setHomeAddress('')}>
                                        <Image source={require('../../images/login/close.png')} style={styles.iconSize18} />
                                    </TouchableOpacity>
                                    : null
                                }
                            </View>
                        </View>
                        <View style={styles.setDefaultRow}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].setDefaultAddress}</Text>
                            <Switch 
                                onValueChange={(setDefault)=>this.setState({ setDefault })} 
                                disabled={this.addressNum > 0 ? false : true}
                                value={this.state.setDefault} 
                            />
                        </View>
                    </ScrollView>
                </View>
                <TouchableOpacity onPress={this.clickAddAddress} style={styles.btnAddAddress}>
                    <Text style={styles.saveAddressText}>{Lang[Lang.default].save}</Text>
                </TouchableOpacity>
                {this.state.areas ?
                    <AddressArea
                        areas={this.state.areas}
                        isShow={this.state.showAreas}
                        hideAreasBox={this.hideAreasBox}
                        getSelectArea={this.getSelectArea}
                    />
                    : null
                }
                {this.state.showAlert ?
                    <ErrorAlert 
                        type={1}
                        visiable={this.state.showAlert} 
                        message={this.alertMsg} 
                        hideModal={this.hideAutoModal} 
                    />
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
        justifyContent: 'space-between',
    },
    defaultFont: {
        color: Color.lightBack,
        fontSize: 13,
        lineHeight: 18,
    },
    grayFont: {
        color: Color.lightGrey,
        fontSize: 13,
        paddingRight: 10,
    },
    scrollStyle: {
        marginTop: PX.marginTB,
        marginBottom: PX.marginTB,
    },
    rowBox: {
        width: Size.width,
        height: PX.rowHeight1,
        backgroundColor: '#fff',
    },
    rowContent: {
        flex: 1,
        marginLeft: PX.marginLR,
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowLeft: {
        width: 75,
    },
    rowRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputStyle: {
        flex: 1,
        borderWidth: 0,
        fontSize: 13,
        color: Color.lightBack,
    },
    inputClearBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,
    },
    iconSize18: {
        width: 18,
        height: 18,
    },
    btnStyle: {
        padding: 10,
    },
    homeAddressBox: {
        flexDirection: 'row',
        paddingLeft: PX.marginLR,
        paddingTop: PX.marginTB,
        paddingBottom: PX.marginTB,
        backgroundColor: '#fff',
    },
    inputHomeAddress: {
        flex: 1,
        textAlignVertical: 'top',
        height: 90,
        fontSize: 13,
        color: Color.lightBack,
        lineHeight: 20,
        borderWidth: 0,
    },
    setDefaultRow: {
        height: PX.rowHeight1,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        marginTop: PX.marginTB,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
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
        marginTop: PX.marginTB,
    },
    saveAddressText: {
        fontSize: 13,
        color: '#fff',
    },
});