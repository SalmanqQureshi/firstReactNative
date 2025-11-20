import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Alert, AuthProvider, Block } from './components';
import { RootNavigation } from './screens';
import SplashScreen from 'react-native-splash-screen';
import KeyboardManager from 'react-native-keyboard-manager';
import { LogBox, PermissionsAndroid, Platform, StatusBar } from 'react-native';
import { Colors } from './config';
import FlashMessage from 'react-native-flash-message';
import { setUpPushNotification } from './fcm';
import { navigatorRef } from './services';

export default function App() {

  
  useEffect(() => {
    if (Platform.OS == 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
    if (Platform.OS == "ios") {
      KeyboardManager.setEnable(true)
    } else {
      // StatusBar.setBackgroundColor(Colors.background)
      // StatusBar.setBarStyle('dark-content')
    }
  }, []);


LogBox.ignoreAllLogs()
  return (

    <AuthProvider PersistVersion={1} onLift={() =>{
    setUpPushNotification()
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000)
    }}>
       <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Block flex gradient={[Colors.error, Colors.error]} backgroundColor='#000'>
        <RootNavigation ref={navigatorRef}/>
        {/* <FlashMessage />*/}
      </Block>
      {/* <Alert /> */}
    </AuthProvider>
  );
}
