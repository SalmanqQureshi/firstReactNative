import React, { useState } from 'react';

import { View, Image, StyleSheet, TouchableOpacity, ImageProps as ImagePropsBase, ImageStyle, ViewStyle, ActivityIndicator, } from 'react-native';
import { MarginPaddingType } from '../getMarginPadding';

import { Colors, Sizes } from '../../config';
interface ImageProps extends ImagePropsBase {
  margin?: MarginPaddingType;
  padding?: MarginPaddingType;
  size?: number,
  height?: number,
  width?: number | `${number}%`,
  borderRadius?: number,
  onPress?: () => void,
  style?: ViewStyle,
  imgStyle?: ImageStyle,
  resizeMode?: string,
  loading?: boolean,
}

export const ImageButton = ({ source, onPress, style, imgStyle, resizeMode, loading, margin, ...rest }: ImageProps) => {
  const [Loading, setLoading] = useState(false)

  if (!Array.isArray(source)) {
    return (
      loading || Loading ? (
        <ActivityIndicator color={Colors.primary} size={"small"} />
      ) : (
        <TouchableOpacity
          {...rest}
          style={[style]}
          onPress={async (e) => {
            setLoading(true)
            await onPress?.(e)
            setLoading(false)
          }}>
          <Image source={source} resizeMode={resizeMode || 'contain'} style={imgStyle} />
        </TouchableOpacity>)
    );
  }

  return (
    <View style={styles.container}>
      {source.map((item, index) => (
        <TouchableOpacity
          {...rest}
          style={[
            style,
            {
              paddingVertical: Sizes.Base,
            },
          ]}
          key={`button_${index}`}
          onPress={
            Array.isArray(onPress) ? onPress[index] || (() => { }) : onPress
          }>
          <Image source={source[index]} resizeMode="contain" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
