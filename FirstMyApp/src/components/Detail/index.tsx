import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { Block } from '../Layout'
import { RefreshControl, ScrollView } from 'react-native'
import { Text } from '../Text'
import { Icon } from '../Icon'
// import { Map } from '../MapView'
// import { Marker } from 'react-native-maps'
import { Colors, Icons, Images, Metrics } from '../../config'
import { Image } from '../Image'
import { ItemRow } from '../ItemRow'
import { ItemColoumn } from '../ItemColumn'
import moment from 'moment'
import { useAuth } from '../useAuth'

const Detail = (item:any) => {
  const map = useRef();
  const user=useAuth()
  useEffect(()=>{},[item?.item?.type])
  console.log('item?.location.coordinates[0]',item?.item?._id)
  return (
    <Block style={{  }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, marginHorizontal: Metrics.iPadHeightRatio(16), }}>
        <Text size="H3" font="Medium" onPress={() => { }} margin={{ Top: Metrics.iPadHeightRatio(12) }}>
          {item?.item?.title}
          {/* Dapibus ultrices sit */}
        </Text>
        <Text color="lightTextColor" margin={{ Top: 10, Bottom: 2 }} size="H6">
          Project ID. <Text color="textNumber">
            {/* {'project.claim_num'} */} 
            {item?.item?.short_id}
          </Text>
        </Text>
        <Text
          style={{  }}
          lineHeight={18}
          numberOfLines={2}
          padding={{ Horizontal: 0 }}
          color='lightTextColor'
          size="H6">
              Created By: {user.user._id == item?.item?.user?._id ? item?.item?.user?.name+' (me)' :item?.item?.user?.name}
      </Text>
        <Block style={{ width: '100%', aspectRatio: 340 / 178 }}>
          <Image source={Images.icMapImage} resizeMode='stretch' style={{ width: '100%', marginTop: 12, height:'87%'}} />
          {/* <Map
            // pointerEvents="none"
            ref={map}
            type="card"
            customMapStyle={[]}
            region={{
              latitude: item?.item?.location?.coordinates?.[1],
              longitude: item?.item?.location?.coordinates?.[0],
              latitudeDelta: 0.0422,
              longitudeDelta:0.0421
            }}>
            <Marker
            image={Icons.icLocation}
              coordinate={{
                latitude: item?.item?.location?.coordinates?.[1],
                longitude:item?.item?.location?.coordinates?.[0],
              }}
            />
          </Map> */}
        </Block>
        <ItemRow
          row
          title={item?.item?.address}
          icon={"icLocationPin"}
          style={{ marginVertical: 14, marginTop: 12 }} />
        <Block margin={{ Vertical: 0 }} row>
          <ItemRow row title={moment(item?.item?.start_at).format('DD MMMM, YY')} icon="icCalender" style={{flex: 1, marginVertical: 14, marginTop: 12 }} />
          {/* <ItemRow row title={moment(item?.item?.start_at).format('hh:mm A')} icon="icClock" style={{ marginVertical: 14, marginTop: 12,flex: 1,}} /> */}
        </Block>
        <Block margin={{ Vertical: 18 }} row>
          <ItemColoumn title={'Status'} value={item?.item?.project_status} valueTextColor={'musterdYellow'} style={{flex: 1,}}/>
          <ItemColoumn title={'Type'} value={item?.item?.type} style={{flex: 1,}}/>
        </Block>
        <ItemColoumn title={'Completion Date :'} value={moment(item?.item?.completion_at).format('DD MMM, yy')} />
        <Text
          style={{ paddingTop: 5 }}
          margin={{ Horizontal: 4, Top: 30 }}
          font='Medium'
          size="H5">
          {'Assigned Members'}
        </Text>
       {item?.item?.members.map((item:any)=>(
        <Block row margin={{ Top: 18 }}>
          <Image source={{uri:item?.image_url}} height={40} width={40} borderRadius={20}/>
          <Text
            font='Regular'
            margin={{ Horizontal: 14 }}
            style={{ paddingTop: 10 }}
            size="H6">
              {user.user._id == item?._id ? item?.name+' (me)' : item?.name}
          </Text>
        </Block>
       ))}
        {/* <Block row margin={{ Horizontal: 0 }}>
          <Image source={Images.assigneMember2} />
          <Text
            font='Regular'
            margin={{ Horizontal: 14 }}
            style={{ paddingTop: 10 }}
            size="H6">
            Alex Stewart
          </Text>
        </Block> */}
      </ScrollView>
    </Block>
  )
}

export default Detail
