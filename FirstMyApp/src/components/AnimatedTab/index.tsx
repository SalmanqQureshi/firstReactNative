import { Pressable } from 'react-native';
import { Block } from '../Layout';
import { Colors } from '../../config/colors';
import { Text } from '../Text';
import { useMemo } from 'react';
import { Sizes } from '../../config/size';

export const AnimatedTab = (props: {
  options: { id: number | string; label: string }[];
  value: number | string;
  onChange: (value: number | string) => any;
}) => {
  const Number = useMemo(() => props.options.findIndex(s => s.id == props.value), [props.value]);
  return (
    <Block
    flex
      row
      height={Sizes.Controls.height}
      backgroundColor="white"
    style={{borderRadius:10}}
      margin={{Horizontal: 0}}
      padding={{Horizontal:0}}
      shadow>
      <Block
        align='center'
        moti
        height={Sizes.Button.height - 8}
        transition={{
          delay: 20,
          type: 'timing',
        }}
        animate={{
          left: `${(95 / props.options.length) * Number}%`,
        }}
        style={{
          position: 'absolute',
          width: `${102 / props.options.length}%`,
          backgroundColor: Colors.tabBar,
          borderRadius:10
        }}
        margin={{Horizontal:4,Vertical:4}}
      />
      {props.options.map(option => (
        <Pressable
          key={'AnimatedTabsOption-' + option.id}
          style={{ flex: 1 }}
          onPress={() => props.onChange(option.id)}>
          <Block flex align="middle">
            <Text
            size='H6'
              moti
              from={{
                color:
                  option.id == props.value ? Colors.onSurface : Colors.onPrimary,
              }}
              animate={{
                color:
                  option.id == props.value ? Colors.onSurface : Colors.lightTextColor,
              }}
              exitTransition={{
                type: 'timing',
                duration: 2500,
              }}
              fontSize={15}
              font="Medium" >
              {option.label}
            </Text>
          </Block>
        </Pressable>
      ))}
    </Block>
  );
};
