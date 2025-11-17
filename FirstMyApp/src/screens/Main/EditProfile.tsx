import React, { useRef } from 'react'
import { Block, Button, Form, Image, ImageButton, TextInput, useAuth } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { Colors, Icons, Images, Metrics, Sizes } from '../../config'
import { request } from '../../components/ApiService'
import ImageCropPicker from 'react-native-image-crop-picker'
import { ImagePicker } from '../../components/Form/Components/ImagePicker'
export const EditProfile = () => {
    const { goBack } = useNavigation()
    const { user,logIn }=useAuth()
    const refImg = useRef(null);
    console.log(user?._id)
    const _handleSubmit=(data:any)=> {
        let image=refImg.current?.getImg()
        const userData={
            ...data,
        }    
        if(!!refImg.current?.getImg().length){
            userData['image']=image[image.length-1]
        }
        // console.log(image[image.length-1]['uri'])
        console.log('data======================++>',data)
     request(`user/${user?._id}`,'PATCH')
        .withFormData(userData)
        .onSuccess(response => {
          console.log(response)
          logIn({...response.data.data, access_token: user.access_token}, true)
          goBack()
        })
        .onFailure(err => {
          console.log(err),
          console.log('erreor====================>', {err})
        })
        .call()
    }
    return (
        <Form onSubmit={_handleSubmit}>
            {({register,loading,submit})=>(
        <Block scroll flex style={{ justifyContent: "center" }} gradient={[Colors.background, Colors.textBackground]}>
            <Block align="center" margin={{Top:Metrics.iPadHeightRatio(36),}}>
            <ImagePicker
                ref={refImg}
                min={1} single max={20}>
                {({ pick, images }) => {
                    console.log('IMages=======================   ',images)
                    return (
              <>
              <Image
                    source={{uri: !!images.length ? images[images.length - 1].uri : user?.image_url }}
                    style={{
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        marginBottom: Sizes.Base,
                        height:Metrics.iPadHeightRatio(110),
                        width:Metrics.iPadHeightRatio(110),
                        borderRadius:Metrics.heightRatio(100)
                    }}
                />
                <ImageButton
                onPress={pick}
                source={Icons.icImagePicker}
                    style={{
                        height: 53,
                        width: 52,
                        position: 'absolute',
                        right: 30,
                        bottom: -5
                    }} />
                    </>
                )}}
                </ImagePicker>
            </Block>
            <Block flex margin={{Horizontal: Metrics.iPadHeightRatio(16),Top:72}}>
                <TextInput
                    label="Full Name"
                    type="Text"
                    returnKeyType='done'
                    maxLength={30}
                    {...register({ id: "name", next: "email" })}
                value={user?.name}
                style={{}}
                />
                <TextInput
                    style={{}}                
                    label="Email"
                    type="Email"
                    value={user?.email}
                    editable={false}
                />
            </Block>
            <Block align='bottom' margin={{Bottom:36}}>
                <Button label="Update" onPress={submit} style={{ width: '50%', alignSelf: 'center' }} loading={loading} />
            </Block>
        </Block>)}
        </Form>
    )
}

