// import { MotiView } from 'moti'
import React from 'react'
import { ImageSourcePropType, Pressable, StyleSheet } from 'react-native'
import { Block } from '../Layout'
import { Image } from '../Image'
import { Text } from '../Text'
import { Colors, Metrics } from '../../config'
import { useAuth } from '../useAuth'
import { Icon } from '../Icon'

interface ProjectFolderItemsProps{
    index?:number,
    name:string,
    Icons?:ImageSourcePropType
    Images:ImageSourcePropType,
    userRec?:[]
    onPress?:()=>{}
    onPressDelete?:()=>void
}
export const ProjectFolderItems = ({index,Images,onPress,Icons,name,userRec,...props}:ProjectFolderItemsProps) => {
  const {user} = useAuth()
  return (
    <Block
              key={index}
             >
              <Pressable
                style={{ marginTop: 10, marginHorizontal: Metrics.iPadHeightRatio(16) }}
                onPress={onPress}>
                <Block row style={styles.CardContainer}>
                  <Image source={Images} size={24} />
                  <Text
                    font="Medium"
                    size="H6"
                    color='textColors'
                    style={{width:230}}
                    numberOfLines={1}
                    margin={{ Left: 15 }}>
                    {name}
                  </Text>
                  <Block flex align='right'>
                    { user?.policies.filter((item)=>item.module == 'project').map((item)=>{
                      if(item?.can_create){
                         return (user?._id == userRec?._id &&
                            <Block onPress={props.onPressDelete}>
                              <Icon name='icTrash' color='red' size={24}/>
                            </Block>
                          )
                }})}
                  </Block>
                </Block>
              </Pressable>
            </Block>
  )
}
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
    },})