/**
 * 个人中心 - 会员资料
 * @auther linzeyong
 * @date   2017.08.11
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ScrollView,
    Switch,
    Image,
    Button,
    Platform,
    Modal,
} from 'react-native';

import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import { CachedImage } from "react-native-img-cache";

import Utils, {Loading} from '../public/utils';
import Urls from '../public/apiUrl';
import InputText from '../public/InputText';
import PickerAndroidIOS from '../other/PickerAndroidIOS';
import { Size, PX, pixel, Color, FontSize } from '../public/globalStyle';
import Lang, { str_replace, TABKEY } from '../public/language';
import AppHead from '../public/AppHead';
import ErrorAlert from '../other/ErrorAlert';

var maxImageSizeM = 1;  // 单位M
var maxImageSize = 1024 * 1024 * maxImageSizeM;	// 1M
var maxPX = 1600;       // 像素
// More info on all the options is below in the README...just some common use cases shown here
var options = {
    title: Lang[Lang.default].pleaseSelect,
    cancelButtonTitle: Lang[Lang.default].cancel,
    takePhotoButtonTitle: Lang[Lang.default].photograph,
    chooseFromLibraryButtonTitle: Lang[Lang.default].selectAlbum,
    quality: 0.7,
    maxWidth: maxPX,
    maxHeight: maxPX,
    allowsEditing: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
};

export default class EditUser extends Component {
    //构造
    constructor(props) {
        super(props);
        this.state = {
            userBirthday: null,
            userHeadImg: null,
            userSex: 0,
            showAlert: false,
            showLoad: false,
        };

        this.userInfo = null;
        this.userNewName = null;
        this.userNewMail = null;
        this.userHeadData = null;
        this.type = 1;
        this.alertMsg = '';
        this.btnLock = false;
    }

    componentWillMount() {
        this.initDatas();
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if (navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { mToken, userInfo } = params;
            this.mToken = mToken || null;
            this.userInfo = userInfo || null;
            let userSex = parseInt(this.userInfo.mSex) || 0;
            let userHeadImg = this.userInfo.mPicture || null;
            let userBirthday = this.userInfo.mBirthday || null;
            this.userNewName = this.userInfo.mNickName || null;
            this.userNewMail = this.userInfo.mEmail || null;
            userHeadImg = userHeadImg ? {uri: userHeadImg} : require('../../images/personal/defaultHeadImg.png');
            this.setState({
                userSex,
                userHeadImg,
                userBirthday
            });
        }
    };

    //显示提示框
    showAutoModal = (msg) => {
        this.alertMsg = msg;
        this.setState({
            showAlert: true, 
            showLoad: false,
        });
    };

    //隐藏提示框
    hideAutoModal = () => {
        this.setState({ showAlert: false });
    };

    render() {
        if (!this.mToken || !this.userInfo) return null;
        let name = this.userInfo.mNickName || null;
        let mail = this.userInfo.mEmail || null;
        let mobile = this.userInfo.mPhone || null;
        let sexs = [{
            name: '请选择',
            value: 0,
        }, {
            name: '男',
            value: 1,
        }, {
            name: '女',
            value: 2,
        },];
        let { userSex, userHeadImg, userBirthday, showAlert, showLoad } = this.state;
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].userInfo}
                    goBack={true}
                    navigation={this.props.navigation}
                />
                <ScrollView keyboardShouldPersistTaps={'handled'}>
                    <TouchableOpacity style={styles.headView} onPress={this.selectLocalImage}>
                            <Image
                                source={userHeadImg}
                                style={styles.headImage}
                            />
                            <Text>点击更改</Text>
                    </TouchableOpacity>
                    <View style={styles.inputView}>
                        <Text style={styles.inputText}>昵称</Text>
                        <View style={styles.inlineRight}>
                            <InputText 
                                defaultValue={name} 
                                maxLength={20}
                                onChange={(val)=>this.userNewName=val}
                            />
                        </View>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputText}>性别</Text>
                        <View style={styles.inlineRight}>
                            <PickerAndroidIOS
                                options={sexs}
                                initValue={parseInt(userSex)}
                                selectLab='name'
                                selectVal='value'
                                onValueChange={(val) => {
                                    console.log(val);
                                    this.setState({ userSex: val });
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputText}>邮箱</Text>
                        <View style={styles.inlineRight}>
                            <InputText 
                                defaultValue={mail} 
                                maxLength={30}
                                onChange={(val)=>this.userNewMail=val}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.inputView} onPress={()=>{
                        if(this.mToken && this.userInfo) {
                            this.props.navigation.navigate('EditMobile', {
                                mToken: this.mToken,
                                userInfo: this.userInfo,
                            });
                        }
                    }}>
                        <Text style={styles.inputText}>手机</Text>
                        <View style={[styles.inlineRight, {
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }]}>
                            <Text style={styles.mobileText}>{mobile}</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.rowRightIcon} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.inputView}>
                        <Text style={styles.inputText}>出生日期</Text>
                        <View style={styles.inlineRight}>
                            <DatePicker
                                date={userBirthday}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
                                minDate="1960-01-01"
                                maxDate="2012-01-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                style={{
                                    width: (Size.width - 36) * 3.5 / 4.5,
                                }}
                                onDateChange={(date) => {
                                    this.setState({ userBirthday: date });
                                }}
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        right: 0,
                                        top: 4,
                                    },
                                    dateInput: {
                                        flex: 1,
                                        height: 34,
                                        borderWidth: pixel,
                                        borderColor: Color.lavender,
                                        borderRadius: 5,
                                    }
                                }}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.btnSaveStyle} onPress={this.updateUserInfo}>
                        <Text style={styles.btnSaveText}>{Lang[Lang.default].save}</Text>
                    </TouchableOpacity>
                </ScrollView>
                {showAlert ?
                    <ErrorAlert 
                        type={this.type}
                        visiable={showAlert} 
                        message={this.alertMsg} 
                        hideModal={this.hideAutoModal} 
                    />
                    : null
                }
                {showLoad ?
                    <Modal
                        transparent={true}
                        visible={showLoad}
                        onRequestClose={()=>{}}
                    >
                        <View style={styles.modalBody}>
                            {Loading({
                                loadText: '请稍等..',
                            })}
                        </View>
                    </Modal>
                    : null
                }
            </View>
        );
    }

    //更新会员资料
    updateUserInfo = () => {
        if(this.btnLock) {
            console.log('请稍等,正在验证中...');
            return;
        }
        let name = Utils.trim(this.userNewName) || null;
        let uName = this.userInfo.mNickName || null;
        let uMail = this.userInfo.mEmail || null;
        let uBirthday = this.userInfo.mBirthday || null;
        let uSex = parseInt(this.userInfo.mSex) || 0;
        //判断是否修改信息
        if (!this.userHeadData && uName == name && 
            uSex == this.state.userSex &&
            uMail == this.userNewMail && this.state.userBirthday == uBirthday) {
            this.showAutoModal('资料未修改，无需提交。');
            return;
        }else if(!name) {
            this.showAutoModal('昵称不能为空!');
            return;
        }else if(uMail && !this.userNewMail) {
            this.showAutoModal('请输入邮箱!');
            return;
        }else if(uSex && this.state.userSex == 0) {
            this.showAutoModal('请选择性别!');
            return;
        }else {
            this.btnLock = true;
            this.setState({showLoad: true,});
        }
        let obj = {
            mToken: this.mToken,
            mPicture: this.userHeadData,
            mNickName: name,
            mBirthday: this.state.userBirthday,
            mEmail: this.userNewMail,
            mSex: this.state.userSex,
        };
        console.log(obj);
        Utils.fetch(Urls.updateUserInfo, 'post', obj, (result)=> {
            console.log(result);
            if (result && result.sTatus == 1) {
                this.showAutoModal('资料修改成功!');
                this.props.navigation.navigate('TabNav', {
                    PathKey: TABKEY.personal,
                });
            }else {
                this.btnLock = false;
                let msg = result.sMessage || null;
                this.showAutoModal(result.sMessage);
            }
        });
    }

    //选择本地图片
    selectLocalImage = () => {
        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info below in README)
         */
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else if (!response.data) {
                return false;
            } else if (response.width > maxPX || response.height > maxPX) {
                this.showAutoModal(`你上传的图片像素过大(最大 ${maxPX}*${maxPX})`);
                return false;
            } else if ((Platform.OS !== 'ios') && 
                response.type != 'image/jpeg' &&
                response.type != 'image/png' &&
                response.type != 'image/gif' &&
                response.type != 'image/bmp') {
                this.showAutoModal(`你上传的图片类型(${response.type})不可用`);
                return false;
            } else {
                this.userHeadData = response.data;
                let userHeadImg = { uri: response.uri };
                // You can also display the image using data:
                // let userHeadImg = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({ userHeadImg, });
            }
        });
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Color.floralWhite,
    },
    headView: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
    },
    headImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: pixel,
        borderColor: Color.lavender,
    },
    inputView: {
        height: PX.rowHeight1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        backgroundColor: '#fff',
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
    },
    inputText: {
        color: '#444',
        flex: 1,
    },
    inlineRight: {
        flex: 3.5,
        justifyContent: 'center',
    },
    btnAddUser: {
        height: 32,
        marginTop: 50,
        marginBottom: 30,
    },
    mobileText: {
        fontSize: 13,
        color: Color.lightBack,
        paddingRight: 10,
    },
    rowRightIcon: {
        width: 26,
        height: 26,
    },
    btnSaveStyle: {
        height: PX.rowHeight2,
        borderRadius: 5,
        backgroundColor: Color.mainColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 10,
        marginLeft: PX.marginLR,
        marginRight: PX.marginLR,
    },
    btnSaveText: {
        fontSize: 14,
        color: '#fff',
    },
    modalBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
});