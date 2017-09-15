/**
 * 频繁操作提示框(适用：登录，注册，找回密码等)
 * @auther linzeyong
 * @date   2017.06.09
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    Animated,
} from 'react-native';

import PropTypes from 'prop-types';
import InputText from '../public/InputText';
import Lang, {str_replace} from '../public/language';
import { Size, PX, pixel, Color } from '../public/globalStyle';
const CodeBg = [
    require('../../images/login/code_bg/bg.png'),
    require('../../images/login/code_bg/bg1.png'),
    require('../../images/login/code_bg/bg2.png'),
    require('../../images/login/code_bg/bg3.png'),
    require('../../images/login/code_bg/bg4.png'),
    require('../../images/login/code_bg/bg5.png'),
    require('../../images/login/code_bg/bg6.png'),
    require('../../images/login/code_bg/bg7.png'),
    require('../../images/login/code_bg/bg8.png'),
    require('../../images/login/code_bg/bg9.png'),
];

const CodeColor = [
    '#000000', 
    '#e11a1a', 
    '#1771a4', 
    '#34a664', 
    '#f95e00', 
    '#16768e', 
    '#6713b6', 
    '#697953', 
    '#78fe5e', 
    '#848484',
];

export default class FrequentModel extends Component {
    // 默认参数
    static defaultProps = {
    };
    // 参数类型
    static propTypes = {
        text: PropTypes.string,
        leftText: PropTypes.string,
        leftClick: PropTypes.func,
        rightText: PropTypes.string,
        rightClick: PropTypes.func,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            refresh: null,
            error: null,
            inputCode: null,
        };
        this.randCodes = this.createRandStr(4);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(
            this.props.isShow != nextProps.isShow ||
            this.state != nextState
        ) {
            return true;
        }else {
            return false;
        }
    }

    setInputCode = (value) => {
        this.setState({inputCode: value.toUpperCase()});
    };

    refreshRandCodes = () => {
        this.randCodes = this.createRandStr(4);
        this.setState({ refresh: !!!this.state.refresh, });
    };

    createRandStr = (n) => {
        let chars = ['0','1','2','3','4','5','6','7','8','9',
            'A','B','C','D','E','F','G','H','I','J','K','L','M',
            'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        let res = [];
        for(let i = 0; i < n ; i++) {
            let id = Math.ceil(Math.random() * 35);
            res.push(chars[id]);
        }
        return res;
    };

    checkCode = () => {
        if(this.randCodes !== null) {
            let code = this.randCodes.join('');
            if(!this.state.inputCode) {
                this.setState({error: Lang[Lang.default].inputCode, });
            }else if(code == this.state.inputCode) {
                if(this.props.callBack) {
                    this.props.callBack();
                }
            }else {
                this.setState({error: Lang[Lang.default].inputCodeError, });
            }
        }
    };

    render() {
        if(!this.props.isShow) return null;
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={true}
                onRequestClose={() => {
                }}
            >
                <View style={styles.modalHtml}>
                    <View style={styles.modalBody}>
                        <View style={styles.fristRow}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].operationFrequentAlert}</Text>
                        </View>
                        <View style={styles.secondRow}>
                            <View style={styles.secondRow}>
                                <Text style={styles.defaultFont}>{Lang[Lang.default].checkCode}</Text>
                                <InputText
                                    vText={this.state.inputCode}
                                    onChange={(txt)=>this.setInputCode(txt)}
                                    isPWD={false}
                                    length={4}
                                    autoFocus={true}
                                    style={styles.inputStyle}
                                />
                                {this.state.inputCode ?
                                    <TouchableOpacity style={styles.btnClearCode} onPress={()=>this.setInputCode('')}>
                                        <Image source={require('../../images/login/close.png')} style={styles.clearCodeImg}/>
                                    </TouchableOpacity>
                                    : null
                                }
                            </View>
                            <RandCode rand={this.randCodes} refresh={this.state.refresh} />
                        </View>
                        <View style={styles.threeRow}>
                            <Text style={styles.errorText}>{this.state.error}</Text>
                            <Text style={styles.refreshCodeText} onPress={this.refreshRandCodes}>
                                {Lang[Lang.default].refreshVerificationCode}
                            </Text>
                        </View>
                        <View style={styles.flex}>
                            <TouchableOpacity style={styles.btnLogin} onPress={this.checkCode}>
                                <Text style={styles.loginText}>{Lang[Lang.default].determine}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

class RandCode extends Component {
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            rand: null,
        };
    }

    componentWillMount() {
        let rand = this.props.rand || null;
        this.setState({ rand });
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.rand != nextProps.rand) {
            this.setState({ rand: nextProps.rand });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log(nextProps);
        console.log(this.props);
        if(this.props.refresh !== nextProps.refresh || this.state != nextState) {
            return true;
        }else {
            return false;
        }
    }

    render() {
        let rand = this.state.rand || null;
        if(!rand) return null;
        let that = this;
        let bgimg = CodeBg[parseInt(Math.random() * CodeBg.length)];
        return (
            <Image source={bgimg} style={styles.checkTextBox}>
                {rand.map((item, index) => {
                    let color = CodeColor[parseInt(Math.random() * CodeColor.length)];
                    let paddTop = parseInt(Math.random() * 8);
                    let rotate = parseInt(Math.random() * 90) - 40;
                    return (
                        <Animated.Text key={index} style={{
                            fontSize: 20,
                            fontWeight: '900',
                            paddingTop: paddTop,
                            color: color,
                            transform: [{
                                rotate: rotate + 'deg',
                            }]
                        }}>
                            {item}
                        </Animated.Text>
                    );
                })}
            </Image>
        );
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    modalHtml: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    modalBody: {
        width: Size.width * 0.85,
        height: Size.height * 0.325,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    defaultFont: {
        fontSize: 14,
        color: Color.lightBack,
    },
    rowStyle: {
        flexDirection: 'row',
    },
    fristRow: {
        height: 30,
        justifyContent: 'center',
        marginBottom: 5,
    },
    secondRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputStyle: {
        width: Size.width * 0.365,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 15,
        marginBottom: 15,
        borderWidth: pixel,
        borderColor: Color.lightBack,
        borderRadius: 3,
    },
    btnClearCode: {
        position: 'absolute',
        top: 8 + 15,
        right: 10 + 8,
    },
    clearCodeImg: {
        width: 18,
        height: 18,
    },
    checkTextBox: {
        flexDirection: 'row',
        paddingBottom: 3,
        paddingLeft: 5,
        paddingRight: 5,
        borderColor: Color.lightGrey,
        borderWidth: 1,
        borderRadius: 3,
        justifyContent: 'space-between',
    },
    threeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    errorText: {
        fontSize: 12,
        color: Color.red,
    },
    refreshCodeText: {
        fontSize: 12,
        color: '#00579c',
        textDecorationLine: 'underline',
    },
    btnLogin: {
        height: 38,
        flex: 1,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.orange,
        borderRadius: 3,
    },
    loginText: {
        fontSize: 13,
        color: '#fff',
    },
});