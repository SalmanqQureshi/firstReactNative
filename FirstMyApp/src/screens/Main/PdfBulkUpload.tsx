import React, { useEffect, useState } from 'react'
import { Block, Button, FlatList, Form, Image, Text } from '../../components'
import { pick, types } from 'react-native-document-picker';
import { showMessage } from 'react-native-flash-message';
import { request } from '../../components/ApiService';
import { Colors, Icons, Images, Metrics, Sizes } from '../../config';
import { Dimensions, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import _ from 'lodash';
import { MainStackProps } from '.';

export const PdfBulkUpload = (props: MainStackProps<any>) => {
    const [sheetFileState, setSheetFileState] = useState([]);
    console.log(props.route.params,'props.route.params');
    const [uploadLoading, setUploadLoading] = useState(false);
    const filePicker = async () => {
        try {
            const res = await pick({
                allowMultiSelection: true,
                type: [types.pdf],
            });
            console.log(res,'res');
            
            //   if (res.length > 10) {
            //       showMessage({ message: 'You can only select upto 10 PDF files.', type:'danger',icon:'danger' });
            //       return;
            //   }

            const allValid = res.every(file => file?.type === 'application/pdf');
            console.log(allValid,'allValid');
            
            if (!allValid) {
                showMessage({ message: 'Only PDF files are allowed.' });
                return;
            }
            else{
                setSheetFileState(s => { return [...s, ...res] });
            }
        } catch (err) {
            console.error('File selection error:', err);
        }
        console.log('SHEET ', sheetFileState)
    };

  const onSubmit = (data) => {
    console.log('sheetFileState', sheetFileState);
    if (sheetFileState.length === 0) {
        showMessage({
            message: 'Please select a file before uploading',
            type: 'danger',
            icon: 'danger'
        });
        return;
    }
    
    if (sheetFileState.length > 2000) {
        showMessage({
            message: 'Please upload upto 2000 (PDFs) files',
            type: 'danger',
            icon: 'danger'
        });
        return;
    }
    console.log(sheetFileState,'sheetFileState');
    
    let formData = new FormData();
    sheetFileState.forEach(item => formData.append('files', {
        fileCopyUri: item?.fileCopyUri,
        name:item?.name.replace(/\(/g, '{').replace(/\)/g, '}'), 
        type: item?.type,
        uri: item?.uri,
        size: item?.size,
    }));
    formData.append('project_id', props.route.params?.projectId);
    formData.append('parent_id', props.route.params?.parentId);
    console.log(formData,'formData');
    // [{"fileCopyUri": null, "name": "A.pdf", "size": 469513, "type": "application/pdf", "uri": "content://com.android.providers.downloads.documents/document/raw%3A%2Fstorage%2Femulated%2F0%2FDownload%2FPdfs%2FA.pdf"}] 
//    [{"fileCopyUri": null, "name": "file-example_PDF_500_kB (1) (1) (1) (1) (1) (1) (1) (1) (2).pdf", "size": 469513, "type": "application/pdf", "uri": "content://com.android.providers.downloads.documents/document/raw%3A%2Fstorage%2Femulated%2F0%2FDownload%2FPdfs%2Ffile-example_PDF_500_kB%20(1)%20(1)%20(1)%20(1)%20(1)%20(1)%20(1)%20(1)%20(2).pdf"}]
    setUploadLoading(true);
    request(`directories/bulk-create`, 'post')
        .withBody(formData)
        .withModule()
        .onSuccess(response => {
            console.log(response,'response');
            setSheetFileState([]);
            props.navigation.goBack();
            setUploadLoading(false);
        })
        .onFailure(err => {
            console.log('error in bulk upload:', err.response.data);
            setUploadLoading(false);
        })
        .call();
}

    const width = Dimensions.get('window').width;

    const onRemove = (indexToRemove: number) => {
        setSheetFileState((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    return (
        <Block gradient={[Colors.background, Colors.textBackground]} flex={1} >
        <ScrollView>
        <Form onSubmit={onSubmit}>
            {({ register, loading, submit }) => (
                // <Block backgroundColor={Colors.error}
                //     style={{
                //         // borderRadius: 12,
                //         // margin: Platform.OS == 'ios' && Platform.isPad ?
                //         //     Metrics.iPadHeightRatio(90) :
                //         //     Metrics.iPadHeightRatio(170), alignSelf: 'center'
                //     }}
                //     width={width - 30}
                //     padding={{ Top: Metrics.iPadHeightRatio(36) }}
                //     height={Platform.OS == 'ios' && Platform.isPad ? width - 180 : '50%'}>
                <>
                    <Block margin={{ Horizontal: 12, Vertical: 12 }} gap={12} >
                        <Block margin={{ Left: 0 }} row style={{}}>
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
                                    }}
                                />
                                <Text size='H5'
                                    font="Regular"
                                    align='center'
                                    margin={{ Top: 12 }}
                                    color='onSurfaceVariant'>
                                    Upload PDF
                                </Text>
                            </TouchableOpacity>
                        </Block>

                        {/* <ScrollVie keyboardShouldPersistTaps="handled"
            horizontal
                showsVerticalScrollIndicator={false}  
                showsHorizontalScrollIndicator={false}> */}
                        <FlatList
                            data={sheetFileState}
                            numColumns={3}
                            style={{ marginBottom: 20, }}
                            contentContainerStyle={{ paddingBottom: 20, }}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View  >
                                    <TouchableOpacity
                                        style={{ padding: Metrics.ISPad && 10, }}
                                        onPress={() => onRemove(index)}>
                                        <View style={{}}>
                                            <Image
                                                resizeMode="contain"
                                                style={[{}]}
                                                source={Icons.icClose}
                                                height={18}
                                                width={18}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <Block style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        // flexWrap:'wrap',flexShrink:10,flexDirection:'row',flexGrow:2,
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
                                                // flex: 1,
                                                alignSelf: 'center',
                                                // marginHorizontal: Metrics.iPadHeightRatio(5),
                                            }} />
                                    </Block>
                                    <Text size='H5'
                                        font="Regular"
                                        align='center'
                                        margin={{ Top: 0, Left: 12 }}
                                        style={{ width: Metrics.ISPad ? 200 : 100 }}
                                        color='onSurfaceVariant'>
                                        {Metrics.ISPad ? _.take(item?.name, 20).join('') : _.take(item?.name, 12).join('')}
                                    </Text>
                                </View>)}
                        />

                    </Block>
                    {/* <Button label="Upload PDF" onPress={submit} type='Solid' style={{ flex:1 ,justifyContent:'flex-end',alignSelf:'flex-end'}} /> */}
               
                </>
                //</Block>
            )}</Form>
            </ScrollView>
              {
                    sheetFileState.length > 0 &&
                    <Block row space='between' margin={{ Horizontal: 12, Vertical: 22, }} gap={10} >
                        <Button label="Upload PDF" loading={uploadLoading} disabled={uploadLoading} onPress={onSubmit} type='Solid' />
                   
                    
                    </Block>
                 }
        </Block>
    )
}
