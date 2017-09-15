/**
 * 图标按钮
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Image,
} from 'react-native';

import PropTypes from 'prop-types';
import { Size, Color } from './globalStyle';

export default class BtnIcon extends Component {
    // 默认参数
    static defaultProps = {
        size: 14,
        color: '#4A4A4A',
        resizeMode: Image.resizeMode.contain,
    };
    // 参数类型
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        press: PropTypes.func,
        text: PropTypes.string,
    };
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { 
            width, 
            height, 
            style, 
            press, 
            src, 
            text, 
            txtStyle, 
            txtViewStyle, 
            size, 
            color, 
            resizeMode, 
            imageStyle, 
        } = this.props;
        let _width = width ? width : 14;
        let _height = height ? height : _width;
        return (
            <TouchableOpacity activeOpacity={1} style={[].concat(styles.iconBox, style)} onPress={press}>
                {src ? 
                    <Image source={src} resizeMode={resizeMode} style={[].concat({
                        width: _width,
                        height: _height,
                    }, imageStyle)} />
                    : null
                }
                {text ? 
                    <View style={[styles.textView, txtViewStyle]}>
                        <Text style={[{
                            paddingLeft: 4,
                            color: color ? color : Color.lightBack,
                            fontSize: size,
                        }, txtStyle]}>{text}</Text>
                    </View>
                    : null
                }
                {React.Children.map(this.props.children, (child)=>child)}
            </TouchableOpacity>
        );
    }
}

var styles = StyleSheet.create({
    iconBox: {
        padding : 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textView: {
        minHeight: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
});