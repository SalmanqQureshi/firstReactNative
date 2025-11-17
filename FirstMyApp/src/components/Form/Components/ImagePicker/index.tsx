import React, { ReactNode, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import { PermissionsAndroid, Platform, Pressable } from 'react-native';
import { Modal } from '../../Components/Modal';
import { Block } from '../../../Layout';
import { Text } from '../../../Text';
import { Colors, Sizes } from '../../../../config';

interface Props {
  children: (arg: { pick: (mediaType: null | string) => any; images: any[] }) => ReactNode;
  min?: number;
  max?: number;
  single?: boolean;
  type?: string;
}

export const ImagePicker = forwardRef<any, Props>(
  ({ min = 0, max = 1, ...props }, upRef) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState([]);
    const isMediaType = props.type ?? 'photo';
    const option = [
      {
        id: 'Camera',
        value: 'Camera',
      },
      {
        id: 'Gallery',
        value: 'Gallery',
      },
    ];

    useImperativeHandle(upRef, () => ({
      getImg: () => value,
      clearImg: () => setValue([]),
    }));

    // const { State, setState } = useForm({
    //   upRef,
    //   focus() { },
    //   validate: (current, form) =>
    //     [current.length < min && (props?.single ? `${isMediaType == "video" ? 'Video' : 'Image'} is required` : `At least ${min} Image(s) required.`),
    //     current.length > max && `Can only add upto ${max} Image(s).`,
    //     ].filter(s => !!s),
    //   initialValue: [],
    // });
    // const animateOnError = useBoolAnimation(State.isError);
    const addImages = (images = [], type = 'image') => {
      // console.log('sssww223232 ', type)
      const imgs = images.map(s => ({
        uri: `${Platform.OS == 'ios' ? 'file://' : ''}${s.path}`,
        type: s.mime,
        name: type == "video" ? "Video.mp4" : "Image.jpg",
        // filename: getName(s.path)
      }));
      if (props?.single) {
        setValue(imgs)
        props?.onPick?.(imgs)
      } else {
        setValue(value.concat(imgs));
        props?.onPick?.(imgs)
      }
    };

    // useEffect(()=>{
    //   props?.onPick?.(value)
    // },[value])

    const getName = (filePath: string) => {
      const imgName = filePath.split('/')
      return imgName[imgName.length - 1]
    }

    const pick = async (mediaType: null | string) => {
      if (Platform.OS == 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ])
      }

      setModalVisible(true)
    };

    const pickerOption = async (option: string) => {
      if (Platform.OS == 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ])
      }
      if (option == 'Camera') {
        setTimeout(() => {
          ImageCropPicker.openCamera({
            mediaType: isMediaType,
            compressImageQuality: 0.4,
            cropping: false,
          }).then(s => addImages([s], isMediaType));
        }, 800)
      } else {
        setTimeout(() => {
          ImageCropPicker.openPicker({
            multiple: !props?.single,
            maxFiles: props?.single ? 1 : max,
            mediaType: isMediaType,
            compressImageQuality: 0.4,
            cropping: false,
          }).then(s => addImages(Array.isArray(s) ? s : [s], isMediaType));
        }, 800)
      }
    }


    return (
      <>
        {/* <FormComponentContainer
         animateOnError={animateOnError}
        isError={State.isError}
         ErrorText={State.ErrorText}> */}
        {props.children({ pick, images: value })}
        <Modal
          Visible={isModalVisible}
          onBackPress={() => {
            setModalVisible(false);
          }}
          type="Bottom">
          <Block margin={{All: Sizes.Base}} backgroundColor='white'>
            <Text margin={{Bottom: Sizes.Base-4, Horizontal: Sizes.Base - 8, Top:Sizes.Base - 8}} font='SemiBold' style={{ textTransform: "capitalize" }} type="H5">Add {props.type == 'video' ? 'Video' : 'Image'}:</Text>
            {option.map((item, index) => (
              <Pressable
                style={{ borderBottomWidth: index + 1 == option.length ? 0 : 1, marginVertical: 8, paddingBottom: 8, borderColor: Colors.text }}
                onPress={() => {
                  setModalVisible(false);
                  pickerOption(item.id)
                }}>
                <Text size="H6" marginHorizontal={8} font="Medium" color={value == item.id ? Colors.primary : undefined}>{item.value}</Text>
              </Pressable>
            ))}
          </Block>
        </Modal>
        {/* </FormComponentContainer> */}
      </>
    );
  },
);
