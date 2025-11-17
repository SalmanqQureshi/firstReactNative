import {StyleSheet} from 'react-native';
// import MapView,{MapViewProps} from 'react-native-maps';
import CustomMap from './styles.json';
import {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Colors} from '../../config/colors';
import {Sizes} from '../../config/size';

export const Map = forwardRef<
  MapView,
  MapViewProps & {
    type?: keyof typeof styles;
  }
>((props, ref) => {
  const map = useRef<MapView>();
  const [mapType, setMapType ] = useState("standard")
  useImperativeHandle(ref, () => ({
    ...map.current,
    animateToRegion:map.current.animateToRegion,
    toggleMapType : ()=>{
      setMapType(s=>s=="hybrid"?"standard":"hybrid")
    }
  }));
  return (
    <MapView
      mapType={mapType}
      showsMyLocationButton={false}
      showsCompass={false}
      initialRegion={{
        latitude: 40.712772,
        longitude: -74.006058,
        latitudeDelta: 5.5,
        longitudeDelta: 5.5,
      }}
      edgePadding={{top: 100, left: 100, bottom: 100, right: 100}}
      maxZoomLevel={17}
      clusterColor={Colors.buttonContainer}
      spiderLineColor={Colors.buttonContainer}
      ref={map}
      userInterfaceStyle="light"
      // provider="google"
      style={[styles[props.type || 'fill'],{borderRadius:10}]}
      customMapStyle={CustomMap}
      showsUserLocation
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 343 / 165,
    borderRadius: Sizes.borderRadius,
    marginVertical: Sizes.Base,
  },
  fill: StyleSheet.absoluteFillObject,
});
