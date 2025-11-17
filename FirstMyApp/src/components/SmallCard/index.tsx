import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from '../Text';

import {Block} from '../Layout';
import {Colors, Sizes} from '../../config';
interface ImageDetailsProps {
  title: string;
  message?: string;
  secondary?: string;
  image: ImageSourcePropType;
}

export const SmallCard = (props: ImageDetailsProps) => {
  return (
    <Block style={styles.mainContainer}>
      {!!props.image && <Image source={props.image} style={styles.imgStyle} />}
      <Block flex margin={{Top: 10}} padding={{All:10}}>
        <Text type="H6" font="Medium" numberOfLines={2} >{props.title}</Text>
        <Text type="Small" font="Medium" color={Colors.outline}>{props.message}</Text>
        <Text style={styles.secondaryStyle}>{props.secondary}</Text>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
  //  width: 165,
  width: Sizes.screen.width / 2 - Sizes.Base * 2,

    minHeight: 240,
    backgroundColor: Colors.onPrimary,
    borderRadius: 16,
    margin: Sizes.Base/2,
    overflow: 'hidden',
  },
  titleStyle: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 22,
  },
  messageStyle: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  secondaryStyle: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  imgStyle: {
    width: 165,
    height: 150,
  },
});
