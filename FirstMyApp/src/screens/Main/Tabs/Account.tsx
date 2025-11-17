import React, { useEffect } from 'react'
import { Block, FlatList, Icon, Image, ProjectFolderItems, Text, useAuth } from '../../../components'
import { Colors, Icons, Images, Metrics, Sizes } from '../../../config'
import { Alert, Platform, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { MotiView } from 'moti'
import { TabProps } from '.';
import { request } from '../../../components/ApiService'
import { getFcmToken } from '../../../fcm'
import { removeSocketInstance } from '../../../components/useSocket'

export const Account = (props: TabProps<'Account'>) => {
    const { logOut, user, logIn} = useAuth()
console.log('uuuuu',user)
    const logout = async () => {
       request('user/remove-device-token','post')
        .withOutToast()
        .withFormData({
        device_token: `${Platform.OS}|${await getFcmToken()}`,
        })
        .onSuccess(response => {
            removeSocketInstance()()
            logOut(),
            console.log('Logout Success',response)})
        .onFinally(response => {
            removeSocketInstance()()
            logOut(),
            console.log('Logout Success',response)})
        .onFailure(err => {})
        .call()
        }
      useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <Icon
                    size={60}
                    onPress={() => {
                        Alert.alert('Logout', 'Are you sure you want to logout?', [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Ask me later pressed'),
                            },
                            {
                                text: 'Logout',
                                onPress:()=>{logout()},
                            },

                        ]);
                    }}//logOut()
                    margin={{ Right: Metrics.iPadHeightRatio(8), Top: Metrics.iPadHeightRatio(10) }}
                    name={'icLogout'} />)
        })
    }, [])
    const listData = [
        {
            title: 'Edit Profile',
            Image: Images.icEdit,
            onPress: 'EditProfile'
        },
        {
            title: 'Change Password',
            Image: Images.icPassword,
            onPress: 'ChangePassword'
        },
        {
            title: 'About App',
            Image: Images.icAbout,
            onPress: 'AboutUs'
        },
        {
            title: 'Notification Settings',
            Image: Images.icNotification,
            onPress: 'NotificationSettings'
        }
    ]
    return (
        <Block flex gradient={[Colors.background, Colors.textBackground]}>
            <Block flex   >
                <Image
                    moti
                    from={{ opacity: 0, height: 0, width: 0 }}
                    transition={{ delay: 200 * 5 }}
                    animate={{ opacity: 1, height: 126, width: 126 }}
                    source={{ uri: user?.image_url }}
                    style={styles.avatar}
                />
                <Block padding={{ Horizontal: 16 }}>
                    <Text
                        moti
                        from={{ opacity: 0, fontSize: 2 }}
                        transition={{ delay: 200 * 2 }}
                        animate={{ opacity: 1, fontSize: 30 }}
                        align="center"
                        margin={{ Top: 16 }}
                        numberOfLines={1}
                        font="Medium"
                        size="H1">
                        {user?.name}
                    </Text>
                    <Text
                        color="lightTextColor"
                        align="center"
                        margin={{ Top: 4 }}
                        numberOfLines={1}
                        moti
                        from={{ opacity: 0, fontSize: 2 }}
                        transition={{ delay: 200 * 3 }}
                        animate={{ opacity: 1, fontSize: 16 }}
                        size="H5">
                        {user?.email}
                    </Text>
                </Block>
                <FlatList
                    style={{ paddingTop: 15 }}
                    data={listData}
                    keyExtractor={(item, index) => item + index.toString()}
                    renderItem={({ item, index }) => (
                        <ProjectFolderItems
                            onPress={() => item.onPress == 'NotificationSettings' ? props.navigation.navigate(item.onPress) : props.navigation.navigate(item.onPress)}
                            Images={item.Image}
                            name={item.title}
                            index={index}
                            Icons={Icons.arrowRight} />
                    )}
                />
            </Block>
        </Block>
    )
}
const styles = StyleSheet.create({

    avatar: {
        height: Metrics.iPadHeightRatio(110),
        width: Metrics.iPadHeightRatio(110),
        resizeMode: 'cover',
        borderRadius: Metrics.heightRatio(100),
        alignSelf: 'center',
    },
    CardContainer: {
        margin: 0,
        alignItems: 'center',
        backgroundColor: Colors.onPrimary,
        padding: 18,
        borderRadius: 10
    },
});