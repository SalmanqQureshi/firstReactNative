import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Block, Button, EmployeeTabs, FlatList, Form, Image, ImageButton, showAlert, Text, TextInput, useAuth } from '../../components'
import { MainStackProps } from '.'
import { Colors, Metrics, Icons, Images, Sizes } from '../../config'
import RBSheet from 'react-native-raw-bottom-sheet'
import { Animated, Platform, Pressable, ScrollView, StyleSheet } from 'react-native'
import { request } from '../../components/ApiService'
import { usePagination } from '../../components/usePagination'
import { AddressPicker } from '../../components/Form/AddressPicker'
import { DateTimePicker } from '../../components/Form/Components/DateTimePicker'
import { ImagePicker } from '../../components/Form/Components/ImagePicker'
import moment from 'moment'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { dateFormat, timeFormat } from '../../Utility'
import { showMessage } from 'react-native-flash-message'
import { EmployeeSelectorSheet } from '../../components/EmployeeSelectorSheet'
import { useFocusEffect } from '@react-navigation/native'

const AddProject = (props: MainStackProps<'AddProject'>) => {
  const refRBSheet = useRef();
  const isUpdate = props.route.params?.isUpdated;
  const [user, setUser] = useState(props.route.params?.items)
  const [selectedItems, setSelectedItems] = useState(props.route.params?.items?.members || []);
  const [selectedDeleteItems, setSelectedDeleteItems] = useState([]);
  const [imageState, setImageState] = useState([]);
  const [imageEditState, setImageEditState] = useState(props.route.params?.items?.image_url || []);
  const [imageEditDeleteState, setImageEditDeleteState] = useState([]);
  const refImg = useRef(null);
  console.log('props.route.params?.items',props.route.params?.items)
  const [employeeListning, setEmployeeListning] = usePagination({
    request: request(`user/`, 'get')
  })
  useFocusEffect(
      useCallback(()=>{
          setUser(props.route.params?.items)
      },[])
    )
  const user1=useAuth()
  console.log('USER 1', user1.user)
  const toggleSelection = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.some((selectedItem) => selectedItem._id === item._id);
      if (isSelected) {
        return prevSelectedItems.filter((selectedItem) => selectedItem._id !== item._id);
      } else {
        return [...prevSelectedItems, item];
      }
    });
    // console.log('*********', item)
  }
   useLayoutEffect(() => {
      props.navigation.setOptions({
        headerTitle: () => (
          <Text size="H4" font="SemiBold">{isUpdate? 'Edit Project': "Add Project"}</Text>
      )
      })}, [])

  const onSubmit = (data) => {
    const EmployeesIds = selectedItems.map(item => item._id);
    const EmployeesIds2 = selectedDeleteItems.map(item => item._id);
    let formdata = new FormData();

    
    if (isUpdate) {
      imageEditDeleteState.forEach((item, index) => {
        formdata.append(`_image[]`, item);
      })
      EmployeesIds2.forEach((item, index) => {
        formdata.append(`_members[]`, item);
      })
      if(imageState.concat(...imageEditState).length > 10 ){
        showMessage({ message: 'You can only select upto 10 images.', type:'danger',icon:'danger' });
        return
      }
    }
    if(imageState.length > 10 ){
      showMessage({ message: 'You can only select upto 10 images.', type:'danger',icon:'danger' });
      return
    }
    imageState.forEach((item, index) => {
      formdata.append(`image`, {
        uri: item?.uri,
        name: item?.name,
        type: item?.type,
      });
    })
    EmployeesIds.forEach((item, index) => {
      formdata.append(`members[]`, item);
    })
    formdata.append('title', data?.title);
    formdata.append('type', data?.type);
    formdata.append('latitude', '41.8755616')//data.address.coords.lat);
    formdata.append('longitude', '-87.6244212')//data.address.coords.lng);
    formdata.append('address', data.address)//data.address.address);
    formdata.append('state', data.state || 'Illinois',);
    formdata.append('country', data.country || 'America');
    formdata.append('city', data.city || 'Chicago');
    if(!isUpdate){
      formdata.append('start_time_at', dateFormat(data?.completion_at));
      formdata.append('start_at', timeFormat(data?.completion_at));
    }
    formdata.append('completion_at', dateFormat(data?.completion_at));
    console.log('Add Project=====>',formdata)
    return request(isUpdate ? `projects/${user?._id}` : `projects`, isUpdate ? `PATCH`:'post')
      .withOutToast()
      .withModule()
      .withBody(formdata)
      .onSuccess(response => {
        console.log('response=====>', { response })
        props.navigation.pop()
      }).onFailure((error) => {
        console.log('error=====>', { error })
      })
      .call()
  }
  return (
    <>
      <Block flex gradient={[Colors.background, Colors.textBackground]}>
        <ScrollView keyboardShouldPersistTaps="always">
          <Block
            backgroundColor='white'
            height={Metrics.iPadHeightRatio(100)}
            width={'92%'}
            style={{
              borderColor: Colors.outlineVariant,
              borderWidth: 1,
              borderRadius: 10,
              marginTop: 16,
              alignSelf: 'center'
            }}>
            <Text size='H6' style={{ color: Colors.outline }} margin={{ Top: 6 }} align='center'>Project Images</Text>

            <ImagePicker
              type={'photo'}
              ref={refImg}
            onPick={(img)=>{setImageState(pre=>[...pre, ...img])}}

              min={1} max={10}>
              {({ pick, images }) => {
                return (
                  <Block style={{ position: 'absolute', bottom: 0, top: 18, left: 8, right: 0 }} row align='center'>
                    <ImageButton
                      onPress={pick}
                      source={Images.icAddImage}
                      resizeMode='strech'
                      imgStyle={{
                        height: Metrics.iPadHeightRatio(53),
                        width: Metrics.iPadHeightRatio(52),
                      }} />
                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      contentContainerStyle={{ marginLeft: 10 }}>

                      {!!imageEditState.length &&
                        imageEditState.map((item, index2) => (
                          <Block row margin={{ Horizontal: 0 }}>
                            <Image
                              source={{ uri: item }}
                              style={{
                                height: Metrics.iPadHeightRatio(52),
                                width: Metrics.iPadHeightRatio(53),
                                borderRadius: Metrics.heightRatio(12)
                              }} />
                            <TouchableOpacity
                              onPress={() => {
                                setImageEditState((prevData) => prevData.filter((item, index) => (index !== index2)))
                                setImageEditDeleteState(s => ([...s, item]))
                              }}>
                              <Image
                                resizeMode="contain"
                                style={[styles.crossImageItem, {}]}
                                source={Icons.icClose}
                              />
                            </TouchableOpacity>
                          </Block>))}

                      {!!imageState.length &&
                        imageState.map((item, index2) => (
                          <Block row margin={{ Horizontal: 0 }}>
                            <Image
                              source={{ uri: item?.uri}}
                              style={{
                                height: Metrics.iPadHeightRatio(52),
                                width: Metrics.iPadHeightRatio(53),
                                borderRadius: Metrics.heightRatio(12)
                              }} />
                            <TouchableOpacity
                              onPress={() => {setImageState((prevData) => prevData.filter((item2, index) => (index !== index2)))}}>
                              <Image
                                resizeMode="contain"
                                style={[styles.crossImageItem, {}]}
                                source={Icons.icClose}
                              />
                            </TouchableOpacity>
                          </Block>))}
                    </ScrollView>
                  </Block>
                )
              }}
            </ImagePicker>
          </Block>
          <Form onSubmit={onSubmit}>
            {({ register, loading, submit }) => (
              <>
                <Block margin={{ Horizontal: Metrics.iPadHeightRatio(12) }}>
                  <TextInput
                    {...register({ id: "title" })}
                    value={user?.title ? user?.title : ''}
                    label="Project Name"
                    style={{}}
                    type="Text" />

                  <TextInput
                    onPress={() => refRBSheet.current.open()}
                    label='Assignee Members'
                    rightIcon={'icArrowDown'}
                    editable={false}
                    onRightIconPress={() => refRBSheet.current.open()}
                    type='Text'
                    style={{}} />
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {selectedItems.map((item, index) => (
                      user1.user?._id !== item._id && <EmployeeTabs
                        key={index}
                        image={{ uri: item?.image_url }}
                        name={item?.name}
                        // month={item.age_month}
                        email={item?.email}
                        onPress={() => {
                          setSelectedItems((prevSelectedItems) => {
                            const isSelected = prevSelectedItems.some((selectedItem) => selectedItem._id === item._id);
                            if (isUpdate) {
                              setSelectedDeleteItems(pre => ([...pre, item]))
                            }
                            if (isSelected) {
                              return prevSelectedItems.filter((selectedItem) => selectedItem._id !== item._id);
                            }
                          })
                        }}
                      />
                    ))}
                  </ScrollView>
                  <TextInput
                    {...register({ id: 'address', next: 'completion_at' })}
                    label='Location'
                    rightIcon={'icLocationPin'}
                    onRightIconPress={()=>{}}
                    value={!!user?.address ? user?.address : ''}
                    style={{color:'black'}}
                    type='Text' />
                  {/* <AddressPicker
                    initialAddress={!!user?.address ? { address: user?.address, latitude: user?.location?.coordinates[0], longitude: user?.location?.coordinates[1] } : {}}
                    label="Location"
                    {...register({ id: 'address', next: 'completion_at' })}
                    style={{ marginBottom: 6 }}
                  /> */}
                  <DateTimePicker
                    errorTxt={'Completion Date'}
                    label='Completion date'
                    {...register({ id: "completion_at" })}
                    mode={"date"}
                    key={user?.completion_at}
                    minimumDate={new Date()}
                    style={{color:'black'}}
                    value={!!user?.completion_at ? new Date(dateFormat(user?.completion_at)) : ""}
                  />
                  <TextInput
                    {...register({ id: "type", })}
                    value={!!user?.type ? user?.type : ''}
                    label="Type (Ex: Pre-Construction)"
                    type="Text"
                    style={{color:'black'}}
                    errorText='Type is required, must be more than 2 characters and double space is not allowed' 
                    />
                </Block>
                <Block align='bottom' flex margin={{ Horizontal: 12, Top: Metrics.heightRatio(60), Bottom: 10 }} style={{}}>
                  <Button
                    label={isUpdate? 'Update': "Add Project"}
                    loading={loading}
                    onPress={submit}
                    style={{ marginRight: 4 }}
                  />
                </Block>
              </>
            )}
          </Form>
        </ScrollView>
      </Block>
      <EmployeeSelectorSheet
        ref={refRBSheet}
        employees={employeeListning}
        selectedItems={selectedItems}
        toggleSelection={toggleSelection}
        onSelectDone={() => refRBSheet.current.close()}
      />
      {/* <RBSheet
        ref={refRBSheet}
        openDuration={500}
        closeDuration={500}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            height: Platform.isPad ? Metrics.heightRatio(350) : 420,
            backgroundColor: Colors.onSecondary,
            borderTopRightRadius: 18,
            borderTopLeftRadius: 18,
          },
        }}>
        <Block flex margin={{ Horizontal: 12 }}>
          <Block row margin={{ Top: 24, }} width={'100%'}>
            <Text
              font="Medium"
              size={'H4'}
              align='center'
              style={{ alignSelf: 'center', flex: 1 }}>
              {'Select Employees'}
            </Text>
            <ImageButton
              imgStyle={{ alignSelf: 'flex-end' }}
              source={Icons.icClose}
              onPress={() => refRBSheet.current.close()}
            />
          </Block>
          <FlatList
            {...employeeListning}
            keyExtractor={(item, index) => item.key + '' + index}
            onEndReached={employeeListning.onEndReached}
            showBottomLoader={employeeListning.isFetching && !!employeeListning.page}
            style={{ marginBottom: Metrics.heightRatio(12) }}
            renderItem={({ item, index }) => {
              const isSelected = selectedItems.some((selectedItem) => selectedItem._id === item._id);
              return (
                <Block row style={{ paddingTop: 16 }} key={index} space='between' onPress={() => { toggleSelection(item) }}>
                  <Text size={'H6'} font={'Regular'} margin={{ Left: 8 }}>
                    {item.name}
                  </Text>
                  <Block align='center'>
                    <ImageButton source={isSelected ? Icons.icCheckbox : Icons.icUnCheckbox} onPress={() => { toggleSelection(item) }} />
                  </Block>
                </Block>
              )
            }
            }
          />
        </Block>
        <Block row margin={{ Horizontal: 16, Vertical: 22 }}>
          <Button label="Select" onPress={() => refRBSheet.current.close()} style={{ marginLeft: 4 }} />
        </Block>
      </RBSheet> */}
    </>
  )
}

export { AddProject }
const styles = StyleSheet.create({
  crossImageItem: {
    width: 22,
    height: 22,
    top: -1,
    bottom: 0,
    left: -10,
  },
})