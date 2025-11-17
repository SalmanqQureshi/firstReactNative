import React from 'react';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import {SignIn, Forgot, SignUp} from './_FileGroup';

type AuthStackType = {
  SignIn: undefined;
  SignUp: undefined;
  Forgot: undefined;
};

const Stack = createStackNavigator<AuthStackType>();

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerTransparent: true, headerTitle: ''}}>
      <Stack.Screen component={SignIn} name="SignIn" />
      <Stack.Screen component={SignUp} name="SignUp" />
      <Stack.Screen component={Forgot} name="Forgot" options={{headerShown:false}}/>
    </Stack.Navigator>
  );
};

export type AuthProps<ScreenName extends keyof AuthStackType> =
  StackScreenProps<AuthStackType, ScreenName>;
