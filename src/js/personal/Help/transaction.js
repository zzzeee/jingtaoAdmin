/**
 * 个人中心 - 帮助中心 - 交易条款
 * @auther linzeyong
 * @date   2017.06.20
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import Lang, {str_replace, Transaction} from '../../public/language';
import { Size, Color, PX, pixel, FontSize } from '../../public/globalStyle';
import AppHead from '../../public/AppHead';

export default class HelpTransaction extends Component {
    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].contactUs}
                    goBack={true}
                    navigation={this.props.navigation}
                />
                <ScrollView contentContainerStyle={styles.scrollStyle}>
                    <Text style={styles.defaultFont}>{Transaction}</Text>
                </ScrollView>
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
        backgroundColor: Color.lightGrey,
    },
    scrollStyle: {
        padding: 15,
        paddingTop: 20,
    },
    defaultFont: {
        fontSize: 14,
        color: Color.lightBack,
        lineHeight: 18,
    },
});