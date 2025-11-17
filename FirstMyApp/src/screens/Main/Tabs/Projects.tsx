import React, { useEffect, useState } from 'react'
import { Block, FlatList, Image, Text, TextInput,SearchBar,PropertyCardList, useAuth, Icon } from '../../../components'
// import PropertyCardList from '../../../components/PropertyCardList'
import {TabProps} from './'
import { Colors, Fonts, Images, Metrics, Sizes } from '../../../config'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { usePagination } from '../../../components/usePagination'
import { request } from '../../../components/ApiService'
import { Dimensions, Platform } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { Modal } from '../../../components/Form/Components/Modal'
import ReactNativeModal from 'react-native-modal'

interface ImageSliderProps{
    isVisible:boolean,
    ImagesData:[],
    onBackPress:()=>{}
}
const  ImageSlider = ({ isVisible=false, ImagesData,onBackPress }:ImageSliderProps) => {
    const width = Dimensions.get('window').width;
    return (
                <ReactNativeModal type='Center' isVisible={isVisible} onBackdropPress={()=>{ onBackPress()}}>
                    <Icon 
                    name='icClose' 
                    size={34} 
                    margin={{Top:Metrics.iOSPlatform ? 28:0}}
                    style={{alignSelf:'flex-end'}} 
                    onPress={()=>{onBackPress()}}/>
                <Carousel
                    loop={false}
                    width={width}
                    height={Platform.OS=='ios'&& Platform.isPad? width:Metrics.iPadHeightRatio(500)}
                    data={ImagesData}
                    style={{alignSelf:'center'}}
                    onSnapToItem={(index) => {}}
                    renderItem={({ index,item }) => (
                <>
                    <Image source={{ uri: item }}
                        style={{
                            flex:1,
                            marginTop:Platform.OS=='ios'&& Platform.isPad? '15%':'50%',
                            height: '100%',
                            borderRadius: Sizes.Base - 8,
                            marginHorizontal: Metrics.iPadHeightRatio(5) }}/>
                    <Block row align='center'>  
                        {ImagesData.map((item,indexs)=>(
                        <Text color={index==indexs?'background': 'onPrimaryContainer'} size={index==indexs?'H1':'H2'} align='center'>•</Text>)) } 
                    </Block>
                </>
            )}
                />
            </ReactNativeModal>
    );
}
export const Projects = (props:TabProps<'Projects'>) => {
    const {user,logIn}=useAuth()
    // console.log('user========>',user.policies)
    const [projectListning, isProjectListning]=usePagination({
        request:request('projects','get') 
    })
    const [imageState,SetImageState]=useState({isModal:false,images_state:[]})

    useFocusEffect(()=>{
        ()=>{
            user.policies[1].can_create = false
        } 
    })
    const {navigate}=useNavigation()

    useEffect(()=>{

        props.navigation.setOptions({
            headerLeft:()=>(
                <Image source={{uri:user?.image_url}} style={{
                    marginLeft:8,
                    marginRight:Metrics.iPadHeightRatio(-4),
                    width:Metrics.heightRatio(42),height:Metrics.heightRatio(42),
                    borderRadius:8,
                }} />
            ),
        })
        
    request('user',"get").withSlug(user._id).withParams(
        {page:1,limit:10}
    )
    .onSuccess(response => {
    logIn({...response.data.data, access_token: user.access_token}, true)
    })
    .onFailure(err => {
    console.log(err),
    console.log('erreor====================>', {err})
    })
      .call()
    },[])
    return (
        <Block flex gradient={[Colors.background,Colors.textBackground]}>
            <Block flex style={{marginTop: Metrics.iPadHeightRatio(24),marginHorizontal:Metrics.iPadHeightRatio(12) }}>
            <SearchBar onChange={s => isProjectListning.withParams({keyword:s})}/>
                <FlatList
                 keyExtractor={(item, index) => item.key+''+index}
                    style={{marginBottom:Metrics.heightRatio(0),marginTop:8}}
                    {...projectListning}
                    showBottomLoader={projectListning.isFetching && !! projectListning.page }
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <PropertyCardList
                                key={"VideoCard" + item.id + item.is_liked}
                                onPress={() => navigate('ProjectDetail',{projectId:item?._id})}
                                onPressImage={()=>SetImageState(s=>({...s,isModal:true, images_state:item.image_url}))}
                                item={item}
                            />)
                }} />
                </Block>
            <ImageSlider 
                isVisible={imageState.isModal}
                ImagesData={imageState.images_state}
                onBackPress={()=>{SetImageState(s=>({...s,isModal:false}))}}  />

                {user?.policies?.filter((res)=>res.module == "project").map((item, index)=>{
                    if(item?.can_create){
                        return ( <Icon
                        size={54}
                        style={{position:'absolute',right:24,bottom:24}}
                        onPress={() => { props.navigation.navigate('AddProject')}}
                        margin={{ Right: -8, Top: 0 }}
                        name={'fabIconAdd'} />)
                    }
                    
                })}
        </Block>
    )
}