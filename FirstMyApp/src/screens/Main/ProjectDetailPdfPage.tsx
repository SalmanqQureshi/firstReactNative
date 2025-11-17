import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Block, Button, Text } from '../../components'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { ComPDFKit, CPDFReaderView, CPDFToolbarMenuAction } from '@compdfkit_pdf_sdk/react_native'
import { MainStackProps } from '.'
import { ActivityIndicator, Platform } from 'react-native'
import { Colors, Metrics } from '../../config'
import { request } from '../../components/ApiService'

 interface  CPDFProps{
  filePath: string;
  fileTitle?: string;
  parentId: string,
  projectId: string,
  canUndoState: boolean,
  setCanUndoState: (canUndo: boolean) => void;
  isLoading: boolean,
  setLoading: (canUndo: boolean) => void;
  navigation:any
  showChromeTabsMode?: boolean
  setShowChromeTabsMode?:any
};

export const CPDFReader = forwardRef(({ filePath, fileTitle,parentId,projectId,canUndoState,setCanUndoState, navigation,setLoading,isLoading,showChromeTabsMode,setShowChromeTabsMode}:CPDFProps, ref) => {
  const [initKeyStat, setInitKeyState] = useState(true)
  const [documentReady,setDocumentReady] = useState(false)
  // const [isLoading, setLoading] = useState(true)
  const [path, setPath] = useState(null)
  const pdfReaderRef = useRef<CPDFReaderView>(null);
 useImperativeHandle(ref, () => ({
    // Add methods to be exposed to parent component if needed
    isShowButton: async() => {
      const check= await pdfReaderRef.current?.hasChange()
      console.log('check===>',check)
      return check
    },
    saveDocument: async() => {
      const check= await pdfReaderRef.current?.save()
      console.log('check===>',check)
      return check
    }
  }));
  const initilize = async () => {
    const result = await ComPDFKit.initialize('NjhjYTZmNThlMDA1OQ==','NjhjYTZmNThlMDA1OQ==')//Metrics.androidPlatform?  'assets://custom/license_key.xml':'license_pdf.xml')
    console.log('result==============>', result)
    // setInitKeyState(false)
    }

  useEffect(() => {
    initilize()
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt:"pdf",
      // path: dirs.DownloadDir + `/${fileTitle}`
      })
    .fetch('GET',filePath)
    .then((res) => {
        // let status = res.info().status;
        console.log("File path changed to: ",res?.data);
        setInitKeyState(false)
        setPath(res.data)
        // setLoading(false)
    })
    .catch((errorMessage, statusCode) => {
        console.log('error===>',{errorMessage,statusCode});
    })
  }, [filePath]);
  
    // if(isLoading){
    //   return (<ActivityIndicator size={"large"} style={{flex:1}} />)
    // }
    if(!!initKeyStat) {
      return (
      <ActivityIndicator 
        size={'large'} 
        style={{flex:1,alignSelf:'center'}}
        color={Colors.primary} /> )
    }

  const UploadSaveAsFile = ({nativeEvent}:any)=>{
      console.log('nativeEvent.uri,',nativeEvent)
      if (!canUndoState) {
        setCanUndoState(nativeEvent.onAnnotationHistoryChanged?.canUndo)
      }
    // if (!canUndoState && Metrics.androidPlatform && (!!nativeEvent.saveDocument || nativeEvent.uri) ) {
    //   alert('No changes have been made to the document!')
    //   return
    // }
    // if (nativeEvent?.isLoaded) {
    //   setDocumentReady(true);  // Mark the document as ready when it's fully loaded
    // }

    if((!!nativeEvent.saveDocument || nativeEvent.uri) && canUndoState ){
      setLoading(true)
      console.log(showChromeTabsMode,'showChromeTabsMode=================>');
      
      return request(`directories`, 'post')
              .withFormData(
                {project_id : projectId,
                  parent_id: parentId,
                  base_title: fileTitle,
                  file:{
                  type:'application/pdf',
                  name: 'saveas.pdf',
                  uri:`file://${path}`
                }}
              )
              .withModule()
              .onSuccess(response => {
                if(showChromeTabsMode){
                  setLoading(false)
                  setShowChromeTabsMode(false)
                  setCanUndoState(false)
                }
                else{
                  setLoading(false)
                  navigation.goBack()
                }
                })
              .onFailure(err => {
                  console.log(err),
                      console.log('erreor====================>', { err })
              })
              .call()
            }
    }
    return (
    isLoading ? <ActivityIndicator size={'large'} style={{flex:1,alignSelf:'center'}} color={Colors.primary}/> :
      <CPDFReaderView
      onChange={UploadSaveAsFile}
      onLoadDocument={(l)=>{}}
    //   password={'1234'}
      ref={pdfReaderRef}
      key={filePath}
      document={"file://"+path}
      configuration={ComPDFKit.getDefaultConfig({
        toolbarConfig:{
          availableMenus: ['viewSettings','documentEditor','documentEditor','watermark','security','flattened','share','openDocument','snip']
        }
      })}
      
      style={{ flex: 1, height: 20 }}
    />
    );
  });
export const ProjectDetailPdfPage = (props:MainStackProps<'ProjectDetailPdfPage'>) => {
  const refCPDF= useRef<any>(null)
  const [canUndoState, setCanUndoState]=useState(false)
  const [isLoading, setLoading]=useState(false)

    console.log('props.route.params?.file_path=====>',props.route.params)
    useEffect(()=>{ 
        props.navigation.setOptions({
        headerTitle:()=><Text size="H4" font="SemiBold" numberOfLines={1} style={{width:180}}>{props.route.params?.ScreenTitleName}</Text>,
        headerRight: () => (
                  ((!!canUndoState)  &&
                  <Button
                    label='Save As'
                    style={{ width: 80, marginRight:  Metrics.iPadHeightRatio(12), maxHeight: 38, minHeight: 38 }}
                    onPress={() =>{refCPDF.current?.saveDocument()}}
                    loading={isLoading}
                  />
                )
                ),
        headerStyle:{
          height: !Metrics.iOSPlatform? Metrics.iPadHeightRatio(70):(Platform.OS=='ios' && Platform.isPad) ? Metrics.iPadHeightRatio(45): Metrics.iPadHeightRatio(100)
        }
    })
    },[canUndoState])
    return (
        <Block flex>
            <CPDFReader 
            filePath={props.route.params?.file_path} 
            fileTitle={props.route.params?.ScreenTitleName}
            projectId={props.route.params?.project_id}
            parentId={props.route.params?.parent_id}
            canUndoState={canUndoState}
            setCanUndoState={setCanUndoState}
            ref={ref=>{refCPDF.current=ref}}
            navigation={props.navigation}
            isLoading={isLoading}
            setLoading={setLoading}
             />
        </Block>
    )}
