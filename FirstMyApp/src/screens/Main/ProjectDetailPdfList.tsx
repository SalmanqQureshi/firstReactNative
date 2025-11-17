import React, { useCallback, useEffect, useState } from 'react'
import { Block, Button, FlatList, Form, Icon, Image, Text, useAuth } from '../../components'
import { PdfListningCard } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { Colors, Icons, Images, Metrics, Sizes } from '../../config'
import { Alert, Dimensions, Platform, StyleSheet, TouchableOpacity, FlatList as FlatListBase, ScrollView, View } from 'react-native'
import { usePagination } from '../../components/usePagination'
import { request } from '../../components/ApiService'
import { MainStackProps } from '.'
import DocumentPicker, { pick, types, } from 'react-native-document-picker'
import { Modal } from '../../components/Form/Components/Modal'
import { showMessage } from 'react-native-flash-message'
import _ from 'lodash';
import ReactNativeModal from 'react-native-modal'
import { _checkCurrentUser, _checkCurrentUserProject } from '../../Utility'


const ImageSlider = ({ isVisible = false, onBackPress, project_id, parent_id }: any) => {

    const [sheetFileState, setSheetFileState] = useState([]);

    const filePicker = async () => {
        try {
            const res = await pick({
                allowMultiSelection: true,
                type: [types.pdf],
            });

            if (res.length > 10) {
                showMessage({ message: 'You can only select upto 10 PDF files.', type:'danger',icon:'danger' });
                return;
            }

            const allValid = res.every(file => file?.type === 'application/pdf');
            if (!allValid) {
                showMessage({ message: 'Only PDF files are allowed.' });
                return;
            }
            setSheetFileState(s=>{return[...s, ...res]});
        } catch (err) {
            console.error('File selection error:', err);
        }
        console.log('SHEET ' ,sheetFileState)
    };

    const onSubmit = (data) => {
        console.log('sheetFileState', sheetFileState)
        if (sheetFileState.length > 0) {
            let formData = new FormData();
            sheetFileState.forEach((item, index) => {

                formData.append(`files`, item);
            });
            if(sheetFileState.length <= 10){
                formData.append('project_id', project_id);
                formData.append('parent_id', parent_id);
                console.log(formData)
                return request(`directories/bulk-create`, 'post')
                    .withBody(formData)
                    .withModule()
                    .onSuccess(response => {
                        console.log(response)
                        onBackPress()
                        setSheetFileState([])
                    })
                    .onFailure(err => {
                        console.log(err),
                            console.log('erreor====================>', { err })
                    })
                    .call()
            }else {
            showMessage({
                message: 'Please upload upto 10 (PDFs) files',
                type: 'danger',
                icon: 'danger'
            })
        }
        } else {
            showMessage({
                message: 'Please select a file before uploading',
                type: 'danger',
                icon: 'danger'
            })
        }
    }
    const width = Dimensions.get('window').width;

    const onRemove = (indexToRemove: number) => {
        setSheetFileState((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    return (
        <ReactNativeModal  isVisible={isVisible} >
            <Form onSubmit={onSubmit}>
                {({ register, loading, submit }) => (
                    <Block backgroundColor={Colors.background}
                        style={{
                            borderRadius: 12,
                            margin: Platform.OS == 'ios' && Platform.isPad ?
                                Metrics.iPadHeightRatio(90) :
                                Metrics.iPadHeightRatio(170), alignSelf: 'center'
                        }}
                        width={width - 30}
                        padding={{ Top: Metrics.iPadHeightRatio(36) }}
                        height={Platform.OS == 'ios' && Platform.isPad ? width - 180 : '50%'}>
                        <Block margin={{ Horizontal: 12 }}>
                            <Block margin={{ Left: 12 }} row>
                                <TouchableOpacity onPress={(filePicker)} style={{
                                    height: Metrics.iPadHeightRatio(100),//'36%',
                                    width: Metrics.iPadHeightRatio(100),//'40%',
                                    alignSelf: 'center',
                                    // backgroundColor:'red',
                                }}>
                                    <Image source={Images.icUploadBulk}
                                        style={{
                                            height: Metrics.iPadHeightRatio(40),//'30%',
                                            width: Metrics.iPadHeightRatio(92),//'70%',
                                            borderRadius: Sizes.Base - 8,
                                            flex: 1,
                                            alignSelf: 'center',
                                        }} />
                                </TouchableOpacity>

                                <ScrollView keyboardShouldPersistTaps="handled"
                                horizontal
                                    showsVerticalScrollIndicator={false}  
                                    showsHorizontalScrollIndicator={false}>
                                    {sheetFileState?.map((item, index) => {
                                        return (
                                        
                                            <View style={{flex:1}}>
                                                <TouchableOpacity
                                                style={{...styles.crossImageItem,padding:Metrics.ISPad && 10}} 
                                                    onPress={() => onRemove(index)}>
                                                <View style={{}}>
                                                    <Image
                                                        resizeMode="contain"
                                                        style={[ {}]}
                                                        source={Icons.icClose}
                                                        height={18}
                                                        width={18}
                                                        />
                                                        </View>
                                                </TouchableOpacity>
                                                <Block style={{
                                                    height: Metrics.iPadHeightRatio(80),//'36%',
                                                    width: Metrics.iPadHeightRatio(80),//'40%',
                                                    // alignSelf: 'center',
                                                    // backgroundColor:'red',
                                                }}>
                                                    <Image source={Images.icPdfFile}
                                                        style={{
                                                            height: Metrics.iPadHeightRatio(80),//'30%',
                                                            width: Metrics.iPadHeightRatio(76),//'70%',
                                                            borderRadius: Sizes.Base - 8,
                                                            flex: 1,
                                                            alignSelf: 'center',
                                                            // marginHorizontal: Metrics.iPadHeightRatio(5),
                                                        }} />
                                                </Block>
                                                <Text size='H5'
                                                    font="Regular"
                                                    align='center'
                                                    margin={{ Top: 0,Left:12}}
                                                    style={{width:Metrics.ISPad ?200:100}}
                                                    color='onSurfaceVariant'>
                                                    {Metrics.ISPad ? _.take(item?.name, 20).join('') : _.take(item?.name, 12).join('')}
                                                </Text>
                                            </View>
                                        )
                                    })}
                                </ScrollView>


                            </Block>
                            <Button label="Upload PDF" onPress={submit} type='Solid' style={{ marginTop: 24 }} />
                            <Text
                                onPress={() => {
                                    setSheetFileState([])
                                    onBackPress()
                                }}
                                size='H5'
                                font="Regular"
                                align='center'
                                color='onSurfaceVariant'
                                margin={{ Vertical: 18 }}>
                                Cancel
                            </Text>
                        </Block>
                    </Block>
                )}</Form>
        </ReactNativeModal>
    );
}
export const ProjectDetailPdfList = (props: MainStackProps<any>) => {
    const useAuthData = useAuth()
    const { screenTitle, itemParentID, itemProjectID, currentUser } = props.route.params
    const [subFoldersListning, SetPdfListning] = usePagination({
        request: request(`directories/?project_id=${itemProjectID}&parent_id=${itemParentID}`, 'get')
    })
    // console.log('screenTitle' , screenTitle)
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: () => <Text size="H4" font="SemiBold" numberOfLines={1} padding={{ Right: 12 }}>{screenTitle}</Text>,
            headerRight: () => {
                return _checkCurrentUserProject(currentUser,useAuthData.user) ?<Button label="Upload PDF"
                        onPress={() => { setFolderState(s => !s) }} 
                        type='Solid'
                        styleText={{ size: 'H6' }}
                        style={{ width: 100, marginRight: Metrics.iPadHeightRatio(12), maxHeight: 38, minHeight: 38 }} />:null}
        })
    }, [subFoldersListning])

    // console.log('props.route.params.ScreenTitleName', props?.route?.params)
    const { navigate } = useNavigation()
    const [folderState, setFolderState] = useState(false);
    const deleteFolder = useCallback((id: string) => {
        return request(`directories/${id}`, 'DELETE')
            .onSuccess(() => {
                SetPdfListning.call();
            })
            .call();
    }, []);
    return (
        <Block flex gradient={[Colors.background, Colors.textBackground]}>
            <FlatList
                contentContainerStyle={{ paddingBottom: 24, marginTop: Metrics.iPadHeightRatio(6) }}
                {...subFoldersListning}
                showBottomLoader={subFoldersListning.isFetching && !!subFoldersListning.page}
                onEndReached={subFoldersListning.onEndReached}
                keyExtractor={(item, index) => item.key + '' + index}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    console.log('item-=-=-=->',item)
                    return (
                        <PdfListningCard
                            key={item?._id + '-' + index}
                            userRec={item?.project?.user}
                            onPress={() => navigate('ProjectDetailPdfPage', {
                                ScreenTitleName: item.title,
                                file_path: item?.file,
                                project_id:itemProjectID,
                                parent_id: itemParentID,
                            })}
                            onPressDelete={() =>
                                Alert.alert('Delete', 'Are you sure you want to delete this Pdf file?', [
                                    { text: 'No' },
                                    { text: 'Yes', onPress: () => deleteFolder(item?._id) },
                                ])
                            }
                            item={item}
                        />)
                }} />
            {subFoldersListning.data.length > 0 && ((
                <Button
                    label='View Multiple PDF'
                    style={{ margin:16}} 
                    onPress={() => {
                        props.navigation.navigate('MultiplePdfViewer', {
                            itemParentID: itemParentID,
                            itemProjectID: itemProjectID,
                        })
                    }}
                />
            ))}
            <ImageSlider
                isVisible={folderState}
                // ref={pdfRef}
                onBackPress={() => { setFolderState(s => !s); SetPdfListning.call() }}
                project_id={itemProjectID}
                parent_id={itemParentID}
            />
        </Block>
    )
}
const styles = StyleSheet.create({
    crossImageItem: {
        // right:0,
        top: Platform.OS == 'ios' && Platform.isPad ? Metrics.iPadHeightRatio(10) : 10,
        // marginTop:40,
        left: Platform.OS == 'ios' && Platform.isPad ? Metrics.iPadHeightRatio(8) : 7,
    },
})