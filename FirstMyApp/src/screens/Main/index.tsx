import React, { useEffect } from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import {
  ProjectDetail,
  Tabs,
  TaskDetail,
  WebView,
  EditProfile,
  ChangePasswod,
  AboutUs,
  NotificationSettings,
  ProjectDetailFolder,
  ProjectDetailPdfList,
  PdfList2,
  ProjectDetailPdfPage,
  PrivacyPolicy,
  RootStackParamList,
  AddProject,
  AddTask,
  MultiplePdfViewer,
  PdfBulkUpload
} from './_FileGroup';
import { Button, Icon, Text, useAuth } from '../../components';
import { Colors, Metrics } from '../../config';
import { CompositeScreenProps, useNavigation } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { connectSocket, useSocket } from '../../components/useSocket';
import { getCryptoToken } from '../../components/getCryptoToken';
import { Alert } from 'react-native';
import { AuthToken, setLogoutHandler } from '../../components/ApiService';
import YourListScreen from './PdfList2';

export type MainStackType = {
  Tabs: undefined;
  WebView: {
    uri: string;
    title: string;
  };
  ProjectDetail: undefined | {}
  TaskDetail: undefined | {}
  EditProfile: undefined | {}
  ChangePassword: undefined | {}
  AboutUs: undefined | {}
  NotificationSettings: undefined | {}
  ProjectDetailFolder: undefined | {}
  ProjectDetailPdfList: undefined | {}
  PdfList2: undefined | {}
  ProjectDetailPdfPage: undefined | {}
  PrivacyPolicy: undefined | {}
  AddProject: undefined | {}
  AddTask: undefined | {}
  MultiplePdfViewer: undefined | {}
  PdfBulkUpload: undefined | {}
};

const routes = {
  ProjectDetail: 'Projects',
  TaskDetail: 'Task',
  EditProfile: 'Edit Profile',
  ChangePassword: 'Change Password',
  AboutUs: 'About',
  NotificationSettings: 'Notification Settings',
  ProjectDetailFolder: 'Project Detail Folder',
  ProjectDetailPdfList: 'Project Detail PdfList',
  PdfList2: 'Project Detail PdfList',
  // ProjectDetailPdfPage: 'ASF Trench block',
  PrivacyPolicy: 'Privacy Policy',
  AddProject: 'Add Project',
  AddTask: 'Add Task',
  MultiplePdfViewer: 'Multiple PDF Viewer',
  PdfBulkUpload: 'Pdf Bulk Upload',
};

const Stack = createStackNavigator<MainStackType>();

export const MainStack = () => {
  const { goBack } = useNavigation()

  const {user} = useAuth()
  console.log('Auth',user)
    const navigation = useNavigation()

  useEffect(() => {
    connectSocket()({
      // authorization: getCryptoToken(user?.access_token),
      token: user?.access_token,
      // device_type: Platform.OS,
      // device_token: '123456'
    }, user?.access_token)
  }, [])

  useSocket({
    "connect": () => {
      //  Alert.alert("SocketConnected")
    }
  })
  useEffect(() => {
    setLogoutHandler(() => {
      AuthToken.token = '';
      navigation.navigate('SignIn'); // <- this works
    });
  }, []);
  return (
    <Stack.Navigator

      screenOptions={({ route }) => ({
        headerShadowVisible: false,
        headerLeft: () => (
          <Icon
            onPress={() => goBack()}
            margin={{ Left: Metrics.iPadHeightRatio(12), }}
            size={60}
            name={'icBackButton'} />
        ),
      })}>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen component={Tabs} name={'Tabs'} />
      </Stack.Group>
      <Stack.Group screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        headerTitle: () => <Text size="H4" font="SemiBold">{routes[route.name]}</Text>,
        headerStyle: {
          backgroundColor: Colors.background,
          height: Metrics.navBarHeight + Metrics.baseMargin
        }
      })}>
        <Stack.Screen component={WebView} name={'WebView'} />
        <Stack.Screen component={ProjectDetail} name={'ProjectDetail'} />
        <Stack.Screen component={TaskDetail} name={'TaskDetail'} />
        <Stack.Screen component={ProjectDetailFolder} name={'ProjectDetailFolder'} />
        <Stack.Screen component={ProjectDetailPdfList} name={'ProjectDetailPdfList'} />
        <Stack.Screen component={YourListScreen} name={'PdfList2'} />
        <Stack.Screen component={ProjectDetailPdfPage} name={'ProjectDetailPdfPage'} options={{
          headerStyle: {
            backgroundColor: Colors.onSecondary
            , height: Metrics.navBarHeight + Metrics.baseMargin
          }
        }} />
        <Stack.Screen component={PrivacyPolicy} name={'PrivacyPolicy'} />
        <Stack.Screen component={EditProfile} name={'EditProfile'} />
        <Stack.Screen component={ChangePasswod} name={'ChangePassword'} />
        <Stack.Screen component={AboutUs} name={'AboutUs'} />
        <Stack.Screen component={NotificationSettings} name={'NotificationSettings'} />
        <Stack.Screen component={AddProject} name={'AddProject'} />
        <Stack.Screen component={AddTask} name={'AddTask'} />
        <Stack.Screen component={MultiplePdfViewer} name={'MultiplePdfViewer'} />
        <Stack.Screen component={PdfBulkUpload} name={'PdfBulkUpload'} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
export type MainStackProps<T extends keyof MainStackType> = CompositeScreenProps<
BottomTabScreenProps<RootStackParamList>,
  StackScreenProps<MainStackType,T>
>;
