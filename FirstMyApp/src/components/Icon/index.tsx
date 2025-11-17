import React from 'react';
import {MarginPaddingType} from '../getMarginPadding';
import {Image} from '../Image';
import {Colors, Icons, Metrics, Sizes} from '../../config';
import {Pressable, StyleSheet} from 'react-native';
import { ViewStyle } from 'react-native-size-matters';
export type IconSourceType = keyof typeof Icons;
export type IconProps = {
  type?:
    | 'Normal'
    | 'Solid'
    | 'Outline'
    | 'Danger'
    | 'Navbar'
    | 'UnSelected'
    | 'DullSecondary';
  color?: string;
  size?: number;
  margin?: MarginPaddingType;
  padding?: MarginPaddingType;
  onPress?: () => any;
  rounded?: boolean;
  name: IconSourceType;
  style:ViewStyle
};

export const Icon = ({
  size = 24,
  color,
  type = 'Normal',
  style,
  ...props
}: IconProps) => {
  return (
    <Pressable
      disabled={!props.onPress}
      style={[!!props.rounded && styles.round, styles[type],style]} 
      onPress={props.onPress}>
      <Image
        {...props}
        style={[
          {height: Metrics.heightRatio(size),  width:  Metrics.heightRatio(size), resizeMode: 'contain', tintColor: color},
          {
            tintColor: !!color
              ? color
              : (type => {
                  switch (type) {
                    case 'Solid':
                      return Colors.onPrimary;
                    case 'DullSecondary':
                    case 'Outline':
                      return Colors.primary;
                    case 'Danger':
                      return Colors.error;
                    case 'UnSelected':
                      return Colors.onSurfaceVariant;
                    case 'Normal':
                    default:
                      return undefined;
                  }
                })(type),
          },
        ]}
        source={Icons[props.name]}
      />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  Normal: {},
  Solid: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    margin: Sizes.Base / 4,
    padding: Sizes.Base / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
  },
  Outline: {borderColor: Colors.primary, backgroundColor: Colors.onPrimary},
  Danger: {
    borderColor: Colors.tertiaryContainer,
    backgroundColor: Colors.tertiaryContainer,
  },
  Navbar: {
    minWidth: Sizes.Button.height,
    maxWidth: Sizes.Button.height,
    minHeight: Sizes.Button.height,
    maxHeight: Sizes.Button.height,
    borderWidth: 0.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.onTertiary,
    marginBottom: Sizes.Base
  },
  UnSelected: {
    borderColor: Colors.surfaceVariant,
    backgroundColor: Colors.surfaceVariant,
  },
  DullSecondary: {
    borderColor: Colors.secondaryContainer,
    backgroundColor: Colors.secondaryContainer,
  },
  IconCircle: {borderColor: Colors.primary, backgroundColor: Colors.primary},
  round: {
    minWidth: Sizes.Button.height,
    maxWidth: Sizes.Button.height,
    minHeight: Sizes.Button.height,
    maxHeight: Sizes.Button.height,
    margin: Sizes.Base / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
  },
});
