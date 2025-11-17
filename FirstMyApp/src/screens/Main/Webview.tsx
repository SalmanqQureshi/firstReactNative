import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackType} from '.';
import WV from 'react-native-webview';

export const WebView = (
  props: StackScreenProps<MainStackType, 'WebView'>,
) => {
  return (
    <WV
      source={{
        uri: props.route.params.uri,
      }}
    />
  );
};
