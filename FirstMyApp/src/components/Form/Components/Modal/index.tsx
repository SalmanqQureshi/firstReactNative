import React, { PropsWithChildren } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import { Colors, Sizes } from '../../../../config';

import ReactNativeModal from 'react-native-modal';
import { Block } from '../../../../components';

export interface ModalProps extends PropsWithChildren {
  type?: 'Bottom' | 'Center';
  Visible?: boolean;
  onBackPress: () => any;
  rest?: any
}

export const Modal = ({
  type = 'Center',
  Visible,
  onBackPress,
  children,
  rest
}: ModalProps) => {
  return (
    <ReactNativeModal
      style={[styles[type]]}
      onBackdropPress={() => {
        onBackPress();
      }}
      isVisible={Visible}
      propagateSwipe={true}
      {...rest}>
      <Block onPress={() => onBackPress()} style={[styles.ModalContainer, styles['ModalContainer' + type]]}>
        {children}
      </Block>
      <SafeAreaView style={{ backgroundColor: Colors.background }} />
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  ModalContainer: {
    flex: 1,
    borderRadius: 12,
    // backgroundColor: Colors.error,
  },
  ModalContainerBottom: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: Sizes.Base * 0.8,
  },
  ModalContainerCenter: {
    marginHorizontal: 16,

  },
  Bottom: {
    position: 'absolute',
    bottom: 0,
    margin: 0,
    borderBottomLeftRadius: 0,
    alignSelf: 'center',
    width: '100%',
  },
  Center: {
    paddingTop: Sizes.Base * 0.3,
    paddingBottom: Sizes.Base,
    borderRadius: 12,
  },
});
