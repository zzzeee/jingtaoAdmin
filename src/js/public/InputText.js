/**
 * 输入框
 * @auther linzeyong
 * @date   2017.05.03
 */

import React, { Component } from 'react';
import {
	StyleSheet,
	Text, 
	View, 
    TextInput, 
} from 'react-native';

import PropTypes from 'prop-types';
import { Size, Color, pixel } from '../public/globalStyle';

export default class InputText extends Component {
    // 默认参数
    static defaultProps = {
        onChange: () => {},
        endEditing: () => {},
    };
    // 参数类型
    static propTypes = {
        onChange: PropTypes.func,
        endEditing: PropTypes.func,
    };
	//构造
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let {
            _ref_,
            vText, 
            defaultValue, 
            pText, 
            pcolor, 
            onChange, 
            endEditing, 
            submitEditing,
            style, 
            isPWD, 
            length, 
            focus, 
            keyType, 
            disEdit,
            onFocus,
            multiline,
         } = this.props;
	    return (
            <TextInput
                ref={_ref_}
                style={[styles.inputStyle, style]}
                onChangeText={onChange}
                value={vText ? vText : null}
                defaultValue={defaultValue ? defaultValue : null}
                placeholder={pText}
                placeholderTextColor={pcolor ? pcolor : '#bbb'}
                secureTextEntry={isPWD ? true : false}
                underlineColorAndroid='transparent'
                maxLength={length ? length : null}
                autoFocus={focus ? true : false}
                keyboardType={keyType ? keyType : 'default'}
                editable={disEdit ? false : true}
                multiline={multiline ? true : false}
                onEndEditing={endEditing}
                onSubmitEditing={submitEditing}
                onFocus={onFocus}
            />
	    );
	}
}

const styles = StyleSheet.create({
	inputStyle : {
        color : Color.lightBack,
        fontSize : 14,
        textAlignVertical: 'center',
        borderWidth: pixel,
        borderColor: Color.lavender,
        borderRadius: 5,
    },
});
