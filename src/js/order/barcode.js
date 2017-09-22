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

import { NavigationActions } from 'react-navigation';
import BarcodeScanner from 'react-native-barcodescanner';
import { Size, pixel } from '../public/globalStyle';
import { Color } from '../public/theme';

export default class Barcode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cameraType: 'back',
            torchMode: 'off',
        };
        this.barcode = null;
        this.bartype = null;
        this.params = null;
    }

    componentWillMount() {
        this.initDatas();
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            this.params = navigation.state.params || {};
        }
    };

    barcodeReceived(e) {
        if (e.data !== this.barcode || e.type !== this.bartype) {
            Vibration.vibrate();
            this.barcode = e.data;
            this.bartype = e.type;
            // console.log(e);
            this.params.logistyNumber = e.data.substring(0, 32);
            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'LogisticsNumber', params: this.params}),
              ]
            })
            this.props.navigation.dispatch(resetAction)
        }
    }

    render() {
        let { cameraType, torchMode } = this.state;
        let model = torchMode == 'off' ? 'on' : 'off';
        let image = torchMode == 'off' ? require('../../images/order/Flashlight.png') : require('../../images/order/Flashlight2.png');
        return (
            <BarcodeScanner
                onBarCodeRead={this.barcodeReceived.bind(this)}
                style={styles.BarcodeScanner}
                torchMode={torchMode}
                cameraType={cameraType}
            >
                <View style={styles.statusBar}>
                    <Text style={styles.statusBarText}>请将二维码对准扫描框</Text>
                    <View style={styles.iconBox}>
                        <TouchableOpacity style={styles.iconItem} onPress={()=>{
                            this.props.navigation.goBack(null);
                        }}>
                            <Image source={require('../../images/order/menu.png')} style={styles.iconStyle} />
                            <Text style={styles.iconText}>返回</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconItem} onPress={()=>{
                            this.setState({torchMode: model});
                        }}>
                            <Image source={image} style={styles.iconStyle} />
                            <Text style={styles.iconText}>打开手电筒</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BarcodeScanner>
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
        // backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    iconStyle: {
        width: 50,
        height: 55,
    },
    iconStyle2: {
        width: 30,
        height: 30,
    },
    iconText: {
        marginTop: 10,
        fontSize: 13,
        color: '#fff',
    },
});