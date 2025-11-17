import {Colors, Sizes} from '../../config';
import {useState,forwardRef, useImperativeHandle} from 'react';
import {Text} from '../Text';
import { Block } from '../Layout';


interface ButtonGroupProps {
  option: string[];
  onPress?: (arg: string,index:number) => any;
  labelcheck?: string;
}
export interface ButtonGroupRef{
  setIndex: (arg: number) => any;
}
export const TextGroup = forwardRef<ButtonGroupRef,ButtonGroupProps>(({option = [], ...props},ref) => {
  if (!option.length)
    throw new Error('Component TextGroup needs One Option Atleast!!');
  const [Check, setCheck] = useState<string | null>(option[0]);
const setIndex=(val:number)=>{
  setCheck(option[val])
}
useImperativeHandle(ref, ()=>({setIndex}),[])
console.log("Press",ref)  
return (
    
    <Block  row height={Sizes.BUTTON_HEIGHT} margin={{Top:Sizes.Base}}>
      {option.map((item, index) => {
        return (
          <Text
       
            type="Paragraph"
            font="Medium"
            flex
            onPress={() => {
              if (!!props.onPress) {
                props.onPress(item,index);
              }
              setCheck(item);
            }}
            align="center"
            style={{color: Check == item ? Colors.tertiary : Colors.outline}}>
            {item }
            {Check == item&&(<Text color={Colors.tertiary}>{'\n•'}</Text>)}
          </Text>
        );
      })}
    </Block>
    
  );
})
