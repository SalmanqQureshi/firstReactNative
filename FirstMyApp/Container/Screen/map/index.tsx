import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'
import {ComPDFKit,CPDFReaderView, CPDFViewMode } from '@compdfkit_pdf_sdk/react_native'
 const initialize=async()=> {
    var result = await ComPDFKit.initWithPath("assets://license_key.xml")
    console.log("ComPDFKitRN", "init_:", result)
  }
const index = (props:any) => {
  initialize()
  var config = ComPDFKit.getDefaultConfig({
  modeConfig : {
    initialViewMode: CPDFViewMode.ANNOTATIONS
  }
})
  return (
    <View>
        <Text style={{
            textAlign:'center',
            color:'#161616',
            fontSize:24,
            fontFamily:'Cochin',
            alignSelf:'center'
        }}>Map Integraion</Text>
        <CPDFReaderView
          document={'file:///android_asset/pdf_sample.pdf'}
          configuration={ComPDFKit.getDefaultConfig({})}
          style={{ flex: 1 }}
          />
        {/* <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       region={{
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
     >
     </MapView> */}
    </View>
  )
}

index.propTypes = {}

export default index
const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
   });