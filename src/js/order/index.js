/**
 * 我的管理
 * @auther linzeyong
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
} from 'react-native';

import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Lang, {str_replace, TABKEY} from '../public/language';
import { Size, pixel } from '../public/globalStyle';
import { Color } from '../public/theme';
import AppHead from '../public/AppHead';
import OrderPage from './OrderPage';

export default class MyOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initIndex: 0,
            selIndex: 0,
        };
        
        this.tabs = [{
            title: '待发货',
            value: 1,
        }, {
            title: '待付款',
            value: -1,
        }, {
            title: '已发货',
            value: 3,
        }, {
            title: '全部订单',
            value: null,
        }];
        this.mToken = null;
        this.listRefs = new Array(this.tabs.length);
    }

    componentWillMount() {
        this.initDatas();
    };

    componentDidMount() {
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { mToken, index } = params;
            this.mToken = mToken || null;
            let _index = index ? index : 0;
            this.setState({
                initIndex: _index,
                selIndex: _index,
            });
        }
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead
                    title='我的订单'
                    goBack={true}
                    navigation={navigation}
                    onPress={()=>{
                        if(this.listRefs[this.state.selIndex]) {
                            this.listRefs[this.state.selIndex].scrollToOffset({offset: 0, animated: true});
                        }
                    }}
                />
                <View style={styles.container}>
                    <ScrollableTabView
                        renderTabBar={() => <DefaultTabBar />}
                        ref={(_ref)=>this.scrollTabView=_ref}
                        style={styles.tabBarStyle}
                        // 默认打开第几个（0为第一个）
                        initialPage={this.state.initIndex}
                        //"top", "bottom", "overlayTop", "overlayBottom"
                        tabBarPosition='top'
                        // TAB背景色
                        tabBarBackgroundColor={'#fff'}
                        // 选中的下划线颜色
                        tabBarUnderlineStyle={styles.tabUnderLine}
                        // 选中的文字颜色
                        tabBarActiveTextColor={Color.mainColor}
                        // 未选中的文字颜色
                        tabBarInactiveTextColor={Color.mainFontColor}
                        tabBarTextStyle={styles.tabTextStyle}
                        onChangeTab={(obj)=>this.setState({selIndex: obj.i,})}
                    >
                        {this.tabs.map((item, index)=>{
                            return (
                                <View key={index} style={styles.flex} tabLabel={item.title}>
                                    {this.getComponent(index, item.value)}
                                </View>
                            );
                        })}
                    </ScrollableTabView>
                </View>
            </View>
        );
    }

    getComponent = (id, val = null) => {
        if(!this.mToken) return null;
        if(this.state.selIndex == id) {
            let str = '';
            switch(id) {
                case 0:
                    str = '这里没有订单';
                    break;
                case 1:
                    str = '这里没有订单';
                    break;
                case 2:
                    str = '这里没有订单';
                    break;
                case 3:
                    str = '这里没有订单';
                    break;
            }
            return <OrderPage 
                mToken={this.mToken}
                navigation={this.props.navigation} 
                orderType={val}
                notingString={str}
                selectIndex={this.state.selIndex}
                get_list_ref={(ement)=>this.listRefs[this.state.selIndex]=ement}
            />;
        }else {
            return null;
        }
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        borderTopWidth: pixel,
        borderTopColor: Color.borderColor,
    },
    tabBarStyle: {
        height: 44,
        backgroundColor: 'transparent',
    },
    tabUnderLine: {
        height: 2,
        backgroundColor: Color.mainColor,
    },
    tabTextStyle: {
        fontSize: 14,
        paddingTop: 10,
    },
});