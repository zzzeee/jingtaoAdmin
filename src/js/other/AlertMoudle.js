/**
 * 提示框组件(适用： 购物车，提交订单删除提醒等)
 * @auther linzeyong
 * @date   2017.05.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native';

import PropTypes from 'prop-types';
import { Size, PX, pixel, Color } from '../public/globalStyle';

export default class AlertMoudle extends Component {
    // 默认参数
    static defaultProps = {
        visiable: false,
        leftColor: '#fff',
        rightColor: Color.lightBack,
        leftBgColor: Color.mainColor,
        rightBgColor: '#ddd',
    };
    // 参数类型
    static propTypes = {
        visiable: PropTypes.bool.isRequired,
        text: PropTypes.string,
        leftText: PropTypes.string,
        leftClick: PropTypes.func,
        leftColor: PropTypes.string,
        leftBgColor: PropTypes.string,
        rightText: PropTypes.string,
        rightClick: PropTypes.func,
        rightColor: PropTypes.string,
        rightBgColor: PropTypes.string,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { 
            visiable, 
            text, 
            textView,
            leftText,
            contentStyle,
            leftClick,
            leftColor,
            leftBgColor,
            rightText, 
            rightClick,
            rightColor,
            rightBgColor,
            diyModalBody,
         } = this.props;
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={visiable}
                onRequestClose={() => {
                }}
            >
                <View style={styles.modalHtml}>
                    {diyModalBody ?
                        diyModalBody :
                        <View style={styles.modalBody}>
                            <View style={[styles.alertTextView, contentStyle]}>
                                {textView ?
                                    textView :
                                    <Text style={styles.alertText}>{text}</Text>
                                }
                            </View>
                            <View style={styles.bottonsBox}>
                                <TouchableOpacity style={[styles.leftBottonStyle, {
                                    backgroundColor: leftBgColor,
                                }]} onPress={leftClick} activeOpacity={1}>
                                    <Text style={[styles.leftBottonText, {color: leftColor}]}>{leftText}</Text>
                                </TouchableOpacity>
                                <View style={styles.lineStyle} />
                                <TouchableOpacity style={[styles.rightBottonStyle, {
                                    backgroundColor: rightBgColor,
                                }]} onPress={rightClick} activeOpacity={1}>
                                    <Text style={[styles.rightBottonText, {color: rightColor}]}>{rightText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    modalHtml: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    modalBody: {
        width: Size.width * 0.8,
        minHeight: 180,
    },
    alertTextView: {
        minHeight: 130,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        padding: 15,
    },
    alertText: {
        fontSize: 14,
        color: Color.lightBack,
        lineHeight: 24,
    },
    bottonsBox: {
        height: 50,
        flexDirection : 'row',
        borderTopWidth: pixel,
        borderTopColor: Color.lavender,
    },
    leftBottonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 5,
    },
    leftBottonText: {
        fontSize: 15,
    },
    lineStyle: {
        height: 50,
        width: 0,
        borderLeftWidth: pixel,
        borderLeftColor: Color.lavender,
    },
    rightBottonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 5,
    },
    rightBottonText: {
        fontSize: 15,
    },
});