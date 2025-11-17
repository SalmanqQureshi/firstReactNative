import React from 'react'
import { Block, Button, Form, TextInput } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { Colors, Metrics } from '../../config'
import { request } from '../../components/ApiService'

export const ChangePasswod = () => {
    const { goBack } = useNavigation()
    return (
        <Block flex style={{ justifyContent: "center" }} gradient={[Colors.background, Colors.textBackground]}>
            {/* <Block align="center" margin={{Top:96}}>
        <Image
            source={Images.profileImage}
            style={{
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                marginBottom: Sizes.Base
            }}
        />
        <Image source={Icons.icImagePicker}
            style={{
                height: 53,
                width: 52,
                position: 'absolute',
                right: 30,
                bottom: -5
            }} />
    </Block> */}
            <Form onSubmit={(data) => request('user/change-password','POST')
            .withFormData({
                old_password:data.currentPassword,
                new_password: data.password
            })
            .onSuccess((response)=>{
                console.log('respone=======================>',response)
                goBack()
            })
            .onFailure((err) => {
                console.error('error=======================>',err)
              })
            .call()

             }>
                {({ submit, loading, register }) => (
                    <>
                        <Block flex margin={{ Horizontal: Metrics.iPadHeightRatio(16) }} >
                            <TextInput
                                label="Existing Password"
                                type="ExistingPassword"
                                {...register({ id: "currentPassword", next: "password" })}
                                secureTextEntry={true}
                                value={__DEV__ ? 'Admin@123' : ''}
                                style={{}}
                            />
                            <TextInput
                                label="New Password"
                                type="Password"
                                {...register({ id: "password", next: "confirmPassword" })}
                                secureTextEntry={true}
                                value={__DEV__ ? 'Admin@123' : ''}
                                style={{}}
                            />
                            <TextInput
                                label="Confirm Password"
                                type="ConfirmPassword"
                                {...register({ id: "confirmPassword", })}
                                secureTextEntry={true}
                                style={{}}
                                value={__DEV__ ? 'Admin@123' : ''}
                            />
                        </Block>
                        <Block align='bottom' margin={{ Bottom: 36 }}>
                            <Button label="Save" onPress={submit} style={{ width: '50%', alignSelf: 'center' }} loading={loading} />
                        </Block>
                    </>
                )}
            </Form>
        </Block>
    )
}
