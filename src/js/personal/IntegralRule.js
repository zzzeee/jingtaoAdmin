/**
 * 个人中心 - 我的积分 - 积分规则
 * @auther linzeyong
 * @date   2017.04.26
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    ScrollView,
    Animated,
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {Rule, str_replace} from '../public/language';

export default class MyIntegral extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].integralRule}
                    goBack={true}
                    navigation={this.props.navigation}
                />
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.topBox}>
                        {Rule.map((item, index) => this.textBlock(item, index))}
                    </View>
                </ScrollView>
            </View>
        );
    }

    textBlock = (item, index) => {
        let title = item.title || '';
        let content = item.content || '';
        return (
            <View key={index} style={styles.paragraph}>
                <Text style={styles.titleStyle}>{title}</Text>
                <Text style={styles.contentStyle}>{content}</Text>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        backgroundColor: Color.lightGrey,
        paddingBottom: 10,
    },
    paragraph: {
        padding: 15,
        backgroundColor: '#fff',
        marginTop: 10,
    },
    titleStyle: {
        fontSize: 15,
        color: Color.mainColor,
        marginBottom: 15,
    },
    contentStyle: {
        fontSize: 12,
        lineHeight: 22,
        color: Color.lightBack,
        paddingBottom: 5,
    },
});