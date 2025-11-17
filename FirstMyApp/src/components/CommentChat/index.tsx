import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { Image, Text, Block, Icon, modalInToGiftedChatObjects, useAuth, ImageButton } from '../../components';
import { Colors, Icons, Images, Metrics, Sizes } from '../../config';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import KeyboardManager from 'react-native-keyboard-manager';
import { setAdjustPan, setAdjustResize } from 'rn-android-keyboard-adjust';
import { useSocket } from '../useSocket';
import { request } from '../ApiService';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import { pop } from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FileUpload from './FileUpload';

export const CommentChat = (item: {}) => {
    const { user} = useAuth()
    console.log('uuuuu', user)
    const { navigate } = useNavigation()
    const inputRef = useRef();
    const user_id = user?._id;
    const task_id = item?.item?._id
    const [loading,setLoading] = useState(false)
    const [messages, setMessages] = useState([
    ]);
    const [isFileLoading, setFileLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false)
    const [isLoadingEarlier, setLoadingEarlier] = useState(false);
    const [isLoadEarlier, setLoadEarlier] = useState(false);
    const emit = useSocket({
        load_conversations: msg => {
            console.log('load_conversations ', msg);
            setLoading(true)
            setLoadingEarlier(false)
            setTimeout(() => {
                setLoading(false)
            }, 1500);
            setLoadEarlier(msg.data.length && msg.data.length % 20 == 0 ? true : false,)
            setMessages(previousMessages =>
                GiftedChat.append(
                    modalInToGiftedChatObjects(msg.data),
                    previousMessages,
                ),
            );
        },
        join_room: (res) => {
        AsyncStorage.setItem('_setRoomId',task_id);
            console.log('_getRoomIdWithCb ', res);
        },
        leave_room: (res) => {
            console.log('leave_room ', res);
            AsyncStorage.removeItem('_setRoomId',(err)=>{console.log('fdjksdkjfdksdjkdsjkldsjkl')})
        },
        message: (res) => {
            inputRef.current?.clear();
            console.log('ssssssssss ', res);
            if(res.statusCode == 404){
                showMessage({message:res.message,type:'danger'})
                pop()
            }
            if (res.data.task_id == task_id)
                setMessages(previousMessages =>
                    GiftedChat.append(
                        previousMessages,
                        modalInToGiftedChatObjects([res.data]),
                    ),
                );

        }
    });
    const onLoadEarlier = () => {
        setLoadingEarlier(true)

        emit("load_conversations", {
            task_id: task_id,
            room_id: 'task_' + task_id,
            last_record_id: messages[messages.length - 1]._id,
        })
    }

    useEffect(() => {
        emit('join_room', { room_id: 'task_' + task_id });
        return () => {
            emit('leave_room', { room_id: 'task_' + task_id });
        }
    }, [])

    const onSend = useCallback(() => {
        const msg = inputRef.current?.getValue();
        if (msg) {
            const msgData = {
                task_id: task_id,
                room_id: 'task_' + task_id,
                message: msg,
                type: 'text',
            };
            emit("message", msgData)
        }
    }, []);


    React.useEffect(() => {
        if (Platform.OS == 'android') {
            setAdjustResize();
        }
        return () => {
            if (Platform.OS == 'android') {
                setAdjustPan();
            }
        };
    }, []);
    useEffect(() => {
        emit('load_conversations', { task_id });
    }, [])
    const _onUploadImg = (fileMedia: {}) => {   
        setFileLoading(true)
        let formData = new FormData();
        let extenName = fileMedia
        const ext = extenName?.slice?.((Math.max(0, extenName.lastIndexOf(".")) || Infinity) + 1);
        // fileMedia?.forEach?.((item, index) => {
            formData.append(`file`, extenName)
        // });
        formData.append('type', ext == 'pdf' ? 'file' : 'image')
        console.log('fileMessage =========', formData)
            request('upload/media', 'POST')
            .withBody(formData)
            .withOutToast()
            .onSuccess((response) => {
                const { url, type } = response.data.data;
                console.log(url, ';;============================>,', response.data)
                const params = {
                    room_id: "task_" + task_id,
                    task_id: task_id,
                    type: type,
                    url: url
                }
                emit("message", params)
                setFileLoading(false)
            }).onFailure((err) => setFileLoading(false))
            .call()
       
    }
    const Input = forwardRef((props, ref) => {
        const [val, setVal] = useState('');
        useImperativeHandle(ref, () => ({
            getValue: () => val,
            setValue: (text: string) => {
                setVal(text);
            },
            clear: () => {
                setVal('');
            }
        }));

        return (
            <TextInput placeholder='Enter message here...'
                onChangeText={text => setVal(text)}
                value={val}
                multiline
                placeholderTextColor={Colors.surfaceVariant}
                style={{ height: 52, width: '85%', color: '#000', marginLeft: Metrics.heightRatio(-12), paddingTop: 12 }} />
        );
    });
    const renderInputToolbar = ({ }) => {
        return (
            <View
                style={styles.inputContainer}>
                    <ImageButton
                    onPress={() => {setModalVisible(true)}}
                    loading={isFileLoading}
                    source={Icons.icAttachFile}
                        style={{
                            alignSelf: 'center', 
                            marginLeft: Metrics.heightRatio(-6),
                            height: 53,
                            width: 52,
                            bottom: -10
                        }} />
                <Input ref={inputRef} />
                <TouchableOpacity onPress={onSend} style={{ alignSelf: 'center', marginLeft: Metrics.heightRatio(-6) }}>
                    <Icon name={'icSend'} size={24} />
                </TouchableOpacity>
            </View>
        );
    };
    useEffect(() => {
        if (Platform.OS == "ios") {
            KeyboardManager.setEnable(false);
            KeyboardManager.setEnableAutoToolbar(false);
            return () => {
                KeyboardManager.setEnable(true);
                KeyboardManager.setEnableAutoToolbar(true);
            };
        }
    }, []);

    const renderBubble = (props: any) => {
        if (props.currentMessage.isFile) {
            const fileUrl = props.currentMessage.file;
            const handlePress = () => {
                navigate('ProjectDetailPdfPage', {
                    ScreenTitleName: 'PDF from Chat',
                    file_path: fileUrl
                })
            };

            // Apply bubble styles here
            const bubbleStyle = props.position === 'left' ? styles.bubble.wrapperStyle.left : styles.bubble.wrapperStyle.right;
            const textStyle = props.position === 'left' ? styles.bubble.textStyle.left : styles.bubble.textStyle.right;

            return (
                <View style={[bubbleStyle]} key={props.currentMessage._id}>
                    <TouchableOpacity onPress={handlePress} style={styles.fileContent}>
                        <Image source={Images.icPdfFile} style={styles.icon} />
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Text style={[styles.fileLabel, textStyle]}>
                                {fileUrl.endsWith('.pdf') ? 'PDF File' : 'Document'}
                            </Text>
                            <Text style={[styles.timeText, { marginLeft: 6 }]}>
                                {moment(props.currentMessage.createdAt).format('h:mm A')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

        return <Bubble {...props} {...styles.bubble} key={props.currentMessage._id}/>;
    };

    return (
        <>
            <Block safe flex padding={{ Bottom: 16 }}  gradient={[Colors.background,Colors.textBackground]}>
{
    loading ? <ActivityIndicator size={'large'}  style={{alignSelf:'center',flex:1}}  color={Colors.primary}/> :

            <GiftedChat
                user={{ _id: user_id }}
                messages={messages}
                placeholder='Enter message here…'
                renderBubble={renderBubble}
                textInputProps={{
                    color: Colors.textColors
                }}
                onLoadEarlier={onLoadEarlier}
                isLoadingEarlier={isLoadingEarlier}
                loadEarlier={isLoadEarlier}
                renderInputToolbar={renderInputToolbar}
                renderAvatar={({ currentMessage }) => {
                    return (
                        user._id !== currentMessage?.user?._id &&
                        <Block flex align='center'>
                            <Image source={{ uri: currentMessage?.user?.avatar }} style={{ height: 44, width: 44, borderRadius: 24, }} />
                        </Block>
                    )
                }}
            />
}
            </Block>
            <FileUpload
            onFileUpload={(file)=>{_onUploadImg(file)}}
            onBackPress={()=>{setModalVisible(false)}}
            visible={isModalVisible}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    bubble: {
        textStyle: {
            left: {
                color: Colors.textColors,
                fontSize: 13,
            },
            right: {
                color: Colors.textColors,
                fontSize: 13,
                marginBottom: 0
            },
        },
        wrapperStyle: {
            left: {
                borderTopLeftRadius: 0,
                padding: Sizes.Base / 2,
                backgroundColor: Colors.surface,//'#e4e6ec',
                marginBottom: 18
            },
            right: {
                borderTopRightRadius: 0,
                padding: Sizes.Base / 2,
                backgroundColor: Colors.chatsideColor,
                marginBottom: 18,
            }
        },
    },
    headerImgStyle: {
        marginRight: 10,
        width: 42,
        height: 42,
        borderRadius: 42,
    },
    sendBtnIcon: {
        marginLeft: 10,
        width: 22,
        height: 22,
    },
    dotStyle: {
        height: 6,
        width: 6,
        borderRadius: 6,
        // backgroundColor: Colors.GREEN,
        marginRight: 5,
    },
    onlineDot: {
        width: 8,
        height: 8,
        backgroundColor: '#2ad601',
        borderRadius: 50,
    },
    userImageStyle: { width: 40, height: 40 },
    inputContainer: {
        marginTop: Platform.OS == 'ios' ? -18 : 0,
        flexDirection: 'row',
        paddingRight: 32,
        backgroundColor: '#fff',
        // bottom: 0,
        // marginBottom: 16,
        width: '94%',
        justifyContent: 'space-between',
        borderColor: Colors.chatsideColor,
        borderWidth: 1,
        borderRadius: 6,
        // marginLeft: 16,
        // marginRight: -16,
        alignSelf: 'center',
        alignItems:'flex-end',
        paddingLeft: Sizes.Base,
        marginBottom:Platform.OS==='ios' ?30 :0
    },
    bubble2: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        padding: 10,
        marginBottom: 18,
        maxWidth: '80%',
    },
    fileContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    fileLabel: {
        fontSize: 14,
        color: '#555',
    }, timeText: {
        fontSize: 10,
        color: '#999',
        alignSelf: 'flex-end',
    }
});
