import { Pressable, StyleSheet } from 'react-native';
import { Colors, Icons, Images, Sizes } from '../../config';
import { Block } from '../Layout';
import { Text } from '../Text';
import { Image } from '../Image';
import { ImageButton } from '../ImageButton';

interface RatingProps {
    name?: string;
    month?: string;
    email?: string;
    image?: any;
    onPress?: () => any;
}

export const EmployeeTabs = ({ option = [], ...props }: RatingProps) => {
    return (
        <Pressable style={styles.PetCard}>
            <Block row>
                <Image
                    source={props.image}
                    resizeMode="contain"
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 4,
                        marginLeft: 4,
                    }}
                />
                <Block
                    marginLeft={10}
                    gap={0}
                    margin={{ Top: 6 }}>
                    <Text font="SemiBold" fontSize={15} margin={{ Top: 4 }}>
                        {props.name}
                    </Text>
                    <Text font="Regular" size="Body">
                        {props.email}
                    </Text>
                </Block>
                {/* <ImageButton
                    imgStyle={{
                        alignSelf: 'flex-end',
                        width: 12,
                        height: 12
                    }}
                    source={Icons.icClose}
                    onPress={() =>{props?.onPress()}}
                /> */}
            </Block>
        </Pressable>
    );
};
const styles = StyleSheet.create({
    PetCard: {
        backgroundColor: Colors.onPrimary,
        padding: 4,
        borderRadius: 6,
        marginRight: 15,
        paddingRight: 6,
        marginTop: 16
    },
});
