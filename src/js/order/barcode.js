/**
 * 条形码/二维码扫描
 * @auther linzeyong
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Vibration,
    View
} from 'react-native';

import BarcodeScanner from 'react-native-barcodescanner';

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
                    <Text style={styles.statusBarText}>{this.state.text}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    BarcodeScanner: {
        width: 200,
        height: 200,
    },
    statusBar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusBarText: {
        fontSize: 20,
    },
});