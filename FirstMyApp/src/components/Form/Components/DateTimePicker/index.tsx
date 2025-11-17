import { Alert, Pressable, View, ViewStyle } from 'react-native';
import React, { forwardRef, useState } from 'react';
import { TextInput } from '../TextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useForm } from '../../useForm';
// import { defaultTime } from '../../../DateFormatter';
import moment from 'moment';

interface DatePickerProps {
    label: string;
    errorTxt?: string | undefined | null;
    value?: Date;
    containerStyle?: ViewStyle;
    class?: "survey";
    mode?: "date" | 'time';
    style?: ViewStyle;
    minimumDate?: Date;
    maximumDate?: Date;
    onChange?: (date: Date) => any
}

export const DateTimePicker = forwardRef<any, DatePickerProps>(
    ({ containerStyle, label, value = '', errorTxt, ...props }, upRef) => {
        const [ModalVisible, setModalVisible] = useState(false);
        const { State, setState, downRef } = useForm<null | Date>({
            upRef,
            validate(current, form) {
                return [(!current) && errorTxt + " is required"].filter(s => !!s)
            },
            focus() { },
            initialValue: value,
        });

        // console.log(State.value)

        return (
            <>
                <Pressable onPress={() =>{setModalVisible(true)}} style={props.style}>
                    <View pointerEvents="none">
                        <TextInput
                            {...props}
                            editable={false}
                            ref={downRef}
                            ErrorText={State.ErrorText}
                            errorText={State.ErrorText}
                            isError={State.isError}
                            // style={[containerStyle]}
                            label={label}
                            key={
                                'DatePicker' +
                                (!!State.value && props.mode == 'time' ? State.value : !!State.value ? State.value : '')
                            }
                            overrideValue={!!State.value && props.mode == 'time' ? State.value?.toLocaleTimeString?.([], { hour: '2-digit', minute: '2-digit' }) : !!State.value ? State.value?.toLocaleDateString?.() : State.value}
                            value={!!State.value && props.mode == 'time' ? State.value?.toLocaleTimeString?.([], { hour: '2-digit', minute: '2-digit' }) : !!State.value ? State.value?.toLocaleDateString?.() : State.value}
                            type="Text"
                            multiline={false}
                            class={props.class}
                            rightIcon={'icCalender'}
                        />
                    </View>
                </Pressable>
                <DateTimePickerModal
                    isVisible={ModalVisible}
                    mode={props.mode}
                    date={!!State.value ? new Date(State.value) : undefined}
                    minimumDate={props.minimumDate}
                    maximumDate={props.maximumDate}
                    onConfirm={date => {
                        console.log(date)
                        setModalVisible(false);
                        setState(s => ({
                            ...s,
                            value: date,
                            isError: false,
                        }));
                        props.onChange?.(date)
                    }}
                    onCancel={() => {
                        setModalVisible(false);
                    }}
                    dateFormat="yyyy"
                    yearItemNumber={9}
                    required
                />
            </>
        );
    });