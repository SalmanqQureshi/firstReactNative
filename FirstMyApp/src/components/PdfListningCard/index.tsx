import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Block, Icon, Image, Text, useAuth } from '..'
import { Colors, Images, Metrics, Sizes } from '../../config'


interface PdfListningProps {
    onPress: () => {},
    item:{
    },
    userRec?:[]
    onPressDelete?:()=>void
}
export const PdfListningCard = ({onPress,item,userRec, ...props}:PdfListningProps) => {
    const {user}= useAuth()

    return (
        <Block
            flex
            onPress={() => {onPress() }}
            style={{ borderRadius: Sizes.Base - 0, }}
            margin={{ Vertical: 6, Horizontal:  Metrics.iPadHeightRatio(16) }}
            shadow
            shadowColor='black'
            row
            padding={{All:16}}
            backgroundColor={Colors.onPrimary}>
            <Image source={Images.icPdfFile}
                style={{height:Metrics.heightRatio(41),width: Metrics.heightRatio(38)}} />
                <Block>
                    <Text
                        padding={{Top:7,Horizontal:14}}
                        style={{width:Metrics.iPadHeightRatio(240)}}
                        font='Medium'
                        numberOfLines={2}
                        size="H6">
                        {item?.title}
                    </Text>
                    <Text
                        padding={{ Horizontal: 14,Top:0 }}
                        color='lightTextColor'
                        size="Body">
                        {!!item?.is_revision
  ? `Updated by: ${item?.user?.name}${user?._id === item?.user?._id ? ' (You)' : ''}`
  : `Uploaded by: ${item?.user?.name}${user?._id === item?.user?._id ? ' (You)' : ''}`}
                    </Text>
                </Block>
                <Block align='right' flex> 
                {/* <Icon name="icDownload" style={{}}/> */}
                 { user?.policies.filter((item)=>item.module == 'project').map((item)=>{
                    if(item?.can_create){
                        return (user?._id == userRec?._id &&
                        <Block  onPress={props.onPressDelete}>
                            <Icon name='icTrash' color='red' size={24}/>
                        </Block>
                        )
                }})}
                </Block>
        </Block>
    )
}
const Styles = StyleSheet.create({
})