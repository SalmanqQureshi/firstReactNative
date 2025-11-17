import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import { CPDFReader } from '../Main/ProjectDetailPdfPage'; // Make sure this is correct
import { MainStackProps } from '.';
import { request } from '../../components/ApiService';
import { Block } from '../../components';
import { Metrics } from '../../config';
 
const PdfTabs = ({ pdfArray }) => {
   return (
    <Tabs.Container
      renderTabBar={props => (
        <MaterialTabBar
          {...props}
          scrollEnabled={true}
          tabStyle={{ width: 'auto', paddingHorizontal: 12 }}
          labelStyle={{ fontSize: 14, textTransform: 'none' }}
        />
      )}
    >
      {pdfArray?.map((item, index) => (
        <Tabs.Tab
          key={index}
          name={`PDF-${index + 1}`}
          label={item.title || `PDF ${index + 1}`}
        >
            <View style={{ height: Metrics.height-50,}}>
              <CPDFReader filePath={item.file} 
            setCanUndoState={()=>{}}/>
            </View>
        </Tabs.Tab>
      ))}
    </Tabs.Container>
  );
};
 
const MultiplePdfViewer = (props: MainStackProps<'MultiplePdfViewer'>) => {
    const [pdfList,setPdfList]=useState()
    const [isLoading, setLoading] = useState(true)
    useEffect(() => {
            request(`directories/?project_id=${props.route.params?.itemProjectID}&parent_id=${props.route.params?.itemParentID}`, "get")
                .withOutToast()
                .withLoader()
                .onSuccess((res) => {
                    setPdfList(res.data?.data || []);
                    setLoading(false)
                }).call();
        }, []);
        console.log('res===',pdfList)
if(isLoading){
    return (
        <ActivityIndicator size={"large"} style={{flex:1}} />
    )
}
  return <PdfTabs pdfArray={pdfList} />;
};
 
export { MultiplePdfViewer };