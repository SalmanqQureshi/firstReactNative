import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {AuthFunction, useAuth} from '../components';
import {navigate, navigatorRef} from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {AndroidImportance, AuthorizationStatus, EventType} from '@notifee/react-native';
import { Images } from '../config';

async function onDisplayNotification(remoteMessage) {
  // console.log('onDisplayNotification', remoteMessage);
  const {notification, data} = remoteMessage;

  // Request permissions (required for iOS)
  if (Platform.OS == 'ios') {
    await notifee.requestPermission();
  }

async function requestNotificationPermissionAndroidOnly() {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    console.log('Notification permission granted on Android');
  } else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
    console.log('Notification permission denied on Android');
  } else {
    console.log('Notification permission status:', settings.authorizationStatus);
  }
}
if (Platform.OS === 'android') {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  requestNotificationPermissionAndroidOnly();
}
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'Constructify',
    name: 'Constructify_App',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title: notification.title,
    body: notification.body,
    data: data,
    android: {
      channelId,
      smallIcon: 'ic_launcher',
    },
  });
  await notifee.setBadgeCount(notification.ios.badge)
}

export async function getFcmToken() {
  let token = '';

  const notificationToken = await AsyncStorage.getItem('fcmToken');

  if (notificationToken != null && JSON.parse(notificationToken).fcmToken) {
    return JSON.parse(notificationToken).fcmToken;
  }

  return token;
}

export async function setMessageHandler() {
  messaging().onNotificationOpenedApp(async remoteMessage => {
    // console.log('onNotificationOpenedApp ', remoteMessage.data);
    onPressNotification({notification: remoteMessage});
  });

  messaging().onMessage(async remoteMessage => {
    const customData = JSON.parse(remoteMessage.data?.custom_data)
    const _id= await AsyncStorage.getItem('_setRoomId')
    console.log(_id, '=====remoteMessage ', customData);
    if (customData?.reference_id !== _id ) {
      await onDisplayNotification(remoteMessage);
    }
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      // console.log('getInitialNotification', remoteMessage);
      if (remoteMessage) {
        onPressNotification({notification: remoteMessage});
      }
    });
}

export async function setUpPushNotification() {
  const PushNotificationToken = await getFcmToken();

  console.log({PushNotificationToken});
  if (!PushNotificationToken) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    // if (!enabled) return;

    await messaging().registerDeviceForRemoteMessages();

    const _PushNotificationToken = await messaging().getToken();

    AsyncStorage.setItem(
      'fcmToken',
      JSON.stringify({
        fcmToken: _PushNotificationToken,
      }),
    );

    AuthFunction.createDeviceToken?.({deviceToken: _PushNotificationToken});
  } else {
    AuthFunction.createDeviceToken?.({deviceToken: PushNotificationToken});
  }

  setMessageHandler();

  notifee.onForegroundEvent(({type, detail}) => {
    console.log('foreground', detail,type)
    switch (type) {
      case EventType.DISMISSED:
        break;
      case EventType.PRESS:
        setTimeout(() => {
          onPressNotification(detail);
        }, 500);
        break;
    }
  });


  notifee.onBackgroundEvent(({type, detail}) => {
    console.log('background', detail,type)
    switch (type) {
      case EventType.DISMISSED:
        break;
      case EventType.PRESS:
        setTimeout(() => {
          onPressNotification(detail);
        }, 500);
        break;
    }
  });
}

export const getNotificationCount=async()=>notifee.getBadgeCount()
const onPressNotification = notifObj => {
  let target_user_data = null;
  const custom_data = JSON.parse(notifObj.notification.data.custom_data);
  if (custom_data.identifier == 'chat') {
    target_user_data = JSON.parse(custom_data.target_user_data);
  }
  getNotificationCount();
  console.log('custome Data=====',notifObj?.notification?.id)
  if (custom_data.identifier != "delete") {
  switch (custom_data.module) {
    case 'projects':
      navigate('ProjectDetail', {projectId:custom_data?.reference_id,tabId:2});
      break;
    case 'chat':
      custom_data.module=='chat' && AsyncStorage.setItem('_setRoomId',custom_data?.reference_id);
      navigate('TaskDetail', {
        refrence_key:custom_data?.reference_id,
        tabId:2,
        notification_id: notifObj?.notification?.id
      });
      break;
    case 'task_delete':
      navigate('Notifications');
      break;
    case 'tasks':
      navigate('TaskDetail',{refrence_key:custom_data?.reference_id});
      break;
    case 'main_directories':
      navigate('ProjectDetail', {projectId:custom_data?.project_id});
      break;
    case 'sub_directories':
      navigate('ProjectDetailFolder',{
        screenTitle:custom_data?.parent_title,
        itemParentID:custom_data?.parent_id,
        itemProjectID:custom_data?.project_id,
      currentUser:custom_data?.actor_id});
      break;
    case 'directories_detail':
      navigate('PdfList2', { 
        screenTitle: custom_data?.parent_title,
        itemProjectID: custom_data?.project_id,
        itemParentID: custom_data?.parent_id,
        currentUser: custom_data?.actor_id
      });
      break;
  }
}
};
