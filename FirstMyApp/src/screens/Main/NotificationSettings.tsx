import React, { useState } from 'react'
import { Block, FlatList, Image, Text, Button, useAuth } from '../../components'
// import { MotiView } from 'moti'
import { Pressable, StyleSheet, Switch } from 'react-native'
import { Colors, Metrics } from '../../config'
import { useNavigation } from '@react-navigation/native'
import { MainStackProps } from '.'
import { request } from '../../components/ApiService'

export const NotificationSettings = (props: MainStackProps<'NotificationSettings'>) => {
    const { user , logIn} = useAuth()
    const { goBack } = useNavigation()
    const NotificationSettings = [
        {
            id: 'notify_on_new_job_assignment',
            title: 'When someone assigned you a new job',
            isStatus: user.notify_on_new_job_assignment,
        },
        {
            id: 'notify_on_task_start',
            title: 'When assigned task started',
            isStatus: user.notify_on_task_start,
        },
        {
            id: 'notify_on_task_end',
            title: 'When assigned task ended',
            isStatus: user.notify_on_task_end,
        },
        {
            id: 'notify_on_project_assignment',
            title: 'When someone assigned you a project',
            isStatus: user.notify_on_project_assignment,
        },
        {
            id: 'notify_on_drawing_revision',
            title: 'When drawing is updated/revision',
            isStatus: user.notify_on_drawing_revision,
        },
        {
            id: 'notify_on_task_overdue',
            title: 'When a task is overdue',
            isStatus: user.notify_on_task_overdue,
        },
    ]
    const [status, setStatus] = useState([...NotificationSettings]);
    const onSwitch = (data: any) => {
        const statusCheck = status.map((item) => {
            if (data.id == item.id) {
                return { ...item, isStatus: !item.isStatus }
            } else {
                return { ...item }
            }
        })
        setStatus(statusCheck);
    }
     const _handleSubmit=(data:any)=> {
        let formdata = new FormData();
        data.forEach((item, index) => {
            formdata.append(item.id, item.isStatus);
        })
        request(`user/${user?._id}`,'PATCH')
        .withBody(formdata)
        .onSuccess(response => {
        //   console.log(response)
        logIn({...response.data.data,access_token: user.access_token}, true)
            goBack()
        })
        .onFailure(err => {
            console.log('erreor====================>', {err})
        })
        .call()
        }
    return (
        <Block flex style={{ justifyContent: "center" }} gradient={[Colors.background, Colors.textBackground]}>
            <FlatList
                style={{ paddingTop: 15, marginHorizontal: Metrics.iPadHeightRatio(20) }}
                data={status}
                contentContainerStyle={{}}
                renderItem={({ item, index }) => (
                <SwitchRow label={item.title} status={!!item?.isStatus ? true : false}
                        onChange={() => { onSwitch(item), console.log({ status }) }} />
                )}
            />
            <Block align='bottom' margin={{ Bottom: 36 }}>
                <Button label="Save" onPress={() => {_handleSubmit(status)}}
                 style={{ width: '50%', alignSelf: 'center' }} />
            </Block>

        </Block>
    )
}
const SwitchRow = (props: any) => {
    const { label = '', status = false, onChange = () => { } } = props;
    return (
        <Block row space={'between'} style={Styles.CardContainer}>
            <Text font='Regular' size='H6' style={{ alignSelf: 'center' }}>
                {label}
            </Text>
            <Switch
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                trackColor={{ false: '#c7d1e6', true: Colors.textNumber }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#c7d1e6"
                onValueChange={onChange}
                value={status}
            />
        </Block>
    );
};
const Styles = StyleSheet.create({
    CardContainer: {
        marginTop: 10,
        // backgroundColor: Colors.onPrimary,
        paddingVertical: 18,
        // borderRadius: 10
    },
});