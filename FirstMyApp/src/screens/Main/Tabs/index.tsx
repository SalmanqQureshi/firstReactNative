import React from 'react';
import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Blank } from '../../_Blank';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackType } from '..';
import { Colors, Fonts, Icons, Metrics } from '../../../config';
import { Icon, Image, Text, useAuth } from '../../../components';
import { CompositeScreenProps } from '@react-navigation/native';
import { Projects, AssignedTask, Notifications, Account } from './_FileGroup';
import { RFValue } from 'react-native-responsive-fontsize';
import { getNotificationCount } from '../../../fcm';
import { Platform } from 'react-native';

export type RootStackParamList = {
  Projects: undefined | {};
  AssignedTask: undefined;
  Notifications: undefined;
  Account: undefined;
};

// const {isLoggedIn,logIn, logOut}=useAuth()
const Tab = createBottomTabNavigator<RootStackParamList>();

export type TabProps<T extends keyof RootStackParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootStackParamList, T>,
  StackScreenProps<MainStackType>
>;
const tabBarOptions = (route: any) => ({
  headerTitleAlign: 'left',
  headerLeftContainerStyle: { marginTop: 26, paddingHorizontal: Metrics.widthRatio(6), },
  headerStyle: { backgroundColor:Colors.background },
  headerTitle(props: any) {
    return (
      <Text size={Platform.OS === 'ios' && (Platform as any).isPad ? 'H1' : 'H2'} font="Medium" style={{ marginTop: 19, marginStart: Metrics.widthRatio(-4), }}>
        {route.name == 'AssignedTask' ? 'Tasks' : props.children}
      </Text>
    );
  },
  
  headerShadowVisible: false,
  headerShown: true,
  tabBarActiveTintColor: Colors.primary,
  tabBarHideOnKeyboard: true,
  
  tabBarLabelStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    fontFamily: Fonts.Regular,
    fontSize:Platform.OS === 'ios' && (Platform as any).isPad ? 16: 12
  },
  tabBarStyle: {
    borderTopWidth: 0,
    // backgroundColor: Colors.onPrimary,
   
    height: Metrics.heightRatio(76),
    paddingTop: 6,
    paddingBottom: 18,
  },

  tabBarIcon: ({ focused, color, size }: any) => {
    let icon;
    let iconSize = 20;

    switch (route.name) {
      case 'Projects':
        icon = focused?Icons.icProjectFill:Icons.icProject;
        break;
      case 'AssignedTask':
        icon = focused?Icons.icTaskAssignedFill:Icons.icTaskAssigned;
        break;
      case 'Notifications':
        icon = focused?Icons.icNotificationFill:Icons.icNotification;
        break;
      case 'Account':
        icon = focused?Icons.icAccountFill:Icons.icAccount;
        break;
    }

    return (
      <Image
        resizeMode="contain"
        source={icon}
        style={{
          width: Platform.OS === 'ios' && (Platform as any).isPad ? 30:20,
          height: Platform.OS === 'ios' && (Platform as any).isPad ? 30:20,
          // marginBottom: 10,
        }}
      />
    );
  },
});
export const Tabs = (props: StackScreenProps<MainStackType, 'Tabs'>) => {
  const [count , setCount] = React.useState(0);
  getNotificationCount().then(res=>(setCount(res),console.log('Notification Count:', res))).catch(res=>res)
  return (
    <Tab.Navigator screenOptions={({ route }) => tabBarOptions(route)}>
      <Tab.Screen component={Projects} name={'Projects'} />
      <Tab.Screen component={AssignedTask} name={'AssignedTask'} options={{title:'Tasks'}}/>
      <Tab.Screen component={Notifications} name={'Notifications'} options={!!count?{tabBarBadge:count}:{}}/>
      <Tab.Screen component={Account} name={'Account'}  />
    </Tab.Navigator>
  );
};
