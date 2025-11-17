import React from 'react';
import {Block, Button, Form, Image, Text, TextInput} from '../../components';
import {Colors, Images, Metrics} from '../../config';
import {AuthProps} from '.';
import { request } from '../../components/ApiService';

export const Forgot = (props: AuthProps<'Forgot'>) => {
  return (
    <Block scroll style={{flexGrow:1}} flex gradient={[Colors.background,Colors.textBackground]}>
          <Image source={Images.LoginLogo} style={{   
            alignSelf:'center',
            margin:Metrics.heightRatio(96),
            width:Metrics.heightRatio(250),
            height:Metrics.heightRatio(56)}}/>
          <Form onSubmit={(data) => request('user/forgot-password','POST')
      .withOutAuth()
      .withFormData({
        email: data.email,
      })
      .onSuccess(response => {
        console.log({ApiResponse: response.headers.access_token})
        props.navigation.goBack()
      })
      .onFailure(err => {
        console.log(err),
        console.log('erreor====================>', {err})
      })
      .call()
      }>
        {({ register, submit, loading }) => (
          <Block flex align="bottom" margin={{ Bottom:Metrics.iPadHeightRatio(130), Horizontal: Metrics.iPadHeightRatio(16) }}>
            <Text margin={{ Top: 18 }} size="H1" font="Medium">
            Forgot Password
            </Text>
            <TextInput label="Email Address" type="Email" keyboardType='email-address' {...register({ id: "email",})}
            style={{}}/>
            <Button label="Send" loading={loading} onPress={submit} type='Solid' style={{marginTop:36}} />
            <Text
              lineHeight={50}
              font="Medium"
              size='H6'
              onPress={() => props.navigation.goBack()}
              color={'musterdYellow'}
              margin={{Top:20}}
              align="center">
              Back to Login
            </Text>
          </Block>
        )}</Form>
        </Block>
  );
};
