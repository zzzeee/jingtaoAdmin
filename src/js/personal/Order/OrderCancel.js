/**
 * 订单列表 - 取消订单
 * @auther linzeyong
 * @date   2017.06.24
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';

import PropTypes from 'prop-types';
import Utils from '../../public/utils';
import Urls from '../../public/apiUrl';
import { Size, PX, pixel, Color } from '../../public/globalStyle';
import Lang, {str_replace} from '../../public/language';

export default class OrderCancel extends Component {
    // 默认参数
    static defaultProps = {
        isShow: false,
    };
    // 参数类型
    static propTypes = {
        isShow: PropTypes.bool.isRequired,
        orderID: PropTypes.string.isRequired,
        mToken: PropTypes.string.isRequired,
        hideWindow: PropTypes.func,
        cancelCallback: PropTypes.func,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            select: 0,
        };
        this.cancelTexts = [
            '不想买了',
            '信息填写错误',
            '商品规格选择错误',
            '重复下单,下单错误',
            '忘记使用优惠券、积分',
            '其他原因',
        ];
    }

    componentWillMount() {
        if(this.props.coupons) {
            this.setState({
                datas: this.props.coupons,
            });
        }
    }

    render() {
        let {
            isShow,
            hideWindow,
        } = this.props;
        if(!isShow) return null;
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={isShow}
                onRequestClose={() => {
                }}
            >
                <View style={styles.modalHtml}>
                    <View style={styles.flex}>
                        <TouchableOpacity style={styles.flex} activeOpacity={1} onPress={hideWindow} />
                    </View>
                    <View style={styles.modalBody}>
                        <View style={styles.fristRow}>
                            <Text style={styles.txtStyle1}>{Lang[Lang.default].receiveCoupon}</Text>
                            <TouchableOpacity onPress={hideWindow} style={styles.rowCloseBox}>
                                <Image style={styles.rowCloseImg} source={require('../../../images/close.png')} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <View style={styles.secondRow}>
                                <Text style={styles.txtStyle2}>选择取消订单的原因</Text>
                            </View>
                            {this.cancelTexts.map((item, index) => {
                                let img = this.state.select == index ?
                                    require('../../../images/car/select.png') :
                                    require('../../../images/car/no_select.png');
                                return (
                                    <TouchableOpacity key={index} onPress={()=>{
                                        this.setState({select: index,});
                                    }} style={styles.btnRowStyle}>
                                        <Image source={img} style={styles.selectImg} />
                                        <Text style={styles.txtStyle2}>{item}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                            <TouchableOpacity style={styles.btnUpdate} onPress={this.clickOrderCancel}>
                                <Text style={styles.txtStyle3}>{Lang[Lang.default].determine}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    }

    clickOrderCancel = () => {
        let { orderID, mToken, cancelCallback } = this.props;
        if(orderID && mToken) {
            Utils.fetch(Urls.updateOrderStatu, 'post', {
                mToken: mToken,
                oStatus: 2,
                orderNum: orderID,
                oCancelReason: this.cancelTexts[this.state.select],
            }, (result)=>{
                console.log(result);
                if(result) {
                    let type = 1;
                    let msg = result.sMessage || null;
                    let ret = result.sTatus || 0;
                    if(ret == 1) {
                        type = 2;
                        msg = Lang[Lang.default].updateSuccess;
                    }
                    cancelCallback(type, msg);
                }
            });
        }
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    modalHtml: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, .3)',
    },
    modalBody: {
        backgroundColor: '#fff',
    },
    txtStyle1: {
        fontSize: 16,
        color: Color.lightBack,
    },
    txtStyle2: {
        fontSize: 13,
        color: Color.lightBack,
    },
    txtStyle3: {
        fontSize: 18,
        color: '#fff',
    },
    fristRow: {
        height: PX.rowHeight1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
    },
    rowCloseBox: {
        width: PX.iconSize26,
        height: PX.iconSize26,
        position: 'absolute',
        right: 10,
        top: 7,
    },
    rowCloseImg: {
        width: PX.iconSize26,
        height: PX.iconSize26,
    },
    secondRow: {
        height: PX.rowHeight2,
        justifyContent: 'center',
        paddingLeft: PX.marginLR,
    },
    btnRowStyle: {
        height: PX.rowHeight2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: PX.marginLR,
    },
    selectImg: {
        width: 20,
        height: 20,
        marginRight: 15,
    },
    btnUpdate: {
        height: PX.rowHeight1,
        marginTop: 10,
        backgroundColor: Color.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
});