import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatedTab, Block, Button, FlatList, Icon, ImageButton, SearchBar, Text, ProjectFolderItems, useAuth, FolderPicker, RBSheetFilter } from '../../components';
import { TabProps } from '..//Main//Tabs';
import { Colors, Icons, Images, Metrics } from '../../config';
import { ActivityIndicator, Alert, Platform, StyleSheet } from 'react-native';
import Detail from '../../components/Detail';
import RBSheet from 'react-native-raw-bottom-sheet';
import { request } from '../../components/ApiService';
import { usePagination } from '../../components/usePagination';
import { _checkCurrentUserProject } from '../../Utility';
import { useFocusEffect } from '@react-navigation/native';

export const ProjectDetail = (props: TabProps<any>) => {
  const projectId = props.route.params?.projectId;
  const tabId = props.route.params?.tabId;
  const [foldersListning, setFoldersListning] = usePagination({
    request: request(`directories/?project_id=${projectId}`, 'get')
  })
  console.log('foldersListning=====',foldersListning)
  const useAuthData = useAuth()
  const refRBSheet = useRef();
  const refRBSheet2 = useRef();
  const [selectedIndex, setSelectedIndex] = useState({ filterObj: 0, sortObj: 0 })
  const [Tabs, setTab] = useState(!!tabId ? 2 : 1);
  const [folderState, setFolderState] = useState(false);
  const [_item, setItem]=useState({})
  const [isLoader, setLoader]=useState(true)
  const filterObj = [
    { id: 1, select: true, title: 'Most recently opened' },
    { id: 2, select: false, title: 'Alphabetically' },
    { id: 3, select: false, title: 'Newest to Oldest' },
  ];
  const ViewOptionList = [
    { id: 1, select: true, title: 'List' },
    { id: 2, select: false, title: 'Small Thumbnails' },
    { id: 3, select: false, title: 'Large Thumbnails' },
  ];
  // console.log('Type',_item?.type)
  useFocusEffect(
    useCallback(()=>{
      request(`projects/${projectId}`,'get')
      .withOutToast()
      .withLoader()
      .onSuccess((res) => {
        setItem(res.data.data)
        // console.log('res.data.data',res.data.data)
        setLoader(false)
      })
      .onFailure((err)=>{
        console.log('ERROE', err)
        setLoader(false)
      }).call();
    },[])
  )
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: Tabs == 2 ? () => (_checkCurrentUserProject(_item?.user?._id,useAuthData.user) &&
      (<Icon
          size={60}
          onPress={() => { props.navigation.navigate('AddProject',{isUpdated:true,items:_item})}}
          margin={{ Right: Metrics.iPadHeightRatio(10) }}
          name={'icupdate'} />)
      ) : () => null
    })
  }, [Tabs,_item])
  //_item?.type Edit screen Updated
  const deleteFolder = useCallback((id: string) => {
      return request(`directories/${id}`, 'DELETE')
        .onSuccess(() => {
          setFoldersListning.call();
        })
        .call();
    }, []);
  if(isLoader){
    return <ActivityIndicator size='large' color={Colors.primary} style={{alignSelf:'center' ,flex:1}}/>
  }
  return (
    <Block scroll flex gradient={[Colors.background, Colors.textBackground]}>
      <Block backgroundColor="primary" height={54} margin={{ Horizontal: Metrics.iPadHeightRatio(16), Top: Metrics.iPadHeightRatio(12) }}>
        <AnimatedTab value={Tabs} onChange={(d: any) => { setTab(d) }} options={[
          { label: 'Drawings', id: 1 },
          { label: 'Details', id: 2 },
        ]} />
      </Block>
      {Tabs == 1 ? <>
        <Block row style={{ marginHorizontal: Metrics.iPadHeightRatio(16), marginTop: Metrics.iPadHeightRatio(18) }}>
          <SearchBar onChange={s => setFoldersListning.withParams({ keyword: s })} Style={{ flex: 1 }} />
          <Icon
            size={62}
            onPress={() => { refRBSheet.current.open() }}
            margin={{ Right: -8, Top: 0 }}
            name={'icFilter'} />
        </Block>
        <FlatList
          {...foldersListning}
          keyExtractor={(item, index) => item.key + '' + index}
          onEndReached={foldersListning.onEndReached}
          showBottomLoader={foldersListning.isFetching && !!foldersListning.page}
          style={{ marginBottom: Metrics.heightRatio(12) }}
          renderItem={({ item, index }) => (
            <ProjectFolderItems
              index={index}
              Images={Images.icFolder}
              name={item.title}
              userRec={item?.project?.user}
              onPressDelete={() =>
                      Alert.alert('Delete', 'Are you sure you want to delete this Folder?', [
                        { text: 'No' },
                        { text: 'Yes', onPress: () => deleteFolder(item?._id) },
                      ])
                }
              onPress={() => props.navigation.navigate('ProjectDetailFolder',
                {
                  screenTitle: item.title,
                  itemParentID: item?._id,
                  itemProjectID: _item?._id,
                  currentUser :_item?.user?._id
                })}
              Icons={Icons.arrowRight} />
          )}
        />
        {_checkCurrentUserProject(_item?.user?._id,useAuthData.user) && <Button label="Create New Folder" onPress={() => { setFolderState(s => !s) }} type='Solid' style={{ margin: 16 }} />}
        <FolderPicker
          isVisible={folderState}
          onBackPress={() => { setFolderState(s => !s) ; setFoldersListning.call()}}
          project_id={_item?._id}
        />
      </> : <Detail item={_item} />
      }
      {/* <RBSheetFilter 
        ref={refRBSheet}
        filterObj={filterObj}
        // setSelectedIndex={(index)=>{console.log('-----',index),setSelectedIndex(s => ({ ...s, filterObj: index }))}}
        selectIndex={selectedIndex.filterObj}
        setFoldersListning={()=>setFoldersListning.withParams({filter_by: selectedIndex?.filterObj == 0 ? 'recently_opened' : selectedIndex.filterObj == 1 ? 'alphabetically' : 'asc',})}
      /> */}
      <RBSheet
        ref={refRBSheet}
        openDuration={500}
        closeDuration={500}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            height: Platform.isPad ? Metrics.heightRatio(280) : 310,
            backgroundColor: Colors.onSecondary,
            borderTopRightRadius: 18,
            borderTopLeftRadius: 18,
          },
        }}>
        <Block flex margin={{ Horizontal: 12, All: Platform.isPad ? 70 : 0 }} >
          <Block row margin={{ Top: 24, }} width={'100%'}>
            <Text
              font="Medium"
              size={'H4'}
              align='center'
              style={{ alignSelf: 'center', flex: 1 }}>
              {'Filters'}
            </Text>
            <ImageButton
              imgStyle={{ alignSelf: 'flex-end' }}
              source={Icons.icClose}
              onPress={() => refRBSheet.current.close()}
            />
          </Block>
          <Text
            margin={{ Top: 26 }}
            font="Medium"
            size={'H5'}
            style={{}}>
            {'Filter By'}
          </Text>
          {filterObj.map((item: any, index: number) => {
            return (
              <Block row style={{ paddingTop: 16 }} key={index}>
                <Block align='center'>
                  <ImageButton
                    source={selectedIndex.filterObj == index ? Icons.icRadioChecked : Icons.icRadioUnchecked}
                    onPress={() => {
                      setSelectedIndex(s => ({ ...s, filterObj: index })),
                        console.log('selectedIndex.filterObj', selectedIndex.filterObj)
                    }}
                  />
                </Block>
                <Text size={'H6'} font={'Regular'} margin={{ Left: 8 }} style={{ alignSelf: 'center' }}>
                  {item.title}
                </Text>
              </Block>
            )
          })}
        </Block>
        <Block row margin={{ Horizontal: 16, Vertical: 22 }}>
          <Button
            label="Reset"
            onPress={() => { setFoldersListning.withParams({ filter_by: '' }), refRBSheet.current.close() }}
            type="DullSecondary"
            style={{ marginRight: 4 }}
          />
          <Button label="Apply" onPress={() => {
            setFoldersListning.withParams({
              filter_by: selectedIndex.filterObj == 0 ? 'recently_opened' : selectedIndex.filterObj == 1 ? 'alphabetically' : 'asc',
            }), refRBSheet.current.close()
          }} style={{ marginLeft: 4 }} />
        </Block>
      </RBSheet>
      <RBSheet
        ref={refRBSheet2}
        openDuration={500}
        closeDuration={500}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            height: Platform.isPad ? Metrics.heightRatio(230) : 260,
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
              {'Viewing Option'}
            </Text>
            <ImageButton
              imgStyle={{ alignSelf: 'flex-end' }}
              source={Icons.icClose}
              onPress={() => refRBSheet2.current.close()}
            />
          </Block>
          {ViewOptionList.map((item: any, index: number) => {
            return (
              <Block row style={{ paddingTop: 16 }} key={index}>
                <Block align='center'>
                  <ImageButton
                    source={selectedIndex.filterObj == index ? Icons.icRadioChecked : Icons.icRadioUnchecked}
                    onPress={() => {
                      setSelectedIndex(s => ({ ...s, filterObj: index }))
                    }}
                  />
                </Block>
                <Text size={'H6'} font={'Regular'} margin={{ Left: 8 }}>
                  {item.title}
                </Text>
              </Block>
            )
          })}
        </Block>
        <Block row margin={{ Horizontal: 16, Vertical: 22 }}>
          <Button
            label="Reset"
            onPress={() => refRBSheet2.current.close()}
            type="DullSecondary"
            style={{ marginRight: 4 }}
          />
          <Button label="Apply" onPress={() => refRBSheet2.current.close()} style={{ marginLeft: 4 }} />
        </Block>
      </RBSheet>
    </Block>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: Colors.onSecondary,
    padding: 12,
  },
  CardContainer: {
    margin: 0,
    alignItems: 'center',
    backgroundColor: Colors.onPrimary,
    padding: 18,
    borderRadius: 10
  },
  innerContainer: {
    backgroundColor: Colors.inverseOnSurface,
    shadowColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginTop: 10
  },
});