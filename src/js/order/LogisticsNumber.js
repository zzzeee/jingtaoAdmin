/**
 * 订单 - 物流号填写页
 * @auther linzeyong
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

import { Size, pixel } from '../public/globalStyle';
import { Color } from '../public/theme';
import InputText from '../public/InputText';
import AppHead from '../public/AppHead';

export default class LogisticsNumber extends Component {
    constructor(props) {
        super(props);
    }

    //设置物流单号
    setLogistyNumber = (value) => {
        this.setState({mobile: value});
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead
                    title='发货页'
                    goBack={true}
                    navigation={navigation}
                />
                <View style={styles.flex}>
                    <View style={styles.itemBox}>
                        <View style={styles.textBox}>
                            <Text style={styles.itemTitle}>物流单号:</Text>
                        </View>
                        <View style={styles.inputBox}>
                            <InputText
                                vText={''}
                                onChange={this.setLogistyNumber}
                                length={32}
                                style={styles.inputStyle}
                                keyType={"numeric"}
                            />
                            <TouchableOpacity onPress={()=>{
                                navigation.navigate('Barcode');
                            }} style={styles.inputIcon}>
                                <Image style={styles.inputIconImg} source={require('../../images/order/barcode.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
    },
    itemBox: {
        marginTop: 20,
        paddingLeft: 15,
        paddingRight: 15,
    },
    textBox: {
        height: 44,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 13,
        color: Color.mainFontColor,
    },
    inputBox: {

    },
    inputStyle: {
        height: 40,
    },
    inputIcon: {
        position: 'absolute',
        right: 0,
        top: 0,
        padding: 10,
    },
    inputIconImg: {
        width: 20,
        height: 20,
    },
});