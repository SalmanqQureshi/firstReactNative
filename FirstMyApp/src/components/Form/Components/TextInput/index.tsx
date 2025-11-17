import {
  Animated,
  Pressable,
  TextInput as TextInputBase,
  TextInputProps as TextInputBaseProps,
  ViewStyle,
} from 'react-native';
import React, { forwardRef, useRef, useState } from 'react';
import { InputTypes, style } from './config';
import { IconSourceType } from '../../../Icon';
import { useForm } from '../..';
import { useBoolAnimation } from '../../../useBoolAnimation';
import { Colors, Icons } from '../../../../config';

export interface TextInputProps extends TextInputBaseProps {
  type: keyof typeof InputTypes;
  label: string;
  leftIcon?: IconSourceType;
  rightIcon?: IconSourceType;
  next?: string;
  isError?: boolean;
  ErrorText?: string[];
  style?: object;
  inputStyleContainer?: object;
  errorText?: string;
  onRightIconPress?: () => null
}

export const TextInput = forwardRef<any, TextInputProps>(
  ({ leftIcon, rightIcon, value = '', ...props }, upRef) => {
    const textInputRef = useRef<TextInputBase>(null);
    const isPassword =
      props.type == 'Password' || props.type == 'ConfirmPassword';
    const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
    const { State, setState } = useForm({
      upRef,
      focus() {
        textInputRef.current?.focus();
      },
      validate: (value, form) =>
        InputTypes[props.type].validate(props.label, value, form),
      initialValue: value,
    });
    const animateOnFocus = useBoolAnimation(State.isFocused);
    const animateOnError = useBoolAnimation(State.isError);

    const styles = style(animateOnFocus, animateOnError, props);
    return (
      <Animated.View style={{ ...styles.container, ...props.style }}>
        {!styles.shouldShowFloatingLabel && (
          <Animated.Text style={styles.label}>{props.label}</Animated.Text>
        )}
        <Animated.View
          style={{ ...styles.inputContainer, ...props.inputStyleContainer }}>
          {!!leftIcon && (
            <Animated.Image style={styles.icon} source={Icons[leftIcon]} />
          )}
          <Animated.View style={{ flex: 1 }}>
            {styles.shouldShowFloatingLabel && (
              <Animated.Text style={[styles.floatingLabel,!!props.multiline?{marginTop:10}:{}]}>
                {!State.isFocused || !props.multiline ? props.label : ''}
              </Animated.Text>
            )}
            <TextInputBase
              textAlignVertical={props.multiline ? 'top' : 'center'}
              ref={textInputRef}
              secureTextEntry={secureTextEntry}
              //@ts-ignore
              enterKeyHint={!!props.next ? 'next' : 'done'}
              onFocus={() => {
                setState(s => ({ ...s, isFocused: true }));
              }}
              onBlur={() => {
                setState(s => ({ ...s, isFocused: s.value != '' }));
              }}
              onChangeText={value => {
                setState(s => ({ ...s, isError: false, ErrorText: [], value }));
              }}
              value={State.value}
              onSubmitEditing={e => {
                props.onSubmitEditing?.(e);
              }}
              {...(props.overrideValue && ({ value: props.overrideValue }))}
              {...props}
              {...(InputTypes[props.type]?.additionalProps || props.overrideValue)}
              style={{color:Colors.textColors}}
            />
          </Animated.View>
          {!!rightIcon && (
            <Pressable onPress={() => { props.onRightIconPress() }}>
              <Animated.Image style={styles.icon} source={Icons[rightIcon]} />
            </Pressable>
          )}
          {isPassword && (
            <Pressable onPress={() => setSecureTextEntry(s => !s)}>
              <Animated.Image
                style={styles.icon}
                source={secureTextEntry ? Icons.icEyeClose : Icons.icEye}
              />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View style={styles.errorContainer}>
          {!!(State.isError) &&
            // State.ErrorText.map(e => (
            <Animated.Text style={styles.errorText}>{props.errorText ?? State.ErrorText[0]}</Animated.Text>
            // ))
          }
          {!!(props.isError) &&
            // props.ErrorText?.map?.(e => (
            <Animated.Text style={styles.errorText}>{props.ErrorText[0]}</Animated.Text>
            // ))
          }
        </Animated.View>
      </Animated.View>
    );
  },
);

