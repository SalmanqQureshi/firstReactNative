import React from 'react';
import {I18nManager, Platform, Text as TextBase, TextProps} from 'react-native';
import {Colors, Fonts, Sizes} from '../../config';
import {MarginPaddingType, getMarginPadding} from '../getMarginPadding';
// import { MotiText } from 'moti';
import { RFValue } from 'react-native-responsive-fontsize';

const normalize = (size: number) => (Platform.OS == "ios" && Platform.isPad)?(size*1.125):size;

interface Props extends TextProps {
  font?: keyof typeof Fonts;
  color?: keyof typeof Colors;
  size?: keyof typeof Sizes.Text;
  align?: 'center' | 'left' | 'right' | 'middle' | 'top' | 'bottom';
  margin?: MarginPaddingType;
  lineHeight?: number;
  letterSpacing?: number;
  padding?: MarginPaddingType;
  fill?: boolean;
  moti?:boolean
}
export function Text(props: Props) {
  const {
    style,
    font = 'Regular',
    color = 'onBackground',
    size ="Body",
    children,
    margin,
    fill,
    padding,
    ...rest
  } = props;
  const Styles = [
    styles.txt,
    !!font && {fontFamily: Fonts[font]},
    !!color && {color: Colors[color]},
    !!size && {fontSize: normalize(Sizes.Text[size])},
    !!props.lineHeight && {lineHeight: props.lineHeight},
    !!props.letterSpacing && {letterSpacing: props.letterSpacing},
    !!props.align && styles[props.align],
    !!props.fill && {flex: 1},
    !!props.margin && getMarginPadding(props.margin, 'margin'),
    !!props.padding && getMarginPadding(props.padding, 'padding'),
    !!style && style,
  ].filter(s => !!s);
  if (!!props.moti) {
    return (
      <Text suppressHighlighting={true} style={Styles} {...rest}>
        {children}
      </Text>
    );
  }
  return (
    <TextBase suppressHighlighting={true} style={Styles} {...rest}>
      {children}
    </TextBase>
  );
}

const styles = {
  txt: {
    color: Colors.onBackground,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    fontSize: normalize(14),
  },
  muted: {color: Colors.onBackground},
  neutral: {color: Colors.onSecondary},
  Italic: {fontStyle: 'italic'},
  center: {textAlign: 'center'},
  left: {},
  right: {textAlign: 'right'},
  middle: {textAlignVertical: 'center'},
  top: {textAlignVertical: 'top'},
  bottom: {},
};
