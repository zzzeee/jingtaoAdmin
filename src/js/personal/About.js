/**
 * 个人中心 - 联系我们
 * @auther linzeyong
 * @date   2017.06.20
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    Clipboard,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Lang, {str_replace} from '../public/language';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import AlertMoudle from '../other/AlertMoudle';

export default class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteAlert: false,
        };

        this.alertObject = {};
        this.rows = [{
            title: '联系方式',
        }, {
            type: 'QQ',
            title: '联系客服QQ: ',
            value: '1604693830',
        }, {
            title: '400热线: ',
            value: '400-023-7333',
            type: 'tel',
            style: {
                borderBottomWidth: 0,
            },
        }, {
            title: '商家合作联系',
            boxStyle: {
                marginTop: PX.marginTB,
            }
        }, {
            type: 'QQ',
            title: '联系合作QQ: ',
            value: '1161172824',
            style: {
                borderBottomWidth: 0,
            },
        }];
    }

    //显示删除提示框
    showAlertMoudle = (msg, func, rText = null) => {
        this.alertObject = {
            text: msg,
            rightText: Lang[Lang.default].cancel,
            leftText: rText || Lang[Lang.default].determine,
            rightClick: ()=>this.setState({deleteAlert: false,}),
            leftClick: func,
        };
        this.setState({deleteAlert: true,});
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].contactUs}
                    goBack={true}
                    navigation={navigation}
                />
                <View style={styles.flex}>
                    {this.rows.map(this.rendRow)}
                </View>
                {this.state.deleteAlert ?
                    <AlertMoudle visiable={this.state.deleteAlert} {...this.alertObject} />
                    : null
                }
            </View>
        );
    }

    callPhone = (type, value) => {
        Linking.openURL(type + ': ' + value)
        .catch(err => console.error(err));
    };

    rendRow = (item, index) => {
        let boxStyle = item.boxStyle || {};
        let style = item.style || {};
        let title = item.title || null;
        let value = item.value || null;
        let type = item.type || null;
        return (
            <TouchableOpacity key={index} style={[].concat(boxStyle, styles.boxStyle)} onPress={async ()=>{
                if(type == 'tel') {
                    this.showAlertMoudle(
                        title + value,
                        ()=>this.callPhone(type, value),
                        Lang[Lang.default].call
                    )
                }else if(type == 'QQ') {
                    Clipboard.setString(value);
                    Toast.show(`QQ ${value} 已复制!`, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.CENTER,
                        hideOnPress: true,
                    });
                }
            }}>
                <View style={[].concat(style, styles.rowMain)}>
                    <Text style={styles.rowText}>{title}</Text>
                    {value ?
                        <Text selectable={true} style={{
                            fontSize: 14,
                            color: (type == 'tel') ? Color.royalBlue : Color.lightBack,
                        }}>{value}</Text>
                        : null
                    }
                </View>
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
        backgroundColor: Color.floralWhite,
    },
    boxStyle: {
        backgroundColor: '#fff',
    },
    rowMain: {
        marginLeft: PX.marginTB,
        height: PX.rowHeight1,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
    },
    rowText: {
        fontSize: 13,
        color: Color.lightBack,
    },
});