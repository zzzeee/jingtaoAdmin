/**
 * APP主页
 * @auther linzeyong
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { Size, pixel } from './public/globalStyle';
import {Color} from './public/theme';
import Utils from './public/utils';
import Urls from './public/adminApiUrl';
import ErrorAlert from './other/ErrorAlert';

import User from './public/user';
var _User = new User();

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopName: null,
            shopUser: null,
            shopHead: null,
            showAlert: false,
            isRefreshing: true,
        };
        this.alertBody = null;
        this.shop = null;
        this.mToken = null;
    }

    componentDidMount() {
        this.initPage();
    }

    initPage = async () => {
        let navigation = this.props.navigation;
        let userid = await _User.getUserID().then((result) => result);
        if(!userid) {
            navigation.navigate('Login');
        }else {
            let ret = await Utils.async_fetch(Urls.shopBasicInfo, 'post', {sToken: userid});
            console.log(ret);
            if(ret && ret.sTatus == 1) {
                if(ret.shopInfo) {
                    this.mToken = userid;
                    this.shop = ret.shopInfo;
                    this.setState({
                        shopName: ret.shopInfo.sShopName || null,
                        shopUser: ret.shopInfo.linkmanTel || null,
                        shopHead: ret.shopInfo.sLogo || null,
                        isRefreshing: false,
                    });
                }
            }else {
                _User.delUserID()
                .then(()=>navigation.navigate('Login'));
            }
        }
    };

    //显示提示框
    showAutoModal = (content) => {
        this.alertBody = content;
        this.setState({
            showAlert: true, 
        });
    };

    //隐藏提示框
    hideAutoModal = () => {
        this.setState({ showAlert: false });
    };
    
    render() {
        // if(!this.shop) return null;
        let {shopName, shopUser, shopHead, showAlert, isRefreshing} = this.state;
        let headimg = shopHead ? {uri: shopHead} : require('../images/home/nothead.png');
        return (
            <ParallaxScrollView
                backgroundColor="#2B99F7"  //背景色（包括隐藏标题背景）
                contentBackgroundColor="#F8F8F8"   //内容背影色
                stickyHeaderHeight={44}
                parallaxHeaderHeight={314}
                backgroundSpeed={10}
                renderBackground={() => (   //背景图
                    <View key="background">
                        <Image 
                            source={require('../images/home/bgimg.png')}
                            style={styles.bgimgStyle}
                        />
                    </View>
                )}
                renderForeground={() => (   //背景图上的内容
                    <View key="parallax-header">
                        <View style={styles.foregroundTitle}>
                            <Text style={styles.foregroundTitleText}>境淘生意宝</Text>
                        </View>
                        <View style={styles.foregroundBody}>
                            <Image source={headimg} style={styles.headImg} />
                            <Text style={styles.userShop}>{shopName}</Text>
                            <Text style={styles.userName}>{"用户名: " + shopUser}</Text>
                        </View>
                    </View>
                )}
                renderStickyHeader={() => (     //隐藏标题内容
                    <View style={styles.foregroundTitle}>
                        <Text style={styles.foregroundTitleText}>境淘生意宝</Text>
                    </View>
                )}
                refreshControl={<RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={this.initPage}
                    title="释放立即刷新我..."
                    tintColor={Color.mainFontColor}
                    titleColor={Color.mainFontColor}
                />}
            >
                <View style={styles.btnBody}>
                    {this.btnItem(styles.btnStyle2, require('../images/home/order.png'), '订单管理', 'Order')}
                    {this.btnItem(styles.btnStyle2, require('../images/home/return.png'), '退换/售后')}
                    {this.btnItem(null, require('../images/home/market.png'), '店铺设置')}
                    {this.btnItem(styles.btnStyle1, require('../images/home/password.png'), '修改密码')}
                    {this.btnItem(styles.btnStyle1, require('../images/home/proposal.png'), '意见反馈')}
                    {this.btnItem(styles.btnStyle1, require('../images/home/config.png'), '系统设置')}
                </View>
                {showAlert ?
                    <ErrorAlert 
                        visiable={showAlert} 
                        body={this.alertBody} 
                        hideModal={this.hideAutoModal} 
                    />
                    : null
                }
            </ParallaxScrollView>
        );
    }

    btnItem = (style, src, name, link = null) => {
        return (
            <TouchableOpacity activeOpacity={1} style={[].concat(styles.btnStyle, style)} onPress={()=>{
                let navigation = this.props.navigation;
                if(link) {
                    if(this.mToken && navigation) {
                        navigation.navigate(link, {
                            mToken: this.mToken,
                        });
                    }
                }else {
                    let content = (
                        <View style={styles.modelStyle}>
                            <Text style={styles.modelText}>功能正在开发中, 敬请期待!</Text>
                        </View>
                    );
                    this.showAutoModal(content);
                }
            }}>
                <Image style={styles.btnImageStyle} source={src} />
                <Text style={styles.btnNameStyle} numberOfLines={1}>{name}</Text>
            </TouchableOpacity>
        );
    };
} 

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    bgimgStyle: {
        width: Size.width,
        height: 270,
        marginTop: 44,
    },
    foregroundTitle: {
        height: 44,
        justifyContent : 'center',
		alignItems: 'center',
    },
    foregroundTitleText: {
        fontSize: 16,
        color: '#fff',
    },
    foregroundBody: {
        marginTop: 50,
        alignItems: 'center',
    },
    headImg: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    userShop: {
        fontSize: 16,
        color: '#fff',
        marginTop: 20,
    },
    userName: {
        fontSize: 14,
        color: '#fff',
        marginTop: 10,
    },
    btnBody: {
        flexDirection : 'row',
        flexWrap: 'wrap',
    },
    btnStyle: {
        width: Size.width / 3 - 0.5,
        height: Size.width / 3 - 0.5,
        justifyContent : 'center',
		alignItems: 'center',
    },
    btnStyle1: {
        borderTopWidth: 0.3,
        borderTopColor: Color.borderColor,
        borderRightWidth: 0.3,
        borderRightColor: Color.borderColor,
    },
    btnStyle2: {
        borderRightWidth: 0.3,
        borderRightColor: Color.borderColor,
    },
    btnImageStyle: {
        width: 50,
        height: 50,
    },
    btnNameStyle: {
        fontSize: 14,
        color: Color.mainFontColor,
        marginTop: 10,
    },
    modelStyle: {
        width: Size.width * 0.7,
        height: 78,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
    },
    modelText: {
        fontSize: 20,
        color: '#fff',
    },
});