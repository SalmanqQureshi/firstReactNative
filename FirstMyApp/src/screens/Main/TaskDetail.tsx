import React, { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatedTab, Block, Button, FlatList, Icon, Image, Text, useAuth } from '../../components';
import {
  BookingAccepted,
  BookingCompleted,
  BookingPending,
} from '../../dummyData';
import { TabProps } from '../Main/Tabs';
import { Colors, Images, Metrics, Sizes } from '../../config';
import { CommentChat } from '../../components';
import { ActivityIndicator, Platform, ScrollView } from 'react-native';
import { _checkCurrentUser, dateFormat } from '../../Utility';
import { request } from '../../components/ApiService';
import { useNavigation } from '@react-navigation/native';
import { navigate, pop } from '../../services';
// import {Pressable, StatusBar} from 'react-native';
// import { Colors } from '../../../config';

export const TaskDetail = (props: TabProps<any>) => {
  // const _item = props.route.params?.item;
  const [isLoader, setLoader] = useState(true)
  const [_item, setItem] = useState([])
  const [Tab, setTab] = useState(!!props.route.params?.tabId ? 2 : 1);
  useEffect(() => {
    request(`tasks/${props.route.params?.refrence_key}`, 'get')
      .withOutToast()
      .withLoader()
      .onSuccess((res) => {
        setTimeout(() => {
          setItem(res.data.data)
          setLoader(false)
        }, 500);
        console.log('res.data.data', res)
      })
      .onFailure((err) => {
        console.log('ERROE', err?.data?.data)
        setTimeout(() => {
          setLoader(false)
          if (err?.response?.data?.statusCode == '404') {
            navigate('AssignedTask')
          }
        }, 450)
      }).call();
  }, [Tab,props.route.params?.refrence_key])
  const useAuthData = useAuth()
  // const {navigate} = useNavigation()
useEffect(()=>{
  if(props.route.params?.tabId === 2){
    setTab(2)
  }
},[props.route.params?.tabId,props.route.params?.notification_id])
  const btnName = _item?.status == 'in-process' ? 'Mark Complete' : _item?.status == 'completed' ? false : 'Start'
  // const StatusName = buttonState == 1 ? 'in-process' : buttonState == 2 ? 'verified' : buttonState == 3 ? 'Compeleted' : 'Assigned'
  const StatusName = _item?.status == 'pending' ? 'in-process' : 'completed';
  function formatStatus(str:string) {
  return str
    .replace("-", " ")                 
    .replace(/^./, c => c.toUpperCase());
}
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: Colors.background,
        height: 100
      },
      headerRight: () => { 
     return !!_checkCurrentUser(_item?.assignees,useAuthData.user)? <Icon
        size={60}
        onPress={() => { props.navigation.navigate('AddTask', { isUpdated: true, items: _item }) }}
        margin={{ Right: Metrics.iPadHeightRatio(10) }}
        name={'icupdate'} /> :null
      }
    })

  }, [_item?.status])

  const _renderHeader = () => {
    return <AnimatedTab
      value={Tab}
      onChange={(d: any) => setTab(d)}
      options={[
        { label: 'Details', id: 1 },
        { label: 'Comments', id: 2 },
      ]}
    />
  }
  const Submit = (data: any) => {
    console.log('data', data)
    return request(`tasks/${_item?._id}`, 'patch')
      .withFormData({ status: data })
      .onSuccess(response => {
        console.log('response=====>', response?.data?.data?.status)
        setItem(response?.data?.data)
      })
      .onFailure((error) => {
        console.log('response=====>', { error })
      })
      .call()
  }
  if (isLoader) {
    return <ActivityIndicator size='large' color={Colors.primary} style={{ alignSelf: 'center', flex: 1 }} />
  }
  return (<>
    <Block backgroundColor={Colors.background} height={54} padding={{ Horizontal: 16 }}>
      {_renderHeader()}
    </Block>
    {/* }  */}
    {Tab == 2 ?
      <CommentChat key={_item?._id} item={_item} />
      :
      <Block safe flex padding={{ Bottom: 16, Horizontal: 16 }} gradient={[Colors.background, Colors.textBackground]} >
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Block margin={{ Top: 24 }} row >
            <Block flex >
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Medium'
                size="H5">
                {'Task Name'}
              </Text>
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Regular'
                size="H6">
                {_item?.title}
              </Text>
            </Block>
            <Block flex>
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Medium'
                size="H5">
                {'Project Name'}
              </Text>
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Regular'
                size="H6">
                {_item?.project?.title}
              </Text>
            </Block>
          </Block>
          <Block margin={{ Top: 24 }} row flex >
            <Block flex>
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Medium'
                size="H5">
                {'Assignee'}
              </Text>
              <Text
                style={{ paddingTop: 0 }}
                margin={{ Horizontal: 4 }}
                font='Regular'
                size="H6">
                {_item?.assignees
                  //?.filter(item => item?._id?._id !== useAuthData.user?._id) // Filter out current user
                  ?.map((item, index) => item?._id?.name).join(', ')}
              </Text>
            </Block>
            <Block flex >
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Medium'
                size="H5">
                {'Status'}
              </Text>
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Regular'
                size="H6">
                {formatStatus(_item?.status)}
              </Text>
            </Block>
          </Block>
          <Block margin={{ Vertical: 16 }} row >
            <Block flex>
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Medium'
                size="H5">
                {'Start Date'}
              </Text>
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Regular'
                size="H6">
                {dateFormat(_item?.start_at)}
              </Text>
            </Block>
            <Block flex>
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Medium'
                size="H5">
                {'End Date'}
              </Text>
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Regular'
                size="H6">
                {dateFormat(_item?.end_at)}
              </Text>
            </Block>
          </Block>
          {btnName ? null :
            <>
              <Text
                style={{ marginTop: 8 }}
                margin={{ Horizontal: 4 }}
                font='Medium'
                size="H5">
                {'Date Completed'}
              </Text>
              <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Regular'
                size="H6">
                {'25 August 2024'}
              </Text>
            </>}
          <Text
            margin={{ Horizontal: 4, Top: 24 }}
            font='Medium'
            size="H5">
            {'Description'}
          </Text>
          <Text
            style={{ paddingTop: 5 }}
            margin={{ Horizontal: 4 }}
            lineHeight={19}
            font='Regular'
            size="H6">
            {_item?.description}
          </Text>
          <Text
            style={{ paddingTop: 18 }}
            margin={{ Horizontal: 4 }}
            font='Medium'
            size="H5">
            {'Location'}
          </Text>
          <Text
            style={{ paddingTop: 5 }}
            margin={{ Horizontal: 4 }}
            font='Regular'
            size="H6">
            {_item?.project?.address}
          </Text>
          <ScrollView style={{ flexDirection: 'row', marginTop: 18 }} horizontal showsHorizontalScrollIndicator={false}>
            {_item?.directories?.map((item, index) => (
              <Block flex width={'100%'} key={index + "-" + item?._id?.title} onPress={() => navigate('ProjectDetailPdfPage', {
                ScreenTitleName: item?._id?.title,
                file_path: item?._id?.file
              })}>
                <Image source={Images.icPdfFile}
                  style={{
                    height: 100,//'30%',
                    width: 92,//'70%',
                    borderRadius: Sizes.Base - 8,
                    flex: 1,
                    alignSelf: 'center',
                  }} />
                <Text
                  numberOfLines={1}
                  style={{ paddingTop: 5, width: 120 }}
                  margin={{ Horizontal: 4 }}
                  font='Regular'
                  align='center'
                  size="H6">
                  {item?._id?.title}
                </Text>
              </Block>
            ))}
          </ScrollView>
          {btnName &&
            <Block flex align='bottom' style={{ alignItems: 'flex-end' }}>
              <Button
                label={btnName}
                onPress={() => { Submit(StatusName) }}
                type='Solid'
                style={{ width: '50%', marginTop: 24, alignSelf: 'center', marginBottom: 18 }} />
            </Block>
          }
        </ScrollView>
      </Block>
    }


  </>
  );
};
