import React, { useCallback, useEffect, useState } from 'react'
import { Block, Button, FlatList, FolderPicker, Form, Image, PdfListningCard, ProjectFolderItems, Text, TextInput, useAuth } from '../../components'
import { Alert, Dimensions, Platform, StyleSheet } from 'react-native';
import { Colors, Icons, Images, Metrics, Sizes } from '../../config';
import { useNavigation } from '@react-navigation/native';
import { usePagination } from '../../components/usePagination';
import { request } from '../../components/ApiService';
import { MainStackProps } from '.';
import { Modal } from '../../components/Form/Components/Modal';
import { _checkCurrentUserProject } from '../../Utility';

interface ImageSliderProps {
    isVisible: boolean,
    ImagesData: [],
    onBackPress: () => {}
    project_id: 0,
    parent_id: 0
}
const ImageSlider = ({ isVisible = false, onBackPress, project_id, parent_id }: ImageSliderProps) => {
    const width = Dimensions.get('window').width;
    return (
        <Modal type='Center' Visible={isVisible} onBackPress={() => { }}>
            <Form onSubmit={async (data) => {
                return request(`directories`, 'post')
                    .withFormData({
                        title: data.title,
                        project_id: project_id,
                        parent_id: parent_id
                    })
                    .withModule()
                    .onSuccess(response => {
                        console.log(response)
                        onBackPress()
                    })
                    .onFailure(err => {
                        console.log(err),
                            console.log('erreor====================>', { err })
                    })
                    .call()
            }}>
                {({ register, loading, submit }) => (
                    <Block backgroundColor={Colors.background}
                        style={{ borderRadius: 12, 
                            margin:Platform.OS == 'ios' && Platform.isPad? 
                            Metrics.iPadHeightRatio(90): 
                            Metrics.iPadHeightRatio(170) , alignSelf: 'center' }}
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
                                Create Sub Folder
                            </Text>
                            <TextInput
                                label="Sub Folder name"
                                type="Text"
                                returnKeyType='done'
                                maxLength={30}
                                {...register({ id: "title" })}
                                value={''}
                            />
                            <Button label="Create Sub Folder" onPress={submit} type='Solid' style={{ marginTop: 13 }} />
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
export const ProjectDetailFolder = (props: MainStackProps<any>) => {
    console.log('props.route.params?.id', props.route.params)
    const {screenTitle,itemParentID,itemProjectID,currentUser} = props.route.params
    const [folderState, setFolderState] = useState(false);
    const useAuthData = useAuth()
    const { navigate } = useNavigation()
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: () => <Text size="H4" font="SemiBold" numberOfLines={1}>{screenTitle}</Text>,
        })
    }, [])
    const [subFoldersListning, setSubFoldersListning] = usePagination({
        request: request(`directories/?project_id=${itemProjectID}&parent_id=${itemParentID}`, 'get')
    })
    const deleteFolder = useCallback((id: string) => {
          return request(`directories/${id}`, 'DELETE')
            .onSuccess(() => {
              setSubFoldersListning.call();
            })
            .call();
        }, []);
    return (
        <Block flex gradient={[Colors.background, Colors.textBackground]}>
            <FlatList
                style={{ paddingTop: 15 }}
                {...subFoldersListning}
                onEndReached={subFoldersListning.onEndReached}
                keyExtractor={(item, index) => item.key + '' + index}
                showBottomLoader={subFoldersListning.isFetching && !!subFoldersListning.page}
                contentContainerStyle={{ paddingBottom: 110 }}
                renderItem={({ item, index }) => (
                            <ProjectFolderItems
                            index={index}
                            Images={Images.icFolder}
                            name={item.title}
                            userRec={item?.project?.user}
                            onPressDelete={() =>
                                Alert.alert('Delete', 'Are you sure you want to delete this Sub Folder?', [
                                { text: 'No' },
                                { text: 'Yes', onPress: () => deleteFolder(item?._id) },
                                ])
                            }
                            onPress={() => props.navigation.navigate('PdfList2', {
                                screenTitle: item.title,
                                itemProjectID: itemProjectID,
                                itemParentID: item?._id,
                                currentUser: currentUser
                            })}
                            Icons={Icons.arrowRight} />
                        )}
            />
            {_checkCurrentUserProject(currentUser,useAuthData.user) &&<Button label="Create Sub Folder" onPress={() => { setFolderState(s => !s) }} type='Solid' style={{ margin: 16 }} />}
            <FolderPicker
                isVisible={folderState}
                onBackPress={() => { setFolderState(s => !s); setSubFoldersListning.call() }}
                project_id={itemProjectID}
                parent_id={itemParentID}
            />
            <ImageSlider
                isVisible={folderState}
                onBackPress={() => { setFolderState(s => !s); setSubFoldersListning.call() }}
                project_id={itemProjectID}
                parent_id={itemParentID}
            />
        </Block>
    )
}
const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: Colors.onSecondary,
        padding: 1,
    },
    CardContainer: {
        margin: 0,
        alignItems: 'center',
        backgroundColor: Colors.onPrimary,
        padding: 18,
        borderRadius: 10
    },
});