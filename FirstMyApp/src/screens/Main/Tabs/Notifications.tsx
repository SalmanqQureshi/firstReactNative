import React from 'react'
import { Block, FlatList, Image, showAlert, Text } from '../../../components'
// import { MotiView } from 'moti'
import { Pressable, StyleSheet } from 'react-native'
import { Colors, Images, Metrics } from '../../../config'
import { TabProps } from '.';
import { usePagination } from '../../../components/usePagination'
import { request } from '../../../components/ApiService'
import { navigate } from '../../../services'
import { useFocusEffect } from '@react-navigation/native'
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { dateFormat, showDate, timeFormat } from '../../../Utility'
import moment from 'moment'
import { showMessage } from 'react-native-flash-message'

export const Notifications = (props: TabProps<any>) => {
  const [notifications, setNotifications] = usePagination({
    request: request('notification', 'get')
  })

  useFocusEffect(
    React.useCallback(() => {
      notifee.setBadgeCount(0)
    }, [])
  )
  const isRead = (id: number) => {
    return request(`notification/${id}`, 'patch')
      .withFormData({ is_redirected: true })
      .withOutToast()
      .onSuccess(response => {
        console.log('response=====>', response?.data)
        setNotifications.call()
      })
      .onFailure((error) => {
        console.log('response=====>', { error })
      })
      .call()
  }
  const onNavigate = (custom_data: any) => {

      switch (custom_data.module) {
        case 'projects':
          isRead(custom_data?._id)
          navigate('ProjectDetail', { projectId: custom_data?.custom_data?.reference_id, tabId: 2 });
          break;
        case 'task_delete':
          isRead(custom_data?._id)
          navigate('Notifications');
          break;
        case 'tasks':
          isRead(custom_data?._id)
          navigate('TaskDetail', { refrence_key: custom_data?.custom_data?.reference_id });
          break;
        case 'main_directories':
          isRead(custom_data?._id)
          navigate('ProjectDetail', { projectId: custom_data?.custom_data?.project_id });
          break;
        case 'sub_directories':
          isRead(custom_data?._id)
          navigate('ProjectDetailFolder', {
            screenTitle: custom_data?.custom_data?.parent_title,
            itemParentID: custom_data?.custom_data?.parent_id,
            itemProjectID: custom_data?.custom_data?.project_id,
            currentUser: custom_data?.custom_data?.actor_id
          });
          break;
        case 'directories_detail':
          isRead(custom_data?._id)
          navigate('PdfList2', {
            screenTitle: custom_data?.custom_data?.parent_title,
            itemProjectID: custom_data?.custom_data?.project_id,
            itemParentID: custom_data?.custom_data?.parent_id,
            currentUser: custom_data?.custom_data?.actor_id
          });
          break;
      }
    
  }
  return (
    <Block safe style={{ flex: 1, }} gradient={[Colors.background, Colors.textBackground]}>
      <FlatList
        contentContainerStyle={{ paddingTop: 12, marginHorizontal: Metrics.iPadHeightRatio(16) }}
        {...notifications}
        showBottomLoader={notifications.isFetching && !!notifications.page}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          console.log('ITEMS', item),
          <Block
            key={index}
            style={{ marginTop: 10, marginBottom: notifications.data.length == index + 1 ? 12 : 0, ...styles.CardContainer }}
            onPress={() => {
              if (item.identifier != "delete") {
                onNavigate(item)
              }else{
                showMessage({ message: 'This content is no longer available', type: 'danger' })
                isRead(item?._id)
              }
            }}
          >
            <Block row space='between'>
              <Text
                numberOfLines={1}
                font="Medium"
                size="H6"
                color='textColors'
                style={{ width: 200 }}>
                {item?.title}
              </Text>
              <Text
                font="Medium"
                color='backdrop'
                style={{ alignSelf: 'flex-end', top: -8 }}>
                {moment(item?.created_at).fromNow()}
              </Text>
            </Block>
            <Block row style={{}} space='between'>
              <Text
                style={{ width: 300, marginTop: 8 }}
                font="Medium"
                size="Body"
                color='outline'>
                {item?.body}
              </Text>
              <Block style={{ alignItems: 'flex-start' }}>
                {!item?.is_redirected && <Block style={{ height: 8, width: 8, borderRadius: 8, alignSelf: 'flex-start' }} backgroundColor='red' />}
              </Block>
            </Block>
          </Block>
        )} />
    </Block>)
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: Colors.onSecondary,
    padding: 12,
  },
  CardContainer: {
    margin: 0,
    // alignItems:'center',
    backgroundColor: Colors.onPrimary,
    padding: 18,
    borderRadius: 10
  },
});