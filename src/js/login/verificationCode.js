/**
 * 发送验证码
 * @auther linzeyong
 * @date   2017.06.07
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class SendCode extends Component {
    // 默认参数
    static defaultProps = {
        sendCodeFunc: () => {},
    };
    // 参数类型
    static propTypes = {
        timer: PropTypes.number,
        initTxt: PropTypes.string,
        endTxt: PropTypes.string,
        enable: PropTypes.bool,
        sendCodeFunc: PropTypes.func,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            enable: false,
            lock: false,
        };

        this.time = 60;
        this.initTxt = Lang[Lang.default].sendCode;
        this.endTxt = Lang[Lang.default].resendCode;
        this.enColor = '#fff';
        this.disColor = Color.floralWhite;
        this.btnLock = false;
    }

    componentWillMount() {
        let { time, initTxt, endTxt, enColor, disColor } = this.props;
        if(time && time > 0) this.time = time;
        if(initTxt) this.initTxt = initTxt;
        if(endTxt) this.endTxt = endTxt;
        if(enColor) this.enColor = enColor;
        if(disColor) this.disColor = disColor;
        this.setState({text: this.initTxt});
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.enable && !this.state.lock) {
            this.setState({enable: true});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.text != this.state.text || nextState.enable != this.state.enable) {
            return true;
        }else {
            return false;
        }
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    countDown = (_time) => {
        if(_time && _time > 0) {
            let that = this;
            this.setState({
                enable: false,
                lock: true,
                text: _time + 's',
            });
            that.timer = setTimeout(() => {
                return that.countDown(--_time);
            }, 900);
        }else {
            this.setState({
                enable: true,
                lock: false,
                text: this.endTxt,
            });
        }
    };

    render() {
        let bgColor = this.state.enable ? this.enColor : this.disColor;
        return (
            <TouchableOpacity disabled={!this.state.enable} style={[styles.btnBox, {
                backgroundColor: bgColor,
            }]} onPress={()=>{
                if(!this.btnLock) {
                    let that = this;
                    this.btnLock = true;
                    this.props.sendCodeFunc(()=>this.countDown(this.time), ()=>{
                        that.btnLock = false;
                    });
                }
            }}>
                <Text style={styles.btnText}>{this.state.text}</Text>
            </TouchableOpacity>
        );
    }
}

var styles = StyleSheet.create({
    btnBox: {
        borderRadius: 3,
        borderWidth: 1,
        width: 100,
        height: 27,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: 13,
        color: Color.lightBack,
    },
    modalHtml: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    modalBody: {
        width: Size.width * 0.8,
        height: 180,
    },
    alertTextView: {
        height: 130,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    alertText: {
        fontSize: 16,
        color: Color.lightBack,
    },
    bottonsBox: {
        height: 50,
        flexDirection : 'row',
    },
    leftBottonStyle: {
        flex: 1,
        backgroundColor: Color.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 5,
    },
    leftBottonText: {
        fontSize: 16,
        color: '#fff',
    },
    rightBottonStyle: {
        flex: 1,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 5,
    },
    rightBottonText: {
        fontSize: 16,
        color: Color.lightBack,
    },
});