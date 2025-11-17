import { Pressable, StyleSheet, Image, ImageBackground } from 'react-native';
import { Colors, Images, Metrics } from '../../config';
import { Block } from '../Layout';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { useAuth } from '../useAuth';
import { _checkCurrentUser } from '../../Utility';

interface EarningProps {
  title?: string;
  _id?: string;
  Amount?: Number;
  backgruondName: string;
  onPress?: () => void
  onPressDelete?: () => void
}




export const AssignedCard = ({ option = [], ...props }: EarningProps) => {
  const { user } = useAuth()
  const words = props.title?.split(' '); // Split string into words


  return (
    <Block style={styles.EarningCard} onPress={props.onPress} row >
      <Block row style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image source={Images.roundBackgroundImage} style={{ width: Metrics.heightRatio(40), height: Metrics.heightRatio(40) }} />
        <Block row align='center' style={{ position: 'absolute', }}>

          <Text font="Regular" size="H5" color={'textNumber'}>
            {/* {props.title?.at(0) } */}
            {`${words[0].charAt(0).toUpperCase()}`}

            {/* {props.title?.split(' ')              // Split the string into words
    .map(word => word[0])    // Get the first letter of each word
    .join(' ')} */}
            {/* //+" "+ props.title?.split('') } */}
          </Text>
          {
            words?.length > 1 && (
              <Text font="Regular" size="H5" color={'textNumber'} >
                {`${words[1].charAt(0).toUpperCase()}`}
              </Text>
            )
          }
        </Block>
      </Block>
      <Block gap={5} margin={{ Horizontal: 12 }}>
        <Text style={{}} color="outline" size='Body' font="Regular" margin={{ Top: 5 }}>
          {'Task ID: '}
          <Text font='Regular' color='textNumber' size='Body'>
            {props?.short_id}
          </Text>
        </Text>
        <Text font="Regular" size="H5" numberOfLines={1} style={{ width: 240 }}>
          {props.title}
        </Text>
      </Block>
      { !!_checkCurrentUser(props.assignees,user) && (<Block align='right' flex  style={{ alignSelf: 'center' }} pointerEvents='box-none' onPress={() => { props.onPressDelete() }}>
        <Icon name='icTrash' color='red' size={24} />
      </Block>)
      }

    </Block>
  );
};
const styles = StyleSheet.create({
  EarningCard: {
    flex: 1,
    backgroundColor: Colors.onSecondary,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 1,
    paddingVertical: 12,
    padding: 12,
  },
});
