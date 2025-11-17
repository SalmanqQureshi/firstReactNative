import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInput } from '../Form';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Block } from '../Layout';
import { ImageButton } from '../ImageButton';
import { Colors, Icons, Metrics } from '../../config';
import { Button, Text, useAuth, FlatList } from '../';
import _ from 'lodash';
import { usePagination } from '../usePagination';

interface CheckBoxprops {
    request:any
    data: [];
    onChange: (item: {}) => void;
    label: string;
    title: string;
    open?: boolean;
    initData?: []; // Added for assignees
    error?: boolean;
    errortxt?: ''
    extraData?: any
}

export const CheckBox = forwardRef(({data, request , onChange, label, title, open, initData, error, errortxt , extraData = []}:CheckBoxprops, ref) => {
const [dataApi , Api] = usePagination({ request });
    const refRBSheet = useRef();
    const [selectedItems, setSelectedItems] = useState([]);
    const [isId, setId] = useState(0);
    useEffect(() => {
        if (initData && label === 'Select Assignee') {
            const dd = initData.map((item) => item?._id?._id || item?._id).filter(Boolean);
            const selected = data.filter((item) => dd.includes(item._id));
            // setSelectedItems(selected);
        } else if (title && data?.length > 0) {
            // For single-select (radio buttons), find the item matching the title
            const selectedItem = data.find((item) => item.title === title || item._id === title);
            if (selectedItem) {
                setSelectedItems([selectedItem]);
                setId(selectedItem._id);
            }
        } else {
            setSelectedItems([]);
        }
    }, [data, initData, title, label]);
    useImperativeHandle(ref, () => ({
        emptyState() {
            setSelectedItems([]);
            setId(0);
        },
        UnSelectMembers(id: any) {
            setSelectedItems((prevSelectedItems) => {
                const isSelected = prevSelectedItems.some((selectedItem) => selectedItem._id === id);
                if (isSelected) {
                    return prevSelectedItems.filter((selectedItem) => selectedItem._id !== id);
                }
                return prevSelectedItems;
            });
        },
        isSelected(id: any) {
            // console.log('CheckBox isSelected:', label, 'id:', id, 'data:', data);
            if (!id) {
                // console.log('CheckBox isSelected: Invalid id', id);
                return;
            }
            const item = data.find((d) => d._id === id);
            if (item) {
                setSelectedItems([item]);
                setId(id);
                onChange(item);
                // console.log('CheckBox isSelected: Selected Item:', item);
            } else {
                console.log('CheckBox isSelected: No item found for id', id);
            }
        },
        isSelected2(id: []) {
            const dd = id.map((item) => item?._id?._id || item?._id).filter(Boolean);
            const selected = data.filter((item) => dd.includes(item._id));
            setSelectedItems(selected);
        },
        selectedItem() {
            return selectedItems
        },
        onChecked(item: { _id: number }) {
            // console.log('onChecked(item: { _id: number })', item)
            _checked(item)
        }

    }));

    const _checked = (item: { _id: number }) => {
        if (label === 'Select Assignee') {
            setSelectedItems((prevSelectedItems) => {
                const isSelected = prevSelectedItems.some((selectedItem) => selectedItem._id === item._id);
                if (isSelected) {
                    onChange(item);
                    return prevSelectedItems.filter((selectedItem) => selectedItem._id !== item._id);
                } else {
                    onChange(item);
                    return [...prevSelectedItems, item];
                }
            });
        } else {
            // console.log('====================================');
            // console.log(selectedItems, 'loodosaoaodaosd', item);
            // console.log('====================================');
            if (!_.isEmpty(selectedItems)) {
                const isAvailable = selectedItems.some((selectedItem) => selectedItem._id === item._id);
                if (!isAvailable) {
                    setSelectedItems([item]);
                    onChange(item);
                    setId(0);
                    refRBSheet.current.close();
                }
            } else {
                setSelectedItems([item]);
                onChange(item);
                setId(0);
                refRBSheet.current.close();
            }
        }
    };
    // console.log(label+' '+JSON.stringify(data,null,2))
    return (
        <>
            <TextInput
                onPress={() => {
                    if (open) {
                        refRBSheet.current.open();
                    }
                }}
                label={label}
                rightIcon={'icArrowDown'}
                value={selectedItems[0]?.title || title || ''
                }
                onRightIconPress={() => {
                    if (open) {
                        refRBSheet.current.open();
                    }
                }}
                style={{color:'black'}}
                type='Text'
                key={selectedItems[0]?.title || title || ''}
                editable={false}
            />
            {error && (
                <Text size="Body" style={{ color: 'red' }} margin={{ Top: 4 }}>
                    {errortxt} is required
                </Text>
            )}
            <RBSheet
                ref={refRBSheet}
                openDuration={500}
                closeDuration={500}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    container: {
                        height: Platform.OS == 'ios' && Platform.isPad ? Metrics.heightRatio(350) : 420,
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
                            align='center'
                            style={{ alignSelf: 'center', flex: 1 }}
                        >
                            {label}
                        </Text>
                        <ImageButton
                            imgStyle={{ alignSelf: 'flex-end' }}
                            source={Icons.icClose}
                            onPress={() => refRBSheet.current.close()}
                        />
                    </Block>
                    <FlatList
                        data={!!dataApi.data.length ? [...extraData, ...dataApi.data] : data}
                        ListEmptyComponent={() => (
                            <Text size={'H6'} font={'Regular'} color={'outlineVariant'} align='center'>
                                {'Data not found'}
                            </Text>
                        )}
                        onEndReached={dataApi.onEndReached}
                        refreshControl={dataApi.refreshControl}
                        keyExtractor={(item, index) => item._id + '' + index}
                        renderItem={({ item, index }) => (
                            <Block
                                row
                                style={{ paddingTop: 16 }}
                                key={index}
                                space='between'
                                onPress={() => {
                                    _checked(item);
                                }}
                            >
                                <Text size={'H6'} font={'Regular'}>
                                    {item?.title || item?.name || item?._id?.name}
                                </Text>
                                <Block align='center'>
                                    <ImageButton
                                        onPress={() => {
                                            _checked(item);
                                        }}
                                        source={selectedItems.some(selectedItem => selectedItem._id === item._id) || isId == item?._id

                                            ? (label === 'Select Assignee' ? Icons.icCheckbox : Icons.icRadioChecked)
                                            : (label === 'Select Assignee' ? Icons.icUnCheckbox : Icons.icRadioUnchecked)
                                        }
                                    />
                                </Block>
                            </Block>

                        )}
                    />
                </Block>
                <Block row margin={{ Horizontal: 16, Vertical: 22 }}>
                    {label === 'Select Assignee' && (
                        <Button label="Select" onPress={() => refRBSheet.current.close()} style={{ marginLeft: 4 }} />
                    )}
                </Block>
            </RBSheet>
        </>
    );
});