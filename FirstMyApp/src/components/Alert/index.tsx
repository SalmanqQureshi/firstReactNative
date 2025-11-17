import * as React from 'react';
import {Button, ButtonProps} from '../Button';
import ReactNativeModal from 'react-native-modal';
import {Block} from '../Layout';
import {Text} from '../Text';
import {Image} from '../Image';
import {ImageSourcePropType, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Images} from '../../config';

export interface AlertProps {
  title: string;
  message?: string;
  options?: ButtonProps[];
  image?: ImageSourcePropType;
}
const AlertRef = React.createRef<{
  show: (props: AlertProps) => any;
  hide: () => any;
}>();
export const Alert = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [props, setProps] = React.useState<AlertProps | null>(null);
  const show = ({options = [], ...props}: AlertProps) => {
    setProps({...props, options});
    setModalVisible(true);
  };
  const hide = () => {
    setProps(null);
    setModalVisible(false);
  };
  React.useImperativeHandle(AlertRef, () => ({
    show,
    hide,
  }));
  return (
    <ReactNativeModal isVisible={modalVisible}>
      <Block align="center" style={styles.mainContainer}>
        <TouchableOpacity style={styles.iconStyle} onPress={hide}>
          <Image source={Images.icModalClose} />
        </TouchableOpacity>
        {!!props && (
          <>
            <Text style={styles.titleStyle}>{props.title}</Text>
            <TouchableOpacity>
              <Image source={props?.image} />
            </TouchableOpacity>
            <Text style={styles.messageStyle}>{props.message}</Text>
            <Block row align="center" style={{top: 15}}>
              {props.options?.map(s => (
                <Button {...s} />
              ))}
            </Block>
          </>
        )}
      </Block>
    </ReactNativeModal>
  );
};
export const showAlert = (props: AlertProps) => AlertRef.current?.show(props);
export const hideAlert = () => AlertRef.current?.hide();
const styles = StyleSheet.create({
  mainContainer: {
    minHeight: 200,
    width: '100%',
    backgroundColor: Colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
  },
  iconStyle: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  titleStyle: {
    fontSize: 20,
    color: Colors.onSecondaryContainer,
    lineHeight: 45,
  },
  messageStyle: {
    fontSize: 13,
    color: Colors.onSecondaryContainer,
    marginTop: 10,
  },
});
