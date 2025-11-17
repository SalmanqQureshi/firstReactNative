import React, { useState } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Block, Icon, Image, Text, useAuth } from '../../components'
import { Colors, Metrics, Sizes } from '../../config'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import { TouchableOpacity } from 'react-native-gesture-handler'
interface props {
    onPress: () => {},
    onPressImage:()=>{},
    item:{
    address: string,
    title: string,
    start_at: string,
    image_url: string
}
}
export const PropertyCardList = ({onPress,onPressImage, item}: props) => {
    const user = useAuth()
    return (
        <Block
            flex
            row
            padding={{ Horizontal: 0, Vertical: Metrics.iPadHeightRatio(5) }}
            style={{ borderRadius: Sizes.Base - 6 }}
            margin={{ Vertical: 6 }}
            shadow
            shadowColor='black'
            backgroundColor={Colors.onPrimary}>
                <TouchableOpacity onPress={()=>{onPressImage()}}>
                <Image source={{ uri: item.image_url[0] }}
                    style={{ height: '100%', width: Metrics.heightRatio(108), borderRadius: Sizes.Base - 8, marginHorizontal: Metrics.iPadHeightRatio(5) }}/>
                </TouchableOpacity>
                <Block 
                flex
                onPress={() => { onPress() }} 
                padding={{ Horizontal: 0, Vertical: 5 }} margin={{ Left: 8 }}>
                    <Text
                        // color="cardTitle"
                        margin={{ Vertical: 4, Top: 2 }}
                        size="H6"
                        font="Medium">
                        {item.title}
                    </Text>
                    {/* {!itemHidden.includes('ClaimNo') && ( */}
                    <Text
                        color='lightTextColor'
                        margin={{ Vertical: 4, Top: 2, Bottom: 6 }}
                        size="Body">
                        Project ID.{'  '}
                        <Text
                            color="textNumber"
                            size="Body">
                            {/* {'10402'} */}{item?.short_id}
                        </Text>
                    </Text>
                    {/* )} */}
                    <Text
                        style={{ paddingTop: Platform.OS == 'ios' && Platform.isPad ? 5 : 0, width: Metrics.iPadHeightRatio(210) }}
                        lineHeight={18}
                        numberOfLines={1}
                        padding={{ Horizontal: 0 }}
                        color='lightTextColor'
                        size="Body">
                           Created By:  {user.user._id == item?.user?._id ? item?.user?.name+' (me)' :item?.user?.name}
                    </Text>
                    <Block margin={{ Top: 16 }} row >
                    <Block row  margin={{ Top: -10 }}>
                            <Icon name="icCalender" />
                            <Text
                                style={{ paddingTop: Metrics.iPadHeightRatio(5) }}
                                color='lightTextColor'
                                margin={{ Horizontal: 4 }}
                                size="Body">
                                {/* {'26 April 2021'} */}
                                {moment(item.start_at).format('DD MMM, yy')}
                            </Text>
                        </Block>
                    </Block>
                    <Block margin={{ Vertical: 4 ,Top:6}} row >
                    <Icon name="icLocationPin" />
                        <Block height={38} flex row >
                            <Text
                                style={{ paddingTop: Platform.OS == 'ios' && Platform.isPad ? 5 : 0 }}
                                lineHeight={18}
                                numberOfLines={2}
                                padding={{ Horizontal: 4 }}
                                color='lightTextColor'
                                size="H6">
                                    {item.address}
                                {/* {'In publishing and graphic design, Lorem ipsum is a'} */}
                            </Text>
                        </Block>
                        
                        {/* <Block row margin={{ Left: 18 }}>
                            <Icon name="icClock" />
                            <Text
                                style={{ paddingTop: Metrics.iPadHeightRatio(5) }}
                                margin={{ Horizontal: 4 }}
                                color='lightTextColor'
                                size="Body">
                                {moment(item.start_at).format('hh:mm A')}
                            </Text>
                        </Block> */}
                    </Block>
                </Block>
        </Block>
    )
}

// export default PropertyCardList
// const Styles = StyleSheet.create({
// })