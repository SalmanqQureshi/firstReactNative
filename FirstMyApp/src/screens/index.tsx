import React, { forwardRef, Ref } from 'react';
import {useAuth} from '../components';
import {NavigationContainer} from '@react-navigation/native';
import {MainStack} from './Main';
import {AuthStack} from './Auth';
import {Colors, NavigationTheme} from '../config/colors'
export const RootNavigation = forwardRef ((props,ref:Ref<any>) => {
  const {isLoggedIn} = useAuth();

  return (
    <NavigationContainer  ref={ref}>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
});
