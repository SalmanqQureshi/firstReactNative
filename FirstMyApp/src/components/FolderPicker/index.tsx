import React from 'react'
import { Dimensions, Platform } from 'react-native';
import { Modal } from '../Form/Components/Modal';
import { Form, TextInput } from '../Form';
import { request } from '../ApiService';
import { Block } from '../Layout';
import { Colors, Images, Metrics, Sizes } from '../../config';
import { Image } from '../Image';
import { Text } from '../Text';
import { Button } from '../Button';

interface FolderPickerProps {
    isVisible: boolean,
    ImagesData: [],
    onBackPress: () => {}
    project_id: 0
    parent_id: 0
}
const onSubmit=(data:any,project_id:number,parent_id:number,onBackPress:()=>null)=>{
    let parent={
          title: data.title,
          project_id: project_id,
        }
    if(!!parent_id){
        parent.parent_id = parent_id
    }
    return request(`directories`,'post')
    .withFormData(parent)
    .withModule()
    .onSuccess(response => {
        console.log(response)
        onBackPress()
    })
    .onFailure(err => {
        console.log(err),
        console.log('erreor====================>', {err})
    })
    .call()
}

const FolderPicker = ({ isVisible = false, onBackPress, project_id, parent_id }: FolderPickerProps) => {
  const width = Dimensions.get('window').width;
  return (
    <Modal type='Center' Visible={isVisible} onBackPress={() => { }}>
      <Form onSubmit={(data)=>onSubmit(data,project_id,parent_id,onBackPress)}>
        {({ register, loading, submit }) => (
          <Block backgroundColor={Colors.background}
            style={{ borderRadius: 12,
               margin:Platform.OS == 'ios' && Platform.isPad? 
               Metrics.iPadHeightRatio(90): 
               Metrics.iPadHeightRatio(170), 
               alignSelf: 'center' }}
            width={width - 30}
            padding={{ Top: Metrics.iPadHeightRatio(36) }}
            height={Platform.OS == 'ios' && Platform.isPad ? width-180 : Metrics.iPadHeightRatio(300)}>
            <Image source={Images.icFolder}
              style={{
                height:  Metrics.iPadHeightRatio(40),
                width:  Metrics.iPadHeightRatio(40),
                borderRadius: Sizes.Base - 8,
                alignSelf: 'center'
              }} />
            <Block margin={{ Horizontal: 12 }}>
              <Text
                size='H5'
                font="Medium"
                align='center'
                margin={{ Top: 18 }}>
                {parent_id ? 'Create Sub Folder' : 'Create New Folder'}
              </Text>
              <TextInput
                label={parent_id ? "Sub Folder name" : "Folder name"}
                type="Text"
                returnKeyType='done'
                maxLength={30}
                {...register({ id: "title"})}
                value={''}
                style={{}}
              />
              <Button label={parent_id? 'Create Sub Folder' :"Create Folder"} onPress={submit} type='Solid' style={{ marginTop: 13 }} />
              <Text
                onPress={() => { onBackPress() }}
                size='H5'
                font="Regular"
                align='center'
                color='onSurfaceVariant'
                margin={{ Vertical: 9 }}>
                Cancel
              </Text>
            </Block>
          </Block>
        )}</Form>
    </Modal>
  );
}

export {FolderPicker}
