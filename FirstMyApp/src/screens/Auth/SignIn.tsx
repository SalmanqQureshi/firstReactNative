import React, { useEffect, useState } from 'react';
import { Block, Text, Button, TextInput, useAuth, Form, Image } from '../../components';
import { AuthProps } from '.';
import { Colors, Images, Metrics } from '../../config';
import { ActivityIndicator, Platform } from 'react-native';
import { request } from '../../components/ApiService';
import moment from 'moment';
import { getFcmToken } from '../../fcm';
export const SignIn = (props: AuthProps<"SignIn">) => {
  const { logIn } = useAuth()
  var timeZoneAbbreviation = moment().zoneName();
console.log("Time Zone Abbreviation: " + timeZoneAbbreviation); 
  const [passwordState, setPasswordState] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      <ActivityIndicator color={Colors.error} size={'large'} />
    }, 20000);
  }, [false])

  return (
    <Block flex scroll scrollGradient gradient={[Colors.background, Colors.textBackground]}>
      <Form onSubmit={async (data) => request('user/login','post')
      .withOutAuth()
      .withFormData({
        email: data.email,
        password: data.password,
        device_token: `${Platform.OS}|${await getFcmToken()}`,
        device: Platform.OS,
        role: 'user',
      })
      .onSuccess(response => {
        console.log(response),
        console.log(response.data.data),
        logIn({...response.data.data, access_token: response.headers.access_token}, true)
      })
      .onFailure(err => {
        console.log(err),
        console.log('erreor====================>', {err})
      })
      .call()
      }>
        {({ register, submit, loading }) => (
          <Block style={{ flexGrow: 1 }} flex >
            <Image source={Images.LoginLogo} 
            style={{
               alignSelf: 'center',
               marginTop: Metrics.ISPad? Metrics.iPadHeightRatio(70): Metrics.iPadHeightRatio(120), 
               width: Metrics.heightRatio(250), 
               height: Metrics.heightRatio(56) }} />
            <Block flex align="bottom" margin={{ Bottom: Metrics.iPadHeightRatio(80), Horizontal: Metrics.iPadHeightRatio(16) }}>
              <Text margin={{ Top: 18 }} size="H1" font="Medium">
                Welcome!
              </Text>
              <TextInput {...register({ id: "email", next: "password" })}
              // value={__DEV__ ? 'emp1@yopmail.com':''}
              label="Email Address" type="Email" keyboardType='email-address'
              style={{}} />
              <TextInput
                {...register({ id: "password" })}
                label="Password"
                type="ExistingPassword"
                // value={__DEV__ ? 'Admin@123$':''}
                rightIcon={passwordState ? 'icPassword' : 'icOPenEye'}
                onRightIconPress={() => { setPasswordState(s => !s) }}
                secureTextEntry={passwordState}
                style={{}}/>
              <Button label="Login" onPress={submit} type='Solid' style={{ marginTop: 43 }} loading={loading} />
              <Text
                margin={{ Top: 20 }}
                lineHeight={50}
                font="Medium"
                size='H6'
                onPress={() => props.navigation.navigate("Forgot")}
                color={'musterdYellow'}
                align="center">
                Forgot Password?
              </Text>

            </Block>
          </Block>
        )}
      </Form>
    </Block>

  );
};
