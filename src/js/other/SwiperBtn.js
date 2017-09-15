/**
 * 侧边 Swiper 按钮效果
 * @auther linzeyong
 * @date   2017.06.17
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    PanResponder,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

export default class SwiperBtn extends Component {
    // 默认参数
    static defaultProps = {
        friction: 4,        //摩擦力
        tension: 40,        //张力
        direction: 'right', //默认方向 (顺时针)
        btnParam: {},
    };
    // 参数类型
    static propTypes = {
        btns: PropTypes.array,
        btnParam: PropTypes.object,
        itemHeight: PropTypes.number.isRequired,
        friction: PropTypes.number.isRequired,
        tension: PropTypes.number.isRequired,
        direction: PropTypes.oneOf(['left', 'right']),
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.isOpen = false;
        this.minOffset = 0;
        this.textWidth = 0;
        this.positionValue = 0;
        this.position = new Animated.Value(0);
        // 监听 this.position 值的变化
        this.position.addListener(v => {
            this.positionValue = v.value;
        });
    }

    componentWillReceiveProps(nextProps) {
        this.positionValue = 0;
        this.position.setValue(0);
    }

    //定义触屏响应事件
    panResponderInit = PanResponder.create({
        // 要求成为响应者：
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        // 响应开始
        onPanResponderGrant: (evt, gestureState) => {
            this.position.setOffset(this.positionValue);
            this.position.setValue(0);
        },
        // 移动过程
        onPanResponderMove: (evt, gestureState) => {
            const {dx} = gestureState;
            let left = dx;
            let min = this.minOffset;
            let max = this.textWidth + this.minOffset;
            if(this.textWidth > 0) {
                if(this.props.direction === 'left') {
                    if(this.isOpen) {
                        max = 0;
                        min = this.textWidth;
                    }
                    if(dx > max) left = max;
                    if(dx < -min) left = -min;
                    this.position.setValue(left);
                }else {
                    if(this.isOpen) {
                        max = 0;
                        min = this.textWidth;
                    }
                    if(this.isOpen) max = 0;
                    if(dx > min) left = min;
                    if(dx < -max) left = -max;
                    this.position.setValue(left);
                }
            }
        },
        onPanResponderTerminationRequest: (evt, gestureState) => false,
        // 响应结束
        onPanResponderRelease: (evt, {vx, dx}) => {
            let press = this.props.onPress || null;
            if(dx < 5 && dx > -5 && press) {
                press();
                return;
            }
            this.position.flattenOffset();
            let result = 0;
            let min = this.minOffset;
            let max = this.textWidth + this.minOffset;
            let half = this.textWidth / 2;
            // 速度快时 按方向翻页。否则按移动距离翻页。
            if(this.props.direction === 'left') {
                if(vx > 0.05) {
                    result = this.textWidth;
                    this.isOpen = true;
                }else if(vx < -0.05) {
                    result = 0;
                    this.isOpen = false;
                }else {
                    if(this.positionValue >= half) {
                        result = this.textWidth;
                        this.isOpen = true;
                    }else {
                        result = 0;
                        this.isOpen = false;
                    }
                }
            }else {
                if(vx > 0.05) {
                    result = 0;
                    this.isOpen = false;
                }else if(vx < -0.05) {
                    result = -this.textWidth;
                    this.isOpen = true;
                }else {
                    if(this.positionValue > -half) {
                        result = 0;
                        this.isOpen = false;
                    }else {
                        result = -this.textWidth;
                        this.isOpen = true;
                    }
                }
            }
            // 动画效果
            Animated.spring(this.position, {
                toValue: result,
                friction: this.props.friction,
                tension: this.props.tension,
            }).start();
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
            // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
            // 默认返回true。目前暂时只支持android。
            return true;
        },
    });

    // 基本函数
    render() {
        const { 
            style, 
            itemHeight, 
            children, 
            btns, 
            btnParam,
            itemStyle,
            btnStyle,
        } = this.props;
        let that = this;
        let btnText = btns.map((btn, i) => {
            let size = btn.fontSize || 14;
            let color = btn.color || '#fff';
            let bgColor = btn.backgroundColor || '#ccc';
            return (
                <TouchableOpacity
                    key={i}
                    style={[styles.btnsTouch, {
                        height: itemHeight,
                        backgroundColor: bgColor,
                    }, btnStyle]}
                    onPress={()=>{
                        btnParam.callback = ()=>{
                            that.isOpen = false;
                            that.position.setValue(0);
                        };
                        if(btn.press) btn.press(btnParam);
                    }}
                    onLayout={(evt)=>{
                        this.textWidth += evt.nativeEvent.layout.width;
                    }}
                >
                    <Text style={{color: color, fontSize: size, }}>{btn.text}</Text>
                </TouchableOpacity>
            );
        });
        let direction = this.props.direction === 'left' ? 'flex-start' : 'flex-end';
        return (
            <View style={[styles.container, style]}>
                <View style={[styles.btnsView, {justifyContent: direction}]}>
                    {btnText}
                </View>
                <Animated.View
                    {...this.panResponderInit.panHandlers}
                    style={[styles.item, {height: itemHeight, transform: [{translateX: this.position}]}, itemStyle]}
                >
                    {children}
                </Animated.View>
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
        backgroundColor : '#ddd',
    },
    item: {
        // flexDirection: 'row',
        // alignItems: 'center',
        position: 'absolute',
        left: 0,
    },
    btnsView: {
        flex: 1,
        flexDirection: 'row',
		alignItems: 'center',
    },
    btnsTouch : {
        justifyContent: 'center',
		alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
});