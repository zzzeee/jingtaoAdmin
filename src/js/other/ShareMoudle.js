/**
 * 分享选项菜单
 * @auther linzeyong
 * @date   2017.05.02
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

var WeChat=require('react-native-wechat');
// import * as WeiboAPI from 'react-native-weibo';
// import * as QQAPI from 'react-native-qq';
import PropTypes from 'prop-types';
import Urls from '../public/apiUrl';
import Toast from 'react-native-root-toast';
import Lang, {str_replace} from '../public/language';
import { Size, pixel, Color } from '../public/globalStyle';

var itemMargin = 26;
var rowItemNumber = 4;
var itemWidth = (Size.width - ((rowItemNumber + 1) * itemMargin)) / rowItemNumber;
itemWidth = 60; //直接写成固定尺寸

export default class ShareMoudle extends Component {
    // 默认参数
    static defaultProps = {
        visible: false,
        shareInfo: {},
    };
    // 参数类型
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        shareInfo: PropTypes.object,
        setStartShare: PropTypes.func,
    };
    //构造函数
    constructor(props) {
        super(props);
        this.timer = null;
        this.shareList = ['shareToTimeline', 'shareToSession'];
    }

    componentWillUnmount() {
        // 请注意Un"m"ount的m是小写
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    // componentWillReceiveProps(nextProps) {
    //     if(nextProps.visible) {
    //         this.setState({visible: true});
    //     }
    // }

    //分享前隐藏分享模块
    hideModal = () => {
        this.props.setStartShare && this.props.setStartShare(false);
        // this.setState({visible: false});
    };

    //分享模块单元
    createShareList = () => {
        let {
            title, details, imgUrl, clickUrl,
            wx_py_title, wx_py_details, wx_py_imgUrl, wx_py_clickUrl,
            wx_pyq_title, wx_pyq_details, wx_pyq_imgUrl, wx_pyq_clickUrl,
            qq_py_title, qq_py_details, qq_py_imgUrl, qq_py_clickUrl,
            qq_kj_title, qq_kj_details, qq_kj_imgUrl, qq_kj_clickUrl,
        } = this.props.shareInfo ;
        let _title = title || '境淘土特产';
        let _details = details || '一个只买土特产的APP';
        let _imgUrl = imgUrl || Urls.appJingTaoLogo;
        let _clickUrl = clickUrl || Urls.basicUpdateUrl;
        let shares = [{
            type: 'wechat',
            to: 'shareToSession',   //微信好友
            name: Lang[Lang.default].wxFriends,
            icon: require('../../images/share/wechat.png'),
            obj: {
                type: 'news',
                title: wx_py_title || _title,
                description: wx_py_details || _details,
                thumbImage: wx_py_imgUrl || _imgUrl,
                webpageUrl: wx_py_clickUrl || _clickUrl,
            },
        }, {
            type: 'wechat',
            to: 'shareToTimeline',  //微信朋友圈
            name: Lang[Lang.default].circleOfFriends,
            icon: require('../../images/share/moment.png'),
            obj: {
                type: 'news',
                title: wx_pyq_title || _title,
                description: wx_pyq_details || _details,
                thumbImage: wx_pyq_imgUrl || _imgUrl,
                webpageUrl: wx_pyq_clickUrl || _clickUrl,
            },
        }, {
            type: 'QQ',
            to: 'shareToQQ',  //QQ好友
            name: 'QQ好友',
            icon: require('../../images/share/qq.png'),
            obj: {
                type: 'news',
                title: qq_py_title || _title,
                description: qq_py_details || _details,
                imageUrl: qq_py_imgUrl || _imgUrl,
                webpageUrl: qq_py_clickUrl || _clickUrl,
            },
        }, {
            type: 'QQ',
            to: 'shareToQzone',  //QQ空间
            name: 'QQ空间',
            icon: require('../../images/share/qq_zone.png'),
            obj: {
                type: 'news',
                title: qq_kj_title || _title,
                description: qq_kj_details || _details,
                imageUrl: qq_kj_imgUrl || _imgUrl,
                webpageUrl: qq_kj_clickUrl || _clickUrl,
            },
        }, {
            type: 'WeiBo',
            name: '新浪微博',
            icon: require('../../images/share/weibo.png'),
        }];
        return shares;
    };

    //显示提示
    showToast = (msg) => {
        this.timer = Toast.show(msg, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            hideOnPress: true,
        });
    };

    render() {
        if(!this.props.visible) return null;
        let that = this;
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {}}
            >
                <View style={styles.bodyStyle}>
                    <TouchableOpacity style={styles.flex} onPress={this.hideModal} onLongPress={this.hideModal} />
                    <View style={styles.shareBox}>
                        <ScrollView 
                            contentContainerStyle={styles.scrollviewStyle} 
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {this.createShareList().map(function(item, index) {
                                let name = item.name || '';
                                let icon = item.icon || {};
                                return (
                                    <View key={index} style={styles.shareItemStyle}>
                                        <TouchableOpacity style={styles.shareImageBox} activeOpacity={1} onPress={()=>{
                                            that.hideModal();
                                            let _type = item.type || null;
                                            if(_type == 'wechat' && item.to && item.obj) {
                                                WeChat.isWXAppInstalled()
                                                .then((isInstalled) => {
                                                    if (isInstalled) {
                                                        WeChat[item.to](item.obj)
                                                        .then((result) => {
                                                            if(result && result.errCode === 0) {
                                                                that.showToast('分享成功');
                                                            }else if(result && result.message) {
                                                                that.showToast(result.message);
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            let err = error.code || 0;
                                                            if(err == -2) {
                                                                that.showToast('取消分享');
                                                            }
                                                        });
                                                    } else {
                                                        that.showToast(Lang[Lang.default].shareErrorAlert);
                                                    }
                                                });
                                            }else if(_type == 'QQ' && item.to && item.obj) {
                                                QQAPI.isQQInstalled()
                                                .then((isInstalled)=>{
                                                    if(isInstalled) {
                                                        QQAPI[item.to](item.obj)
                                                        .then((result)=>{
                                                            if(result && result.errCode === 0) {
                                                                that.showToast('分享成功');
                                                            }else if(result && result.message) {
                                                                that.showToast(result.message);
                                                            }
                                                        })
                                                        .catch((error)=>{
                                                            console.log(error);
                                                        });
                                                    }
                                                })
                                                .catch((err)=>{
                                                    console.log(err);
                                                    let code = err.code || null;
                                                    if(code == 'EUNSPECIFIED' || code == -1) {
                                                        that.showToast('您还未安装QQ!');
                                                    }
                                                });
                                            }else if(_type == 'WeiBo') {
                                                // WeiboAPI.share({
                                                //     type: 'text', 
                                                //     text: 'weibo文字内容test!',
                                                // })
                                                // .then((result)=>{
                                                //     console.log(result);
                                                // })
                                                // .catch((error)=>{
                                                //     console.log(error);
                                                // });
                                            }
                                        }}>
                                            <Image source={icon} style={styles.shareImageStyle} />
                                        </TouchableOpacity>
                                        <Text style={styles.shareItemTextStyle} numberOfLines={1}>{name}</Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <View style={styles.btnCancelBox}>
                            <Text style={styles.btnCancel} onPress={this.hideModal}>{Lang[Lang.default].cancel}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    bodyStyle: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'flex-end',
    },
    shareBox: {
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    scrollviewStyle: {
        paddingLeft: itemMargin / 2,
        paddingRight: itemMargin / 2,
    },
    shareItemStyle: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: itemWidth,
        margin: itemMargin / 2,
    },
    shareImageBox: {
        width: itemWidth,
        height: itemWidth,
    },
    shareImageStyle: {
        width: itemWidth - 1,
        height: itemWidth - 1,
        // borderRadius: (itemWidth - 1) / 2,
        borderWidth: pixel,
        borderColor: Color.lavender,
    },
    shareItemTextStyle: {
        fontSize: 12,
        color: Color.lightBack,
        paddingTop: 6,
    },
    btnCancelBox: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: pixel,
        borderTopColor: Color.lavender,
    },
    btnCancel: {
        fontSize: 14,
        color: Color.steelBlue,
        paddingTop: 8,
        paddingBottom: 8,
    },
});