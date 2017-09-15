/**
 * 个人中心 - 设置 - 留言
 * @auther linzeyong
 * @date   2017.08.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
} from 'react-native';

import Urls from '../public/apiUrl';
import Utils, {Loading} from '../public/utils';
import Lang, {str_replace} from '../public/language';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import InputText from '../public/InputText';
import ErrorAlert from '../other/ErrorAlert';

export default class SendMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            load_or_error: null,
        };
        this.message = null;
        this.mobile = null;
        this.type = 1;
        this.alertMsg = null;
    }

    //显示提示框
    showAutoModal = (msg) => {
        this.alertMsg = msg;
        this.setState({
            showAlert: true, 
        });
    };

    //隐藏提示框
    hideAutoModal = () => {
        this.setState({ showAlert: false });
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    goBack={true}
                    title={'我要留言'}
                    navigation={this.props.navigation}
                />
                <ScrollView keyboardShouldPersistTaps={'handled'}>
                    <View style={styles.sessionStyle}>
                        <InputText 
                            length={120}
                            multiline={true}
                            pText={"用得不爽,赶紧吐槽下吧~~"}
                            style={styles.inputMoreRow}
                            onChange={(value)=>this.message=value}
                        />
                    </View>
                    <View style={styles.sessionStyle}>
                        <Text style={styles.inputTitle}>您的联系方式</Text>
                        <InputText 
                            length={32}
                            pText={"手机/QQ/邮箱"}
                            onChange={(value)=>this.mobile=value}
                        />
                    </View>
                    <TouchableOpacity style={styles.btnUpate} onPress={this.updateUserMessage}>
                        <Text style={styles.updateText}>提交</Text>
                    </TouchableOpacity>
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
                {this.state.load_or_error ?
                    <Modal
                        transparent={true}
                        visible={true}
                        onRequestClose={()=>{}}
                    >
                        <View style={styles.modalBody}>
                            {this.state.load_or_error}
                        </View>
                    </Modal>
                    : null
                }
            </View>
        );
    }

    updateUserMessage = () => {
        let { navigation } = this.props;
        let params = (navigation && navigation.state.params) ? navigation.state.params : {};
        let token = params.mToken ? params.mToken : null;
        if(token) {
            let _message = Utils.trim(this.message) || null;
            let _mobile = Utils.trim(this.mobile) || null;
            if(!_message) {
                this.showAutoModal('请输入留言内容');
            }else if(!_mobile) {
                this.showAutoModal('请留个联系方式');
            }else {
                Utils.fetch(Urls.updateUserMessage, 'post', {
                    'mToken': token,
                    'mMessage': _message,
                    'mContact': _mobile,
                }, (result)=>{
                    if(result) {
                        let msg = result.sMessage || msg;
                        let err = result.sTatus || 0;
                        if(err == 1) {
                            this.setState({
                                showAlert: false,
                                load_or_error: null,
                            }, ()=>navigation.navigate('SetApp', {
                                login: true,
                                mToken: token,
                            }));
                        }else if(msg) {
                            this.showAutoModal(msg);
                        }
                    }
                }, (view)=>{
                    this.setState({load_or_error: view,});
                });
            }
        }
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
    sessionStyle: {
        padding: 15,
    },
    inputMoreRow: {
        height: 140,
        textAlignVertical: 'top',
    },
    inputTitle: {
        fontSize: 14,
        color: Color.lightBack,
        marginBottom: 6,
    },
    btnUpate: {
        width: Size.width - 30,
        marginLeft: 15,
        height: PX.rowHeight2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: Color.mainColor,
        marginTop: 50,
    },
    updateText: {
        fontSize: 15,
        color: "#fff",
    },
    modalBody: {
        width: Size.width,
        height: Size.height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
});