import { Icon } from "../Icon";
import { Block } from "../Layout";
import { Text } from "../Text";

export const ItemRow = ({title, icon,style,row=false,value}: any) => (
    <Block row={row} style={style}>
      {icon&&<Icon name={icon} />}
      <Text margin={{Horizontal: 3}} style={{alignSelf:'center'}} size="H6">{title}</Text>
      {value&&<Text margin={{Horizontal: 3}} size="H6">{value}</Text>}
    </Block>
  );

  //<ItemRow title={'16 July - 18 July - 20 July'} icon="icCalendar" />