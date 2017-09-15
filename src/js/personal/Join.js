/**
 * 商家入驻
 * @auther linzeyong
 * @date   2017.06.30
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
import Urls from '../public/apiUrl';
import AppHead from '../public/AppHead';
import InputText from '../public/InputText';
import { Size, PX, pixel, Color, FontSize } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import ErrorAlert from '../other/ErrorAlert';

export default class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
        };
        this.name = null;
        this.mobile = null;
        this.shop = null;
        this.type = 1;
        this.alertMsg = '';
    }

    setName = (text) => {
        this.name = text;
    };

    setMobile = (text) => {
        this.mobile = text;
    };

    setShop = (text) => {
        this.shop = text;
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

    addSellerInfo = () => {
        this.type = 1;
        if(!this.name) {
            this.showAutoModal('姓名不能为空!');
        }else if(!this.mobile) {
            this.showAutoModal('手机号码不能为空!');
        }else if(!Utils.checkMobile(this.mobile)) {
            this.showAutoModal('手机号码格式错误!');
        }else if(!this.shop) {
            this.showAutoModal('请输入主营产品!');
        }else {
            Utils.fetch(Urls.updateSellerInfo, 'post', {
                smName: this.name,
                smPhone: this.mobile,
                smBusiness: this.shop,
            }, (result) => {
                console.log(result);
                if(result) {
                    let ret = result.sTatus || 0;
                    let msg = result.sMessage || null;
                    if(ret == 1) {
                        this.type = 2;
                        msg = '提交成功';
                    }
                    this.showAutoModal(msg);
                }
            });
        }
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].jtJoiner}
                    goBack={true}
                    navigation={navigation}
                />
                <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={styles.container}>
                    <Image style={styles.bannerImg} source={require('../../images/personal/join_banner.jpg')} />
                    <View style={styles.titleBox}>
                        <Text style={styles.titleStyle}>{Lang[Lang.default].nowJoin}</Text>
                    </View>
                    <View style={styles.formBox}>
                        <View style={styles.inputItem}>
                            <InputText
                                pText={Lang[Lang.default].inputContactsName}
                                length={20}
                                style={styles.inputStyle}
                                onChange={this.setName}
                            />
                            <Image source={require('../../images/personal/contacts.png')} style={styles.inputBeforeImg} />
                        </View>
                        <View style={styles.inputItem}>
                            <InputText
                                pText={Lang[Lang.default].inputContactsMobile}
                                length={11}
                                style={styles.inputStyle}
                                keyType={"numeric"}
                                onChange={this.setMobile}
                            />
                            <Image source={require('../../images/login/iphone_gary.png')} style={styles.inputBeforeImg} />
                        </View>
                        <View style={styles.inputItem}>
                            <InputText
                                pText={Lang[Lang.default].inputShopProduct}
                                length={50}
                                style={styles.inputStyle}
                                onChange={this.setShop}
                            />
                            <Image source={require('../../images/personal/sell_good.png')} style={styles.inputBeforeImg} />
                        </View>
                        <TouchableOpacity style={styles.btnUpdate} onPress={this.addSellerInfo}>
                            <Text style={styles.btnUpdateText}>{Lang[Lang.default].update}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {this.state.showAlert ?
                    <ErrorAlert 
                        type={this.type}
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
        backgroundColor: Color.lightGrey,
        paddingTop: 10,
    },
    bannerImg: {
        width: Size.width,
        height: Size.width * 1179 / 375,
        backgroundColor: '#fff',
    },
    titleBox: {
        paddingTop: 24,
        paddingBottom: 12,
        paddingLeft: 35,
        backgroundColor: '#fff',
    },
    titleStyle: {
        fontSize: 18,
        color: Color.lightBack,
    },
    formBox: {
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 50,
    },
    inputItem: {
        width: Size.width * 0.728,
        marginTop: 24,
        height: 35,
    },
    inputStyle: {
        flex: 1,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 44,
        paddingRight: 15,
        borderWidth: pixel,
        borderColor: Color.lightBack,
        fontSize: 13,
        color: Color.lightBack,
    },
    inputBeforeImg: {
        position: 'absolute',
        left: 8,
        top: 9,
        width: 18,
        height: 18,
    },
    btnUpdate: {
        marginTop: 35,
        width: Size.width * 0.728,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.steelBlue,
        borderRadius: 5,
    },
    btnUpdateText: {
        fontSize: 13,
        color: '#fff',
    },
});