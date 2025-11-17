import React from 'react'
import { Block, FlatList, Image, Text } from '../../components'
// import { MotiView } from 'moti'
import { Pressable, StyleSheet } from 'react-native'
import { Colors, Icons, Images, Metrics } from '../../config'
import { useNavigation } from '@react-navigation/native'

export const AboutUs = () => {
  const {navigate}=useNavigation()
    const listData=[
        {
            title:'About',
            Image:Images.icAbout,
            onPress:'EditProfile'
        },
        {
            title:'Terms & Conditions',
            Image:Icons.icTermCondition,
            onPress:'ChangePassword'
        },
        {
            title:'Privacy Policy',
            Image:Icons.icPrivacyPolicy,
            onPress:'AboutUs'
        },
    ]
  return (
    <Block flex style={{ justifyContent: "center" }} gradient={[Colors.background, Colors.textBackground]} >
       <FlatList
                style={{ paddingTop: 15 }}
                data={listData}
                renderItem={({ item,index }) => (
                    <Block
                    key={index}
                            from={{opacity: 0, translateY: 50}}
                            animate={{opacity: 1, translateY: 0}}
                            transition={{delay: 100 + index * 200}}>
                            <Pressable
                              style={{marginTop: 10}}
                              onPress={()=>navigate('PrivacyPolicy',{itemClickTitle:item.title})}>
                              <Block row style={styles.CardContainer}>
                                <Image source={item.Image} size={24}/>
                                <Text
                                  font="Medium"
                                  size="H6"
                                  color='textColors'
                                  margin={{Left:15}}>
                                  {item.title}
                                </Text>
                                <Block flex align='right'>
                                <Image source={Icons.arrowRight} style={{flex:1,height:24,width:24,tintColor:Colors.lightTextColor}} />
                                </Block>
                              </Block>
                            </Pressable>
                          </Block>
                )}
                contentContainerStyle={{ paddingBottom: 110 }}
            />
    </Block>
  )
}
const styles = StyleSheet.create({
    avatar: {
        height: 126,
        width: 126,
        resizeMode: 'cover',
        borderRadius: 50,
        alignSelf: 'center',
    },
    CardContainer: {
        margin: 0,
        alignItems:'center',
        backgroundColor:Colors.onPrimary,
        padding: 18,
        borderRadius:10,
        marginHorizontal:Metrics.iPadHeightRatio(18)
      },
});
