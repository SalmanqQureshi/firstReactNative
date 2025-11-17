import React, {ReactElement, useEffect, useState} from 'react';
import {
  StyleSheet,
  Animated,
  View,
  ViewProps,
  ImageStyle,
  ImageProps,
  ImageSourcePropType,
  ViewStyle,
  useAnimatedValue
} from 'react-native';
import {Colors, Sizes} from '../../config';
import {Block, Image, Text} from '..';
// import {MotiImage, useDynamicAnimation} from 'moti';
// import {MotiView} from 'moti';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/elements';

interface TrainingViewProps extends ViewProps {
  isUserProfile?: boolean;
  imageStyle?: ImageStyle;
  source: ImageSourcePropType;
  headerComponent?: ReactElement;
  headerTitle: string;
  separation?: number;
  scrollContentStyle?: ViewStyle;
}

export const TrainingView = ({
  separation = 30,
  ...props
}: TrainingViewProps) => {
  const navigation = useNavigation();
  const [isOnTop, setOnTop] = useState(true);
  const headerHeight = useHeaderHeight();
  const animation = useAnimatedValue(() => {
    // optional function that returns your initial style
    return {
      height: Sizes.screen.height * 0.6,
    };
  });
  useEffect(() => {
    navigation?.setOptions({
      headerBackground: () =>
        !isOnTop ? (
          <View
            from={{opacity: 0}}
            animate={{opacity: 1}}
            style={{flex: 1, backgroundColor: Colors.background}}
          />
        ) : null,
      headerTitle: props.headerTitle && isOnTop ? '' : props.headerTitle,
      headerTitleStyle: {color: Colors.onBackground},
    });
  }, [isOnTop]);

  return (
    <View
      style={{
        backgroundColor: Colors.background,
        height: Sizes.screen.height,
      }}>
      {!!props.source && (
        <Image
          transition={{type: "spring"}}
          state={animation}
          style={[
            {
              width: Sizes.screen.width,
              position: 'absolute',
            },
            props.imageStyle,
          ]}
          source={props.source}
        />
      )}
      <Animated.ScrollView
        bounces={false}
        onScroll={e => {
          animation.animateTo({
            height: Sizes.screen.height * 0.6 - e.nativeEvent.contentOffset.y,
          });
          if (Sizes.screen.height * 0.3 - e.nativeEvent.contentOffset.y < 41) {
            setOnTop(false);
          } else {
            setOnTop(true);
          }
        }}
        showsVerticalScrollIndicator={false}>
        {props.headerComponent && (
          <Block
            style={{
              width: Sizes.screen.width,
              height: '40%',
              position: 'absolute',
            }}>
            {props.headerComponent}
          </Block>
        )}
        <Block
          margin={{Top: Sizes.screen.height * (separation / 94)}}
          style={styles.scrollContentBlock}
          backgroundColor={Colors.background}>
          {props.children}
        </Block>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
  },
  scrollContentBlock: {
    minHeight: Sizes.screen.height * 0.4,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: Sizes.Base,
    backgroundColor: Colors.background,
  },
  headerBlock: {
    width: Sizes.screen.width,
    height: '40%',
    position: 'absolute',
  },
  ImageBackgroundStyle: {
    width: Sizes.screen.width,
    position: 'absolute',
    height: '65%',
  },
});
