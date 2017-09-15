import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Picker,
    PickerIOS,
    Modal,
    Platform,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Size, PX, pixel, Color, } from '../public/globalStyle';

export default class PickerAndroidIOS extends Component {
    // 参数类型
    static propTypes = {
        options: PropTypes.array,
        initValue: PropTypes.number,
        onValueChange: PropTypes.func,
        selectVal: PropTypes.string,
        selectLab: PropTypes.string,
    };
    //构造
    constructor(props) {
        super(props);
        this.state = {
            //...props,
            modalVisible: false,
            selectValIOS: null,
            showLabel: null,
        };
    }

    render() {
        let { selectValIOS, showLabel } = this.state;
        let { options, initValue, onValueChange, selectVal, selectLab } = this.props;
        let _initValue = (initValue || initValue === 0) ? 
            initValue : 
            (options && options[0] && options[0][selectVal] ? options[0][selectVal] : null);
        let btnText = showLabel ? showLabel : 
            (_initValue !== null && options && options[0]) ?
                (options[_initValue][selectLab] ? options[_initValue][selectLab] : null)
                : null;
        return (
            <View style={styles.PickerBox}>
                {Platform.OS === 'ios' ?
                    <TouchableOpacity style={[styles.btnBox, {
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }]} onPress={()=>{ this.setState({ modalVisible: true })}}>
                            <Text numberOfLines={1} style={[styles.btnText, {
                                color: Color.lightBack,
                            }]}>{btnText}</Text>
                            <Icon name="caret-down" size={20} color={Color.lightBack} />
                    </TouchableOpacity> :
                    <Picker
                        selectedValue={_initValue}
                        onValueChange={onValueChange}
                        style={styles.pickerStyle}
                    >
                        {options.map(this.readOptionItem)}
                    </Picker>
                }
                {Platform.OS === 'ios' ?
                    <Modal
                        animationType={"none"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { }}
                    >
                        <View style={styles.modalBody}>
                            <View style={styles.pickerContralBox}>
                                <TouchableOpacity
                                    style={[styles.btnBox, styles.btnModal]} 
                                    onPress={()=>{ this.setState({ modalVisible: false })}}>
                                    <Text numberOfLines={1} style={styles.btnText}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.btnBox, styles.btnModal]} 
                                    onPress={()=>{
                                        let _showLabel = (options[selectValIOS] && options[selectValIOS][selectLab]) ?
                                            options[selectValIOS][selectLab] : null;
                                        this.setState({
                                            modalVisible: false,
                                            showLabel: _showLabel,
                                        }, ()=>onValueChange(selectValIOS));
                                    }}>
                                    <Text numberOfLines={1} style={styles.btnText}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.pickerBottomBox}>
                                <PickerIOS
                                    selectedValue={selectValIOS !== null ? selectValIOS : _initValue}
                                    onValueChange={(value)=>this.setState({selectValIOS: value})}
                                >
                                    {options.map(this.readOptionItem)}
                                </PickerIOS>
                            </View>
                        </View>
                    </Modal>
                    : null}
            </View>
        );
    }

    // 加载所有子项
    readOptionItem = (obj, i) => {
        let { selectLab, selectVal, } = this.props;
        let _lab = selectLab ? obj[selectLab] : obj;
        let _val = selectVal ? obj[selectVal] : obj;
        let PickerItem = Platform.OS === 'ios' ? PickerIOS.Item : Picker.Item;
        return <PickerItem key={i} label={_lab} value={_val} />;
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    PickerBox: {
        height: 34,
        borderRadius: 5,
        borderWidth: pixel,
        borderColor: Color.lavender,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    pickerIOSStyle: {
        flex: 1,
        width: Size.width,
    },
    modalBody: {
        width: Size.width,
        height: 200,
        backgroundColor: '#aaa',
        borderTopWidth: 2,
        borderColor: '#222',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    pickerContralBox: {
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#444',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btnModal: {
        minWidth: 60,
        height: 26,
        padding: 2,
        backgroundColor: '#0088cc',
        borderColor: '#222',
        borderRadius: 3,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerBottomBox: {
        flex: 1,
    },
    pickerStyle: {
        color: '#666',
    },
    btnBox : {
		minWidth : 100,
		height : 42,
		borderRadius : 8,
		backgroundColor : 'green',
		flexDirection : 'row',
		justifyContent: 'center',
		alignItems: 'center',
		margin : 5,
		padding : 5,
	},
	btnText : {
		color : '#fff',
        fontSize: 12,
	},
});
