import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import { Colors, Icons, Sizes } from '../../config';
import { FlatList } from '../Scrollable';
import { Modal } from '../Form/Components/Modal';
import { TextInput } from '../Form';
import { Block } from '../Layout';
import { ImageButton } from '../ImageButton';
import { useBoolAnimation } from '../useBoolAnimation';


type Props = {
  label: string;
  options: any[];
  value: string | number;
  onSelect: (value: string | number) => any;
}

export const BottomSheet = ({ label, options, value, onSelect }: Props) => {
  console.log('options--------------', options)
  const [isModalVisible, setModalVisible] = useState(false);
  let animateOnFocus = useBoolAnimation(true)

  const labeling = {
    position: 'absolute',
    paddingRight: 5,
    paddingLeft: 5,
    alignSelf: 'center',
    // top: Platform.OS=='android'? animateOnFocus(-4, -8):animateOnFocus(Platform.OS==='ios'&&Platform.isPad? 10 :0, -4),
    // left: Platform.OS=='android'? animateOnFocus(0, -2):animateOnFocus(0, -5),
    // fontSize: animateOnFocus(17, 12),
    // color: animateOnFocus( Colors.outlineVariant,Colors.primary),
  }
  return (
    <View>
      {/* <TextInput
        onPress={() => setModalVisible(true)}
        label={label}
        rightIcon={'icArrowDown'}
        value={value ? options.find(option => option.title === value)?.title : value}
        onRightIconPress={() => setModalVisible(true)}
        type='Text' /> */}
      <TouchableOpacity
          style={styles.dropdownContainer}
          onPress={() => setModalVisible(true)}
            >
                <Text style={{...labeling}}>
                    {label}
                </Text>
                <Text style={styles.dropdownText}>
                    {value ? options.find(option => option.title === value)?.title : label}
                </Text>
            </TouchableOpacity>
      <Modal
        Visible={isModalVisible}
        onBackPress={() => {
          setModalVisible(false);
        }}
        type="Bottom">

        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => {
                  onSelect(item.title);
                  setModalVisible(false);
                }}
              >
                <Block  row style={{ paddingTop: 16 }}  space='between'>
                <Text style={styles.optionText}>{item.title}</Text>
                <Block align='center'>
                  <ImageButton source={Icons.icRadioChecked} />
                </Block>
                </Block>
              </TouchableOpacity>
              
            )}
          />
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  dropdownContainer: {
    borderWidth: 1,
    borderColor: Colors.textColors,
    borderRadius: 26,
    minHeight: Sizes.Controls.height,
    justifyContent: 'center',
    paddingLeft: 16
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.textColors
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxHeight: 300,
  },
  optionContainer: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: Colors.textColors
  },
});

