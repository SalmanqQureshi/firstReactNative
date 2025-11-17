import {Platform, TextInput, TextInputBase, ViewStyle} from 'react-native';
import {Colors} from '../../config/colors';
import {Sizes} from '../../config/size';
import {Icon} from '../Icon';
import {Block} from '../Layout';
import { useDebouncedFunction, useDebouncedState } from '../useDebounce';
import { RFValue } from 'react-native-responsive-fontsize';
import { Metrics } from '../../config';
// import {useDebounce} from '../useDebounce';

export const SearchBar = ({
  onChange,
  returnKeyType,
  Style
}: {
  onChange?: (text: string) => any;
  returnKeyType?: string | any;
  Style?:ViewStyle
}) => {
  const [D, Value, setValue] = useDebouncedState('',500, onChange);

  return (
    <Block
      shadow
      row
      height={Metrics.heightRatio(Sizes.Button.search)}
      backgroundColor={Colors.onPrimary}
      margin={{Vertical: 4}}
      padding={{Horizontal: 16}}
      style={[{alignItems: 'center',borderRadius:10},Style]}
      >
      <Icon size={18} name="icMagnifier" />
      <TextInput
        returnKeyType={returnKeyType}
        placeholder="Search here.."
        value={Value}
        onChangeText={s => setValue(s)}
        placeholderTextColor={Colors.lightTextColor}
        style={{
          flex: 1,
          marginLeft: Platform.OS=='ios'? 12 : 7,
          fontSize: 16,
          color:Colors.textColors
        }}
      />
    </Block>
  );
};
