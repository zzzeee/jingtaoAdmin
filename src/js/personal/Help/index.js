/**
 * 个人中心 - 帮助中心
 * @auther linzeyong
 * @date   2017.06.20
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import Lang, {str_replace} from '../../public/language';
import { Size, Color, PX, pixel, FontSize } from '../../public/globalStyle';
import AppHead from '../../public/AppHead';

export default class Help extends Component {
    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].contactUs}
                    goBack={true}
                    navigation={navigation}
                />
                <View style={{backgroundColor: '#fff'}}>
                    <TouchableOpacity onPress={()=>navigation.navigate('Privacy')} style={styles.rowMain}>
                        <Text style={styles.rowText}>{Lang[Lang.default].privacyProtection}</Text>
                        <Image source={require('../../../images/list_more.png')} style={styles.rowRightIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate('Transaction')} style={[styles.rowMain, {
                        borderBottomWidth: 0,
                    }]}>
                        <Text style={styles.rowText}>{Lang[Lang.default].transactionTerms}</Text>
                        <Image source={require('../../../images/list_more.png')} style={styles.rowRightIcon} />
                    </TouchableOpacity>
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
        backgroundColor: Color.floralWhite,
    },
    rowMain: {
        width: Size.width - PX.marginLR,
        marginLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        height: PX.rowHeight1,
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
        flexDirection : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowText: {
        fontSize: 14,
        color: Color.lightBack,
    },
    rowRightIcon: {
        width: 26,
        height: 26,
    },
});