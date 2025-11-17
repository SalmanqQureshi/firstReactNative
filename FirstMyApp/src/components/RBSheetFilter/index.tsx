import React, { forwardRef, useState } from 'react'
import RBSheet from 'react-native-raw-bottom-sheet'
import { Block } from '../Layout'
import { Text } from '../Text'
import { ImageButton } from '../ImageButton'
import { Platform } from 'react-native'
import { Colors, Icons, Metrics } from '../../config'
import { Button } from '../Button'

const RBSheetFilter = forwardRef((props,ref:any) => {
      const [selectedIndex, setSelectedIndex] = useState({ filterObj: 0, sortObj: 0 })
      console.log("props",props.selectedIndex)
  return (
    <RBSheet
        ref={ref}
        openDuration={500}
        closeDuration={500}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            height: Platform.isPad ? Metrics.heightRatio(280) : 310,
            backgroundColor: Colors.onSecondary,
            borderTopRightRadius: 18,
            borderTopLeftRadius: 18,
          },
        }}>
        <Block flex margin={{ Horizontal: 12, All: Platform.isPad ? 70 : 0 }} >
          <Block row margin={{ Top: 24, }} width={'100%'}>
            <Text
              font="Medium"
              size={'H4'}
              align='center'
              style={{ alignSelf: 'center', flex: 1 }}>
              {'Filters'}
            </Text>
            <ImageButton
              imgStyle={{ alignSelf: 'flex-end' }}
              source={Icons.icClose}
              onPress={() => ref?.current?.close()}
            />
          </Block>
          <Text
            margin={{ Top: 26 }}
            font="Medium"
            size={'H5'}>
            {'Filter By'}
          </Text>
          {props?.filterObj?.map((item: any, index: number) => {
            return (
              <Block row style={{ paddingTop: 16 }} key={index}>
                <Block align='center'>
                  <ImageButton
                    source={props?.selectedIndex?.filterObj === index ? Icons.icRadioChecked : Icons.icRadioUnchecked}
                    onPress={()=>props?.setSelectedIndex(index)}
                  />
                </Block>
                <Text size={'H6'} font={'Regular'} margin={{ Left: 8 }} style={{ alignSelf: 'center' }}>{item.title}</Text>
              </Block>
            )
          })}
        </Block>
        <Block row margin={{ Horizontal: 16, Vertical: 22 }}>
          <Button
            label="Reset"
            onPress={() => { props?.setFoldersListning.withParams({ filter_by: '' }), ref.current?.close() }}
            type="DullSecondary"
            style={{ marginRight: 4 }}
          />
          <Button label="Apply" onPress={() => {props?.setFoldersListning(), ref?.current?.close()}} style={{ marginLeft: 4 }} />
        </Block>
      </RBSheet>
  )
})

export {RBSheetFilter}
