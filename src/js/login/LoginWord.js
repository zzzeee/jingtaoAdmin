/**
 * 登录 - 境淘用户协议
 * @auther linzeyong
 * @date   2017.06.11
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
} from 'react-native';

import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import LoginWord from '../datas/ServiceInstructions';

export default class Login extends Component {

    render() {
        let { navigation } = this.props;
        let scrollref = null;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].jingtaoUserAgreement}
                    goBack={true}
                    navigation={navigation}
                    onPress={() => {
                        scrollref && scrollref.scrollTo({x: 0, y: 0, animated: true});
                    }}
                />
                <ScrollView ref={(_ref)=>scrollref = _ref} contentContainerStyle={styles.scrollStyle}>
                    <Text style={styles.LoginWordText}>{LoginWord}</Text>
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
        padding: PX.marginLR,
        marginTop: PX.marginTB,
        backgroundColor: '#fff',
    },
    LoginWordText: {
        fontSize: 13,
        color: Color.lightBack,
        lineHeight: 18,
    },
});