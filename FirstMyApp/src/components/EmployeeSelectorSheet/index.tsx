import React, { forwardRef } from 'react'
import { Platform } from 'react-native'
import { Block, FlatList, ImageButton, Text, Button } from '..'
import { Metrics, Colors, Icons } from '../../config'
import RBSheet from 'react-native-raw-bottom-sheet'

interface EmployeeSelectorSheetInterface {
    employees: any[]
    selectedItems: any[]
    toggleSelection: (item: any) => void
    onSelectDone: () => void
  
}
const EmployeeSelectorSheet = forwardRef(({employees = [],selectedItems = [],toggleSelection,onSelectDone,}:EmployeeSelectorSheetInterface,
    ref: any
  ) => {
    return (
      <RBSheet
        ref={ref}
        openDuration={500}
        closeDuration={500}
        closeOnDragDown
        closeOnPressMask
        customStyles={{
          container: {
            height: Platform.isPad ? Metrics.heightRatio(350) : 420,
            backgroundColor: Colors.onSecondary,
            borderTopRightRadius: 18,
            borderTopLeftRadius: 18,
          },
        }}
      >
        <Block flex margin={{ Horizontal: 12 }}>
          <Block row margin={{ Top: 24 }} width={'100%'}>
            <Text
              font="Medium"
              size={'H4'}
              align="center"
              style={{ alignSelf: 'center', flex: 1 }}
            >
              Select Employees
            </Text>
            <ImageButton
              imgStyle={{ alignSelf: 'flex-end' }}
              source={Icons.icClose}
              onPress={() => ref.current?.close()}
            />
          </Block>

          <FlatList
            {...employees}
            keyExtractor={(item, index) => item._id + '_' + index}
            onEndReached={employees.onEndReached}
            showBottomLoader={employees.isFetching && !!employees.page}
            renderItem={({ item, index }) => {
              const isSelected = selectedItems.some((selected) => selected._id === item._id)
              return (
                <Block
                  row
                  style={{ paddingTop: 16 }}
                  key={index}
                  space="between"
                  onPress={() => toggleSelection(item)}
                >
                  <Text size="H6" font="Regular" margin={{ Left: 8 }}>
                    {item.name}
                  </Text>
                  <Block align="center">
                    <ImageButton
                      source={isSelected ? Icons.icCheckbox : Icons.icUnCheckbox}
                      onPress={() => toggleSelection(item)}
                    />
                  </Block>
                </Block>
              )
            }}
            style={{ marginBottom: Metrics.heightRatio(12) }}
          />

          <Block row margin={{ Horizontal: 16, Vertical: 22 }}>
            <Button label="Select" onPress={onSelectDone} style={{ marginLeft: 4 }} />
          </Block>
        </Block>
      </RBSheet>
    )
  }
)

export {EmployeeSelectorSheet}
