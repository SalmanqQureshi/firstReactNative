import React, { memo, useState } from 'react'
import { Block, Text, isPlatformAndroid, useDebouncedFunction } from '../../components';
import { PermissionsAndroid, Platform, Pressable, TouchableHighlight } from 'react-native';
import { Modal } from '../Form/Components/Modal';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Sizes, Colors,Metrics } from '../../config';
import { showToast } from '../../components/Toast';


const option = [
    {
        id: 'photo',
        value: 'Camera',
    },
    // {
    //     id: 'video',
    //     value: 'Video Record',
    // },
    {
        id: 'any',
        value: 'Gallery',
    },
];

export interface FileUploadProps {
    visible: boolean,
    onFileUpload: ({ }) => void,
    onBackPress: () => void,
}


const FileUpload = ({ visible = false, onFileUpload, onBackPress }: FileUploadProps) => {
    const { debounce } = useDebouncedFunction();

    const addImages = (images: { [key: string]: object[] }, type = 'video') => {
        console.log({ images })
        const file = {
            uri: images?.path,
            type: images.mime,
            name: type == "video" ? "Video.mp4" : "Image.jpg",
            filename: getName(images?.path)
        }

        if (type == 'video') {
            if (images.duration < 3000) {
                showToast({ message: 'Video must be greater then 3 seconds', type: 'danger' });
            } else {
                onFileUpload(file);
            }
        } else {
            onFileUpload(file);
        }
    };

    const getName = (filePath: any) => {
        const imgName = filePath.split('/')
        return imgName[imgName.length - 1]
    }

    const pickerOption = async (option: string) => {
        if (Metrics.androidPlatform) {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            ])
        }
        if (option == 'photo' || option == 'video') {
            setTimeout(() => {
                ImageCropPicker.openCamera({
                    mediaType: option,
                    compressImageQuality: 0.4,
                    compressVideoPreset: 'MediumQuality',
                    cropping: false,
                }).then(s => addImages(s, option));
            }, 800)
        } else {
            setTimeout(() => {
                ImageCropPicker.openPicker({
                    multiple: false,
                    maxFiles: 1,
                    mediaType: option,
                    compressImageQuality: 0.4,
                    cropping: false,
                }).then(s => {
                    const [type, extension] = s.mime.split('/');
                    addImages(s, type)
                });
            }, 800)
        }
    }

    return (
        <Modal
            Visible={visible}
            onBackPress={onBackPress}
            type="Bottom">
            <Block margin={{}} backgroundColor={Colors.background}>
                <Text margin={{ Bottom: Sizes.Base, Left:Sizes.Base-8,Top:Sizes.Base-8 }} font="SemiBold" style={{ textTransform: "capitalize" }} size="H5">Add Media</Text>
                {option.map((item, index) => (
                    <Pressable style={{ borderBottomWidth: index + 1 == option.length ? 0 : 1, marginVertical: 8, paddingBottom: 8, borderColor: Colors.textColors }}
                        onPress={() => debounce(() => {
                            pickerOption(item.id);
                            onBackPress()
                        })}>
                        <Text size="H6" margin={{ Horizontal: Sizes.Base }} font="Medium" >{item.value}</Text>
                    </Pressable>
                ))}
            </Block>
        </Modal>
    )
}

export default memo(FileUpload);