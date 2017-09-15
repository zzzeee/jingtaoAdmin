/**
 * APP头部
 * @auther linzeyong
 * @date   2017.06.02
 */

import React, { Component } from 'react';
import {
	StyleSheet,
	Text, 
	View,
	Image,
	TouchableOpacity,
} from 'react-native';

import { Size, pixel, PX, Color, FontSize } from '../public/globalStyle';

export default class AppHead extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {};
  	}

	render() {
		let {
			title,
			onPress,
			center,
			float,
			style,
			textStyle,
			left,
			goBack,
			navigation,
			leftPress,
			right,
		} = this.props;
		let defaultLeft = goBack ?
			<TouchableOpacity onPress={()=>{
				if(leftPress) {
					leftPress();
				}else {
					navigation && navigation.goBack(null);
				}
			}} style={{padding: 5,}}>
				<Image source={require("../../images/back.png")} style={styles.backImg} />
			</TouchableOpacity>
			: null;
	    return (
			<View style={[styles.topBox, float ? {position: 'absolute', left: 0, right: 0}: {}, style]}>
				<View style={styles.middleBox}>
					{center ?
						center :
						<Text style={[styles.title, textStyle]} onPress={onPress}>{title}</Text>
					}
				</View>
				<View style={[styles.sideBox, {left: 10}]}>
					{left ? left : defaultLeft}
				</View>
				<View style={[styles.sideBox, {right: 10}]}>
					{right ? right : null}
				</View>
			</View>
	    );
	}
}

var styles = StyleSheet.create({
	topBox : {
		height: PX.headHeight,
		flexDirection : 'row',
		justifyContent : 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 0.5,
        shadowOffset: {"height": 0.5},
        elevation: 4,
		borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
	},
	sideBox : {
		height: PX.headHeight,
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		top: 0,
	},
	middleBox : {
		flex : 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title : {
		padding: 5,		//增大点击面积
		color: Color.mainColor,
		fontSize: FontSize.headFontSize,
		fontWeight: FontSize.headFontWeight,
	},
	backImg: {
		width: PX.iconSize26,
		height: PX.iconSize26,
	},
});
