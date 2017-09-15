/**
 * 个人中心 - 设置 - 境淘团队
 * @auther linzeyong
 * @date   2017.08.16
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import Lang, {str_replace} from '../public/language';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';

export default class JTteam extends Component {
    teams = [{
        name: '吴永攀',
        position: '技术总监',
        details: '资深PHP工程师, 一身随意的裤衩, 一手飘乎的代码, 却为了爱情从首都北京扎根宁波。本项目的构建者之一',
    }, {
        name: '权龙云',
        position: '技术副总监',
        details: '全栈工程师, 在韩国工作期间, 因鬼异的编程能力被遣送回国, 为本项目注入了一股来自黑洞空间的神秘力量',
    }, {
        name: '汪颖恺',
        position: '项目经理',
        details: '看似变态怪哥哥的外表, 却是倚杖老太的导盲犬, 技术团队的节奏怂恿者, 公司开路的英勇烈士',
    }, {
        name: '詹敏',
        position: 'UI设计师',
        details: '来自国企的八次元少女, 拿着方方块块的积木, 没有堆砌不起来的世界。 本项目的主要UI设计者',
    }, {
        name: '吴迪',
        position: '标注切图大师',
        details: '社会我迪哥人怂话又多, 虽然看起来又壮又胖, 但标注能力之强, 切图速度之快, 东北没有第二人',
    }, {
        name: '张浩天',
        position: 'IOS工程师',
        details: '著名不知名大学毕业, 乔布斯生前的编程导师, 一秒六行代码, 三天九个项目, 就问你服不服',
    }, {
        name: '罗松超',
        position: 'ANDROID工程师',
        details: '一生没被任何问题难倒过, 能难住他的也只有他自己, 左手写BUG, 右手补BUG的寂寞谁懂!',
    }, {
        name: '林则勇',
        position: 'APP前端工程师',
        details: 'ReactNative的初学者...',
    }, {
        name: '齐福',
        position: 'PHP程序员',
        details: '无缝对接APP后台, 完美呈现数据展示。再牛逼的console.log也打印不出我福的故事',
    }, {
        name: '邓铮',
        position: '网络运维',
        details: '本项目的官方指定测试员, 实时监听服务器的异常事件, 没日没夜的为技术部门解(zhi)决(zao)BUG',
    },];

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    title={'开发团队'}
                    goBack={true}
                    navigation={this.props.navigation}
                />
                <ScrollView contentContainerStyle={styles.scrollStyle}>
                    {this.teams.map((item, index) => {
                        let name = item.name || '';
                        let position = item.position || '';
                        let details = item.details || '';
                        return (
                            <View key={index} style={styles.itemStyle}>
                                <View style={styles.nameView}>
                                    <Text style={styles.nameText}>{name}</Text>
                                    <Text style={styles.positionText}>{`(${position})`}</Text>
                                </View>
                                <View style={styles.detailView}>
                                    <Text style={styles.detailsText}>{details}</Text>
                                </View>
                            </View>
                        );
                    })}
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
        backgroundColor: '#fff'
    },
    scrollStyle: {
        paddingBottom: 15,
    },
    itemStyle: {
        marginTop: 10,
        padding: 15,
    },
    nameView: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    nameText: {
        fontSize: 14,
        color: Color.lightBack,
    },
    positionText: {
        paddingLeft: 10,
        fontSize: 13,
        color: Color.gainsboro,
    },
    detailView: {
        marginTop: 8,
        paddingTop: 6,
        borderTopColor: Color.lavender,
        borderTopWidth: pixel,
    },
    detailsText: {
        fontSize: 13,
        color: Color.lightBack,
        lineHeight: 20,
    },
});