import {ScrollView, StyleSheet} from 'react-native';

import {Images} from '../../config/images';
import {Colors} from '../../config';
import {useState} from 'react';
import {Block} from '../Layout';
import {ButtonProps, SmallButton} from '../Button';

interface ButtonGroupProps {
  option: ButtonProps[];
  firstButton?: ButtonProps;
  onPress?: (arg: ButtonProps) => any;
  labelcheck?:string
}

export const ButtonGroup = ({option = [], ...props}: ButtonGroupProps) => {
  if(!option.length)throw new Error("Component TextGroup needs One Option Atleast!!")
  const [Check, setCheck] = useState<ButtonProps | null>(option[0]);
  return (
    <Block flex>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {!!props.firstButton && (
          <SmallButton
          icon={Images.icAdd}
          type={"DullSecondary"}
          {...props.firstButton}
          />
        )}
        {option.map((item, index) => {
          return (
            <SmallButton
              {...item}
              onPress={e => {
                if (!!item.onPress) {
                  item.onPress(e);
                  console.log("e",e)
                }
                if (!!props.onPress) {
                  props.onPress(item);
                }
                setCheck(item);
              }}
              type={Check?.label == item.label ? 'Solid' : 'UnSelected'}
            />
          );
        })}
      </ScrollView>
    </Block>
  );
};