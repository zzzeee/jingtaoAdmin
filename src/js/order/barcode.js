/**
 * 条形码/二维码扫描
 * @auther linzeyong
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Vibration,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

import BarcodeScanner from 'react-native-barcodescanner';
import { Size, pixel } from '../public/globalStyle';
import { Color } from '../public/theme';

export default class Barcode extends Component {
    constructor(props) {
        super(props);

        this.state = {
            barcode: '',
            cameraType: 'back',
            text: 'Scan Barcode',
            torchMode: 'off',
            type: '',
        };
    }

    barcodeReceived(e) {
        if (e.data !== this.state.barcode || e.type !== this.state.type) {
            Vibration.vibrate();
            console.log(e);
            this.setState({
                barcode: e.data,
                text: `${e.data} (${e.type})`,
                type: e.type,
            }, ()=>{
                this.props.navigation.navigate('Order', {
                    number: e.data,
                });
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <BarcodeScanner
                    onBarCodeRead={this.barcodeReceived.bind(this)}
                    style={styles.BarcodeScanner}
                    torchMode={this.state.torchMode}
                    cameraType={this.state.cameraType}
                />
                <View style={styles.statusBar}>
                    <Text style={styles.statusBarText}>请将二维码对准扫描框</Text>
                    <View style={styles.iconBox}>
                        <TouchableOpacity style={styles.iconItem}>
                            <Image source={require('../../images/order/inputOrderNumber.png')} style={styles.iconStyle} />
                            <Text style={styles.iconText}>输入快递单号</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconItem}>
                            <Image source={require('../../images/order/Flashlight.png')} style={styles.iconStyle} />
                            <Text style={styles.iconText}>打开手电筒</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    BarcodeScanner: {
        // width: 220,
        // height: 220,
        flex: 1,
    },
    statusBar: {
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    statusBarText: {
        fontSize: 12,
        color: Color.grayFontColor,
        marginTop: 10,
    },
    iconBox: {
        width: Size.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 40,
        marginBottom: 40,
    },
    iconItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        width: 50,
        height: 55,
    },
    iconText: {
        marginTop: 10,
        fontSize: 13,
        color: '#fff',
    },
});