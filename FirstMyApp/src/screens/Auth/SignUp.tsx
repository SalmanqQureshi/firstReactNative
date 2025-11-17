import {Block, Button, Text, TextInput} from '../../components';
import {Colors} from '../../config';
import { AuthProps } from '.';

export const SignUp = (props:AuthProps<"SignUp">) => {
  return (
    <Block flex margin={{Bottom:80,Horizontal:16}} align="bottom">
    <Block >
      <Text size="H4" font="SemiBold" color="onPrimaryContainer">
        Create Account
      </Text>
      <Text color="outline">
        Register yourself here to continue..
      </Text>     
      <TextInput label=" Name" LeftIcon={{name:"message"}} />
      <TextInput label="Email" LeftIcon={{name:"message"}} />
      <TextInput label="Password" LeftIcon={{name:"message"}} />
      <Button label="Register" />
      <Text
        align="center"
        onPress={() => props.navigation.navigate('SignIn')}
        lineHeight={48}>
        Already have an account?{' '}
        <Text font="SemiBold" color="primary">
          Sign in
        </Text>
      </Text>
    </Block>
    </Block>
  );
};