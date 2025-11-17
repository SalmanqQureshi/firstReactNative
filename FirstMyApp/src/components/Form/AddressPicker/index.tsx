import { Pressable, SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import ReactNativeModal from 'react-native-modal';
// import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useForm } from '../useForm';
import { Colors, Server, Sizes } from '../../../config';
import { Block ,Button,TextInput} from '../..';



interface AddressPickerProps {
  label: string;
  initialAddress?: {};
  style?: ViewStyle,
  formStyle?: ViewStyle;
  inputStyle?: ViewStyle,
}
interface GoogleLatLngType {
  lat: number;
  lng: number;
}

export const AddressPicker = forwardRef((props: AddressPickerProps, upRef) => {
  const [ModalVisible, setModalVisible] = useState(false);
  const googlePlaceRef = useRef();
  const { State, setState, downRef } = useForm<null | {
    address: string;
    coords: GoogleLatLngType;
    viewport: {
      northeast: GoogleLatLngType;
      southwest: GoogleLatLngType;
    };
    addressComponent: {
      long_name: string,
      short_name: string,
      types: string[]
    }[]
    placeId?: string;
  }>({
    upRef,
    validate(current, form) {
      console.log('current ', current)
      return [!current && props.label + ' is required'].filter(s => !!s);
    },
    focus() {
      setModalVisible(true)
    },
    initialValue: !!props?.initialAddress?.address ? ({
      address: props?.initialAddress?.address, coords: {
        lat: Number(props?.initialAddress?.latitude),
        lng: Number(props?.initialAddress?.longitude)
      },
      viewport: {
        northeast: { lat: Number(props?.initialAddress?.latitude), lng: Number(props?.initialAddress?.longitude) },
        southwest: { lat: Number(props?.initialAddress?.latitude), lng: Number(props?.initialAddress?.longitude) },
      }
    }) : null,
    otherRefs: {
      googlePlaceRef: googlePlaceRef.current
    }
  });

  useEffect(() => {
    setTimeout(() => {
      googlePlaceRef.current?.setAddressText?.(State.value?.address)
    }, 500)
  }, [State.value?.address])



  return (
    <>
      <Pressable onPress={() => setModalVisible(true)} style={props.style}>
        <View pointerEvents="none" >
          <TextInput
            editable={false}
            ref={downRef}
            label={props.label}
            key={'State' + (!!State.value ? State.value.address : '')}
            value={!!State.value ? State.value.address : props?.value?.address}
            type="Text"
            rightIcon="icLocationPin"
            isError={State.isError}
            ErrorText={State.ErrorText}
          // formStyle={props?.formStyle}
          // containerStyle={props.inputStyle}
          />
        </View>
      </Pressable>
      <ReactNativeModal
        keyboardShouldPersistTaps="always"
        onBackdropPress={() => setModalVisible(false)}
        isVisible={ModalVisible}
        avoidKeyboard={false}
        style={{ padding: Sizes.Base, margin: 0 }}>
        <Block
          height={400}
          style={{ borderRadius: 24, overflow: 'hidden' }}
          backgroundColor={Colors.background}
          width={Sizes.screen.width - Sizes.Base * 2}>
          {/* <MapView
            style={StyleSheet.absoluteFillObject}
            region={
              !!State.value
                ? {
                  latitude: State?.value?.coords?.lat,
                  longitude: State?.value?.coords?.lng,
                  latitudeDelta: (
                    parseFloat(State.value?.viewport?.northeast?.lat) -
                    parseFloat(State.value?.viewport?.southwest?.lat)) || 0.1,
                  longitudeDelta:
                    ((parseFloat(State.value?.viewport?.northeast?.lng) -
                      parseFloat(State.value?.viewport?.southwest?.lng)) *
                      (Sizes.screen.width / Sizes.screen.height)) || 0.1,
                }
                : undefined
            }
          /> */}
          <Block
            flex
            space="between"
            padding={{ Horizontal: Sizes.Base, Vertical: Sizes.Base, }}>
            <GooglePlacesAutocomplete
              styles={{
                textInput: {
                  color: '#000000'
                }
              }}
              ref={googlePlaceRef}
              key={'State' + (!!State.value ? State.value.address : '')}
              placeholder="Search"
              enableHighAccuracyLocation
              fetchDetails
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="none"
              textInputProps={{
                onFocus: (e) => {
                  setState(s => ({ ...s }))
                },
              }}
              // styles={{ listView: { zIndex: 1000 } }}
              initailAddressText={!!State.value ? State.value.address : ''}
              enablePoweredByContainer={false}
              onPress={(data, detail) => {
                console.log(detail,'data==================+>',data),
                setState(s => ({
                  value: {
                    placeId: data.id,
                    address: data.description,
                    coords: detail?.geometry.location,
                    viewport: detail?.geometry.viewport,
                    addressComponent: detail?.address_components,
                  },
                }));
              }}
              query={{
                // key: 'AIzaSyDbyJ5oalgD2b1gdRgPsvKySGL5XtED7pI',
                language: 'en',
              }}
            />
            <Block row space='between' align='center'>
              {/* <SmallButton
                label="Cancel"
                type="Danger"
                onPress={() => {
                  setModalVisible(false);
                  // setState(s => ({ ...s, value: null }));
                }}
                style={{ width: 150, height: 52 }}
              /> */}
              <Button
                label="Confirm"
                type="Solid"
                onPress={() => {
                  googlePlaceRef.current?.setAddressText?.(State.value?.address)
                  props.onPick?.(State.value)
                  setModalVisible(false);
                }}
                style={{ width: 300, height: 52 }}
              />
            </Block>
          </Block>
        </Block>
      </ReactNativeModal>
    </>
  );
});
