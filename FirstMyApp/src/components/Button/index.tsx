import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React, { useState } from 'react';
import { Colors, Metrics, Sizes } from '../../config';
import { Text } from '../Text';
import { Block } from '../Layout';
export interface ButtonProps extends PressableProps {
  type?: 'Solid' | 'Outline' | 'Danger' | 'UnSelected' | 'DullSecondary';
  label: string;
  loading?:boolean;
  icon?: ImageSourcePropType;
  style?: ViewStyle
  styleText?:TextStyle
}

export const Button = ({
  type = 'Solid',
  label,
  icon,
  style,
  styleText,
  ...props
}: ButtonProps) => {
  const [loading,setLoading] = useState(false)
  const color=(type => {
    switch (type) {
      case 'Solid':
        return "onPrimary";
      case 'Outline':
        return "primary";
      case 'Danger':
        return "onError";
        case 'DullSecondary':
          return "shadow";
      default:
        return "onPrimary";
    }
  })(type)
  return (
    <Pressable
    disabled={props.loading||loading}
      style={[
        styles.container,
        styles[type],
        style
      ]}
      {...props}
      onPress={async (e) =>{
        setLoading(true)
        await props.onPress?.(e)
        setLoading(false)
      }}
      >
      {icon && <Image style={styles.iconStyle} source={icon} />}
      <Block flex row align="center">
        {props.loading || loading?(
          <ActivityIndicator color={Colors[color]}/>
        ):(<Text
          size="H5"
          font="Medium"
          color={color}
          {...styleText}
          style={{marginLeft:icon && 24}}>
          {label}
        </Text>)}
      </Block>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: Metrics.heightRatio(Sizes.Button.height),
    maxHeight:  Metrics.heightRatio(Sizes.Button.height),
    // margin: Sizes.Base / 3.5,
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  Solid: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  Outline: { borderColor: Colors.primary, backgroundColor: Colors.onPrimary },
  Danger: {
    borderColor: Colors.error,
    backgroundColor: Colors.error,
  },
  UnSelected: {
    borderColor: Colors.surfaceVariant,
    backgroundColor: Colors.surfaceVariant,
  },
  DullSecondary: {
    borderColor: Colors.chatsideColor,
    backgroundColor: Colors.chatsideColor,
  },
  IconCircle: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  iconStyle: {
    position: 'absolute',
    left: 16,
    top: 6,
  },
});
