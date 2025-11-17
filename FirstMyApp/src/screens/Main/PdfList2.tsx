import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { Block, Button, Form, Icon, Image, Text, useAuth,FlatList } from '../../components'
import { PdfListningCard } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { Colors, Icons, Images, Metrics, Sizes } from '../../config'
import { Alert, Dimensions, Platform, StyleSheet, TouchableOpacity, FlatList as FlatListBase, ScrollView, View, ActivityIndicator, InteractionManager } from 'react-native'
import { usePagination } from '../../components/usePagination'
import { request } from '../../components/ApiService'
import { MainStackProps } from '.'
import DocumentPicker, { pick, types, } from 'react-native-document-picker'
import { Modal } from '../../components/Form/Components/Modal'
import { showMessage } from 'react-native-flash-message'
import _ from 'lodash';
import ReactNativeModal from 'react-native-modal'
import { _checkCurrentUser, _checkCurrentUserProject } from '../../Utility'
import { ChromePdfTabs } from './ChromePdfTabs'
import { CPDFReader } from './ProjectDetailPdfPage'
import AsyncStorage from '@react-native-async-storage/async-storage'

// AsyncStorage Helper Functions
const PDF_TABS_STORAGE_KEY = 'PDF_TABS_';

const savePDFTabsToStorage = async (projectId, parentId, tabs) => {
    try {
        const storageKey = `${PDF_TABS_STORAGE_KEY}${projectId}_${parentId}`;
        const tabsData = {
            tabs: tabs,
            timestamp: new Date().toISOString(),
            projectId: projectId,
            parentId: parentId
        };
        await AsyncStorage.setItem(storageKey, JSON.stringify(tabsData));
        console.log('PDF Tabs saved to storage:', storageKey);
    } catch (error) {
        console.error('Error saving PDF tabs:', error);
    }
};

const loadPDFTabsFromStorage = async (projectId, parentId) => {
    try {
        const storageKey = `${PDF_TABS_STORAGE_KEY}${projectId}_${parentId}`;
        const storedData = await AsyncStorage.getItem(storageKey);

        if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log('PDF Tabs loaded from storage:', storageKey);
            return parsedData.tabs || [];
        }
        return [];
    } catch (error) {
        console.error('Error loading PDF tabs:', error);
        return [];
    }
};

const clearPDFTabsFromStorage = async (projectId, parentId) => {
    try {
        const storageKey = `${PDF_TABS_STORAGE_KEY}${projectId}_${parentId}`;
        await AsyncStorage.removeItem(storageKey);
        console.log('PDF Tabs cleared from storage:', storageKey);
    } catch (error) {
        console.error('Error clearing PDF tabs:', error);
    }
};

// Get all stored PDF tabs for debugging/cleanup
const getAllStoredPDFTabs = async () => {
    try {
        const allKeys = await AsyncStorage.getAllKeys();
        const pdfTabsKeys = allKeys.filter(key => key.startsWith(PDF_TABS_STORAGE_KEY));
        const allTabs = {};

        for (const key of pdfTabsKeys) {
            const data = await AsyncStorage.getItem(key);
            if (data) {
                allTabs[key] = JSON.parse(data);
            }
        }
        return allTabs;
    } catch (error) {
        console.error('Error getting all stored PDF tabs:', error);
        return {};
    }
};

const ImageSlider = React.memo(({ isVisible = false, onBackPress, project_id, parent_id }: any) => {
    const [sheetFileState, setSheetFileState] = useState([]);

    const filePicker = async () => {
        try {
            const res = await pick({
                allowMultiSelection: true,
                type: [types.pdf],
            });

            if (res.length > 10) {
                showMessage({ message: 'You can only select upto 10 PDF files.', type: 'danger', icon: 'danger' });
                return;
            }

            const allValid = res.every(file => file?.type === 'application/pdf');
            if (!allValid) {
                showMessage({ message: 'Only PDF files are allowed.' });
                return;
            }
            setSheetFileState(s => { return [...s, ...res] });
        } catch (err) {
            console.error('File selection error:', err);
        }
    };

    const onSubmit = (data) => {
        if (sheetFileState.length > 0) {
            let formData = new FormData();
            sheetFileState.forEach((item, index) => {
                formData.append(`files`, item);
            });
            if (sheetFileState.length <= 10) {
                formData.append('project_id', project_id);
                formData.append('parent_id', parent_id);
                return request(`directories/bulk-create`, 'post')
                    .withBody(formData)
                    .withModule()
                    .onSuccess(response => {
                        onBackPress()
                        setSheetFileState([])
                    })
                    .onFailure(err => {
                        console.log('error====================>', { err })
                    })
                    .call()
            } else {
                showMessage({
                    message: 'Please upload upto 10 (PDFs) files',
                    type: 'danger',
                    icon: 'danger'
                })
            }
        } else {
            showMessage({
                message: 'Please select a file before uploading',
                type: 'danger',
                icon: 'danger'
            })
        }
    }

    const width = Dimensions.get('window').width;

    const onRemove = useCallback((indexToRemove: number) => {
        setSheetFileState((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    }, []);

    return (
        <ReactNativeModal isVisible={isVisible} >
            <Form onSubmit={onSubmit}>
                {({ register, loading, submit }) => (
                    <Block backgroundColor={Colors.background}
                        style={{
                            borderRadius: 12,
                            margin: Platform.OS == 'ios' && Platform.isPad ?
                                Metrics.iPadHeightRatio(90) :
                                Metrics.iPadHeightRatio(170), alignSelf: 'center'
                        }}
                        width={width - 30}
                        padding={{ Top: Metrics.iPadHeightRatio(36) }}
                        height={Platform.OS == 'ios' && Platform.isPad ? width - 180 : '50%'}>
                        <Block margin={{ Horizontal: 12 }}>
                            <Block margin={{ Left: 12 }} row>
                                <TouchableOpacity onPress={filePicker} style={{
                                    height: Metrics.iPadHeightRatio(100),
                                    width: Metrics.iPadHeightRatio(100),
                                    alignSelf: 'center',
                                }}>
                                    <Image source={Images.icUploadBulk}
                                        style={{
                                            height: Metrics.iPadHeightRatio(40),
                                            width: Metrics.iPadHeightRatio(92),
                                            borderRadius: Sizes.Base - 8,
                                            flex: 1,
                                            alignSelf: 'center',
                                        }} />
                                </TouchableOpacity>

                                <ScrollView keyboardShouldPersistTaps="handled"
                                    horizontal
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}>
                                    {sheetFileState?.map((item, index) => (
                                        <View key={index} style={{ flex: 1 }}>
                                            <TouchableOpacity
                                                style={{ ...styles.crossImageItem, padding: Metrics.ISPad && 10 }}
                                                onPress={() => onRemove(index)}>
                                                <View>
                                                    <Image
                                                        resizeMode="contain"
                                                        source={Icons.icClose}
                                                        height={18}
                                                        width={18}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                            <Block style={{
                                                height: Metrics.iPadHeightRatio(80),
                                                width: Metrics.iPadHeightRatio(80),
                                            }}>
                                                <Image source={Images.icPdfFile}
                                                    style={{
                                                        height: Metrics.iPadHeightRatio(80),
                                                        width: Metrics.iPadHeightRatio(76),
                                                        borderRadius: Sizes.Base - 8,
                                                        flex: 1,
                                                        alignSelf: 'center',
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
                                        </View>
                                    ))}
                                </ScrollView>
                            </Block>
                            <Button label="Upload PDF" onPress={submit} type='Solid' style={{ marginTop: 24 }} />
                            <Text
                                onPress={() => {
                                    setSheetFileState([])
                                    onBackPress()
                                }}
                                size='H5'
                                font="Regular"
                                align='center'
                                color='onSurfaceVariant'
                                margin={{ Vertical: 18 }}>
                                Cancel
                            </Text>
                        </Block>
                    </Block>
                )}
            </Form>
        </ReactNativeModal>
    );
});

// Memoized Chrome Tabs Header to prevent unnecessary re-renders

const ChromeTabsHeader = React.memo(({
    openPDFTabs,
    activeTabIndex,
    onBackToList,
    onSwitchTab,
    onCloseTab,
    setCanUndoState
}) => {
    const tabScrollRef = useRef(null);
    const tabLayouts = useRef({});          // { [index]: { x, width } }
    const containerWidth = useRef(0);
    const contentWidth = useRef(0);

    const getTruncatedTitle = useCallback((title, maxLength = 12) => {
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    }, []);

    // helper to call scrollTo safely (handles older RN refs with getNode)
    const safeScrollTo = (x) => {
        const sc = tabScrollRef.current;
        if (!sc) return;
        const args = { x: Math.max(0, x), animated: true };
        if (typeof sc.scrollTo === 'function') sc.scrollTo(args);
        else if (typeof sc.getNode === 'function') sc.getNode().scrollTo(args);
    };

    // Scroll to center (or at least make visible) the active tab
    useEffect(() => {
        const scrollToActive = (retry = 0) => {
            const layout = tabLayouts.current[activeTabIndex];
            const cWidth = containerWidth.current;
            const totalWidth = contentWidth.current;

            if (!layout || !cWidth) {
                // retry a few times in case layouts aren't measured yet
                if (retry < 6) {
                    setTimeout(() => scrollToActive(retry + 1), 50);
                }
                return;
            }

            // center the tab: targetX = x + width/2 - containerWidth/2
            const centerX = layout.x + (layout.width / 2) - (cWidth / 2);

            // clamp so we don't scroll past content edges
            const maxScroll = Math.max(0, totalWidth - cWidth);
            const target = Math.max(0, Math.min(centerX, maxScroll));

            safeScrollTo(target);
        };

        if (openPDFTabs.length > 0) scrollToActive();
    }, [activeTabIndex, openPDFTabs.length]);

    return (
        <View style={styles.chromeTabsHeader}>
            <TouchableOpacity
                style={styles.backToListButton}
                onPress={onBackToList}
            >
                <Icon name='icBackButton' size={28} />
                <Text style={styles.backToListText}>Back to List</Text>
            </TouchableOpacity>

            <ScrollView
                ref={tabScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsScrollContainer}
                style={styles.tabsScrollView}
                // capture container width
                onLayout={(e) => {
                    containerWidth.current = e.nativeEvent.layout.width;
                }}
                // capture content width when it changes (useful if tabs change size)
                onContentSizeChange={(w /*, h*/) => {
                    contentWidth.current = w;
                }}
            >
                {openPDFTabs.map((pdf, index) => (
                    <TouchableOpacity
                        key={pdf.tabId}
                        style={[styles.chromeTab, index === activeTabIndex && styles.activeChromeTab]}
                        onPress={() => onSwitchTab(index)}
                        // measure each tab's x and width relative to the ScrollView content container
                        onLayout={(e) => {
                            const { x, width } = e.nativeEvent.layout;
                            tabLayouts.current[index] = { x, width };
                            // update contentWidth too (fallback if onContentSizeChange isn't fired)
                            contentWidth.current = Math.max(contentWidth.current, x + width);
                        }}
                    >
                        <Text
                            style={[styles.chromeTabTitle, index === activeTabIndex && styles.activeChromeTabTitle]}
                            numberOfLines={1}
                        >
                            {getTruncatedTitle(pdf.title)}
                        </Text>
                        <TouchableOpacity
                            style={styles.chromeTabClose}
                            onPress={(e) => {
                                e.stopPropagation();
                                onCloseTab(index);
                                setCanUndoState(false);
                            }}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Text>x</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {openPDFTabs.length > 0 && (
                <View style={styles.tabCounter}>
                    <Text style={styles.tabCounterText}>{openPDFTabs.length}</Text>
                </View>
            )}
        </View>
    );
});


// Memoized PDF Viewer Component
const PDFViewerComponent = React.memo(({
    activePDF,
    activeTabIndex,
    setCanUndoState,
    itemProjectID,
    itemParentID,
    canUndoState,
    refCPDF,
    isLoading,
    setLoading,
    showChromeTabsMode,
    setShowChromeTabsMode
}) => {
    console.log(isLoading,'=================>isLoading');
    
    const [isTabSwitching, setIsTabSwitching] = useState(false);
    useEffect(() => {
        setIsTabSwitching(true);
        const timer = setTimeout(() => {
            setIsTabSwitching(false);
        }, 300); // Adjust the time to the required duration

        return () => clearTimeout(timer); // Cleanup timeout
    }, [activeTabIndex]);
    if (isTabSwitching || isLoading) {
        return (
            <View style={styles.pdfViewerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }
    if (!activePDF) {
        return (
            <View style={styles.noPdfContainer}>
                <Text style={styles.noPdfText}>No PDF selected</Text>
            </View>
        );
    }

    return (
        <View style={styles.pdfViewerContainer}>
            <CPDFReader
                filePath={activePDF.file}
                setCanUndoState={setCanUndoState}
                fileTitle={activePDF?.title}
                projectId={itemProjectID}
                parentId={itemParentID}
                canUndoState={canUndoState}
                ref={ref => { refCPDF.current = ref }}
                isLoading={isLoading}
                setLoading={setLoading}
                showChromeTabsMode={showChromeTabsMode}
                setShowChromeTabsMode={setShowChromeTabsMode}

            />
        </View>
    );
});

// Enhanced PDF Card Component with memo
const EnhancedPdfCard = React.memo(({ item, index, onOpenSingle, onDelete, onAddToTabs, onLayout }) => {
    return (
        <View style={styles.cardContainer} onLayout={onLayout}>
            <PdfListningCard
                key={item?._id + '-' + index}
                userRec={item?.project?.user}
                onPress={() => onOpenSingle(item)}
                onPressDelete={() =>
                    Alert.alert('Delete', 'Are you sure you want to delete this Pdf file?', [
                        { text: 'No' },
                        { text: 'Yes', onPress: () => onDelete(item?._id) },
                    ])
                }
                item={item}
            />

            <TouchableOpacity
                style={styles.addToTabsButton}
                onPress={() => onAddToTabs(item)}
                activeOpacity={0.7}
            >
                <Icon name='fabIconAdd' size={14} />
                <Text style={styles.addToTabsText}>Open in Tabs</Text>
            </TouchableOpacity>
        </View>
    );
});

const YourListScreen = (props) => {
    const navigation = useNavigation();
    const [folderState, setFolderState] = useState(false);
    const [showChromeTabsMode, setShowChromeTabsMode] = useState(false);
    const [openPDFTabs, setOpenPDFTabs] = useState([]);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const { screenTitle, itemParentID, itemProjectID, currentUser } = props.route.params
    const useAuthData = useAuth()
    const refCPDF = useRef<any>(null)
    const [canUndoState, setCanUndoState] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const flatListRef = useRef<FlatListBase>(null);
    const itemHeightsRef = useRef<Record<string, number>>({}); // { [_id]: height }
    const estimatedItemHeight = 120; // fallback estimate, tune this
    const [bottomLoader, setBottomLoader] = useState(false);
    const { width } = Dimensions.get("window");

    // Called from each rendered card's onLayout
    const handleItemLayout = useCallback((event, id) => {
        const { height } = event.nativeEvent.layout;
        itemHeightsRef.current[id] = height;
    }, []);
    // Memoized active PDF to prevent unnecessary re-renders
    const activePDF = useMemo(() => openPDFTabs[activeTabIndex], [openPDFTabs, activeTabIndex]);

    const [subFoldersListning, SetPdfListning] = usePagination({
        request: request(`directories/?project_id=${itemProjectID}&parent_id=${itemParentID}`, 'get')
    })
    // console.log(subFoldersListning.data,'=================>subFoldersListning.data');

    const getOffsetForIndex = useCallback((index) => {
        let offset = 0;
        const data = subFoldersListning.data || [];
        for (let i = 0; i < index; i++) {
            const id = data[i]?._id;
            offset += itemHeightsRef.current[id] ?? estimatedItemHeight;
        }
        return offset;
    }, [subFoldersListning.data]);
    const scrollToPdf = useCallback((pdfId) => {
        const tryScroll = (attempt = 0) => {
            const index = subFoldersListning.data.findIndex(i => i._id === pdfId);

            if (index === -1) {
                // Not found yet — maybe still in next page
                if (!subFoldersListning.isFetching && subFoldersListning.hasNextPage) {
                    console.log('📄 PDF not in current data, fetching next page...');
                    // subFoldersListning.onEndReached(); // trigger pagination
                }

                if (attempt < 20) {
                    // retry until data loads
                    setTimeout(() => tryScroll(attempt + 1), 300);
                } else {
                    console.log('⚠️ Could not find PDF after retries');
                }
                return;
            }

            console.log(
                '✅ Found PDF index:', index,
                'for PDF ID:', pdfId,
                'total items:', subFoldersListning.data.length
            );

            const offset = getOffsetForIndex(index);

            InteractionManager.runAfterInteractions(() => {
                if (!flatListRef.current) return;

                if (index === subFoldersListning.data.length - 1) {
                    flatListRef.current.scrollToEnd({ animated: true });
                } else {
                    flatListRef.current.scrollToOffset({ offset, animated: true });
                }
            });
        };

        tryScroll(0);
    }, [subFoldersListning, getOffsetForIndex]);

    useEffect(() => {
        SetPdfListning.call();
    }, [itemProjectID, itemParentID, showChromeTabsMode])

    // Load PDF tabs from storage on component mount
    useEffect(() => {
        const loadStoredTabs = async () => {
            const storedTabs = await loadPDFTabsFromStorage(itemProjectID, itemParentID);
            if (storedTabs.length > 0) {
                setOpenPDFTabs(storedTabs);
                // Auto-open tabs mode if there are stored tabs
                // setShowChromeTabsMode(true);
            }
        };

        loadStoredTabs();
    }, [itemProjectID, itemParentID]);

    // Save PDF tabs to storage whenever tabs change
    useEffect(() => {
        if (openPDFTabs.length > 0) {
            savePDFTabsToStorage(itemProjectID, itemParentID, openPDFTabs);
        } else {
            // Clear storage when no tabs are open
            clearPDFTabsFromStorage(itemProjectID, itemParentID);
        }
    }, [openPDFTabs, itemProjectID, itemParentID]);

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: () => <Text size="H4" font="SemiBold" numberOfLines={1} padding={{ Right: 12 }}   style={{
      maxWidth: width * 0.4, // ✅ title will take 60% of screen width
    }} >{screenTitle}</Text>,
            headerLeft: () => !!showChromeTabsMode ? null :
                (<Icon
                    onPress={() => navigation.goBack()}
                    margin={{ Left: Metrics.iPadHeightRatio(12), }}
                    size={60}
                    name={'icBackButton'} />),
            headerRight: () => {
                if (showChromeTabsMode === false) {
                    return  <Button label="Upload PDF"
                        onPress={() => { navigation.navigate('PdfBulkUpload',{projectId:itemProjectID,parentId:itemParentID}) }}
                        type='Solid'
                        styleText={{ size: 'H6' }}
                        style={{ width: 100, marginRight: Metrics.iPadHeightRatio(12), maxHeight: 38, minHeight: 38 }} /> 
                }
                else if (showChromeTabsMode && canUndoState) {
                    return <Button
                        label='Save As'
                        style={{ width: 80, marginRight: Metrics.iPadHeightRatio(12), maxHeight: 38, minHeight: 38 }}
                        onPress={() => { refCPDF.current?.saveDocument() }}
                        loading={isLoading}
                    />
                }
            },
        })
    }, [subFoldersListning, showChromeTabsMode, canUndoState, isLoading])

    // Stable callback functions to prevent re-renders
    const deleteFolder = useCallback((id: string) => {
        return request(`directories/${id}`, 'DELETE')
            .onSuccess(() => {
                SetPdfListning.call();

                // Remove deleted PDF from tabs if it exists
                setOpenPDFTabs(prevTabs => {
                    const updatedTabs = prevTabs.filter(tab => tab._id !== id);
                    // If current active tab was deleted, adjust index
                    if (updatedTabs.length > 0 && activeTabIndex >= updatedTabs.length) {
                        setActiveTabIndex(updatedTabs.length - 1);
                    } else if (updatedTabs.length === 0) {
                        setShowChromeTabsMode(false);
                    }
                    return updatedTabs;
                });
            })
            .call();
    }, [SetPdfListning, activeTabIndex]);

    const addPdfToTabs = useCallback((pdfItem) => {
        const existingIndex = openPDFTabs.findIndex(pdf => pdf._id === pdfItem._id);

        if (existingIndex !== -1) {
            setActiveTabIndex(existingIndex);
            setShowChromeTabsMode(true);
            return;
        }

        const newPDF = {
            ...pdfItem,
            tabId: Date.now() + Math.random(),
            currentPage: 1,
            totalPages: 1,
        };

        setOpenPDFTabs(prev => [...prev, newPDF]);
        setActiveTabIndex(openPDFTabs.length);
        setShowChromeTabsMode(true);
    }, [openPDFTabs]);

    const closePdfTab = useCallback((tabIndex) => {
        if (openPDFTabs.length === 1) {
            setOpenPDFTabs([]);
            setShowChromeTabsMode(false);
            return;
        }

        const newOpenPDFs = openPDFTabs.filter((_, index) => index !== tabIndex);
        setOpenPDFTabs(newOpenPDFs);

        if (activeTabIndex >= tabIndex && activeTabIndex > 0) {
            setActiveTabIndex(activeTabIndex - 1);
        } else if (activeTabIndex >= newOpenPDFs.length) {
            setActiveTabIndex(newOpenPDFs.length - 1);
        }
    }, [openPDFTabs, activeTabIndex]);

    const switchToTab = useCallback((tabIndex) => {
        setActiveTabIndex(tabIndex);
        setCanUndoState(false)
    }, []);

    const openSinglePdf = useCallback((item) => {
        navigation.navigate('ProjectDetailPdfPage', {
            ScreenTitleName: item.title,
            file_path: item?.file,
            project_id: itemProjectID,
            parent_id: itemParentID,
        });
    }, [navigation, itemProjectID, itemParentID]);

    const handleBackToList = useCallback(() => {
        setCanUndoState(false)
        setShowChromeTabsMode(false);
        if (activeTabIndex !== null && openPDFTabs[activeTabIndex]) {
            const pdfId = openPDFTabs[activeTabIndex]._id;

            // Delay to next render frame
            setTimeout(() => scrollToPdf(pdfId), 100);
        }
        // Note: We don't clear tabs here, they remain in storage for later use
    }, [activeTabIndex, openPDFTabs, scrollToPdf]);

    // Clear all tabs function (for debugging or user action)
    const clearAllTabs = useCallback(() => {
        Alert.alert(
            'Clear All Tabs',
            'This will close all PDF tabs in this folder. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: () => {
                        setOpenPDFTabs([]);
                        setShowChromeTabsMode(false);
                        clearPDFTabsFromStorage(itemProjectID, itemParentID);
                    }
                }
            ]
        );
    }, [itemProjectID, itemParentID]);

    // Memoized render functions
    const renderPdfCard = useCallback(({ item, index }) => (
        <EnhancedPdfCard
            item={item}
            index={index}
            onOpenSingle={openSinglePdf}
            onDelete={deleteFolder}
            onAddToTabs={addPdfToTabs}
            onLayout={(e) => handleItemLayout(e, item._id)} // << pass the onLayout handler

        />
    ), [openSinglePdf, deleteFolder, addPdfToTabs]);

    // Chrome Tabs View - Separated for better performance
    const ChromeTabsView = useMemo(() => (
        <View style={styles.chromeTabsContainer}>
            <ChromeTabsHeader
                openPDFTabs={openPDFTabs}
                activeTabIndex={activeTabIndex}
                onBackToList={handleBackToList}
                onSwitchTab={switchToTab}
                onCloseTab={closePdfTab}
                setCanUndoState={setCanUndoState}
            />

            <PDFViewerComponent
                activePDF={activePDF}
                setCanUndoState={setCanUndoState}
                itemProjectID={itemProjectID}
                itemParentID={itemParentID}
                canUndoState={canUndoState}
                refCPDF={refCPDF}
                isLoading={isLoading}
                setLoading={setLoading}
                activeTabIndex={activeTabIndex}
                showChromeTabsMode={showChromeTabsMode}
                setShowChromeTabsMode={setShowChromeTabsMode}
            />
        </View>
    ), [
        openPDFTabs,
        activeTabIndex,
        activePDF,
        canUndoState,
        isLoading,
        handleBackToList,
        switchToTab,
        closePdfTab,
        setCanUndoState,
        setLoading
    ]);

    // Main render logic
    if (showChromeTabsMode && openPDFTabs.length > 0) {
        return (
            <Block flex gradient={[Colors.background, Colors.textBackground]}>
                {ChromeTabsView}
            </Block>
        );
    }

    // Your existing list view
    return (
        <Block flex gradient={[Colors.background, Colors.textBackground]}>
               <FlatList
                style={{ paddingTop: 15 }}
                {...subFoldersListning}
                onEndReached={subFoldersListning.onEndReached}
                keyExtractor={(item, index) => item.key + '' + index}
                showBottomLoader={subFoldersListning.isFetching && !!subFoldersListning.page}
                contentContainerStyle={{ paddingBottom: 110 }}
                renderItem={renderPdfCard}
                  ref={flatListRef}
                getItemLayout={(data, index) => ({
                    length: estimatedItemHeight,
                    offset: estimatedItemHeight * index,
                    index,
                })}
            />
            {/* <FlatList

                style={{ paddingTop: 15 }}
                {...subFoldersListning}
                // onEndReached={subFoldersListning.onEndReached}
                keyExtractor={(item, index) => item.key + '' + index}
                onEndReached={() => {
                    if (subFoldersListning.isFetching) {
                        setBottomLoader(true)
                        setTimeout(() => {
                            setBottomLoader(false)
                        }, 1000);
                    } 
                    else{
                        
                    }
                    subFoldersListning.onEndReached();

                }}
                ListEmptyComponent={!subFoldersListning.isFetching && (
                    <Block flex align="center" justify="center" padding={{ top: 100 }}>
                     
                        <Text size="H5" font="Regular" color="onSurfaceVariant" margin={{ top: 24 }}>
                            No PDFs found
                        </Text>
                    </Block>
                )}
                ListFooterComponent={bottomLoader && (<ActivityIndicator size={"large"} />)}

                // showBottomLoader={subFoldersListning.isFetching && !!subFoldersListning.page}
                contentContainerStyle={{ paddingBottom: 140 }}
                renderItem={renderPdfCard}
                ref={flatListRef}
                getItemLayout={(data, index) => ({
                    length: estimatedItemHeight,
                    offset: estimatedItemHeight * index,
                    index,
                })}
            /> */}

            {/* Show Chrome Tabs Button if tabs are open */}
            {openPDFTabs.length > 0 && (
                <View style={styles.floatingButtonContainer}>
                    <TouchableOpacity
                        style={styles.showTabsButton}
                        onPress={() => setShowChromeTabsMode(true)}
                    >
                        <Icon name='arrowRight' style={undefined} />
                        <Text style={styles.showTabsButtonText}>
                            Open PDFs ({openPDFTabs.length})
                        </Text>
                    </TouchableOpacity>

                    {/* Clear All Tabs Button - Optional for debugging */}
                    {/* {__DEV__ && ( */}
                    <TouchableOpacity
                        style={[styles.showTabsButton, { backgroundColor: '#ff6b6b', marginTop: 8 }]}
                        onPress={clearAllTabs}
                    >
                        <Icon name='trash' style={undefined} />
                        <Text style={styles.showTabsButtonText}>Clear All</Text>
                    </TouchableOpacity>
                    {/* )} */}
                </View>
            )}

            <ImageSlider
                isVisible={folderState}
                onBackPress={() => { setFolderState(s => !s); SetPdfListning.call() }}
                project_id={itemProjectID}
                parent_id={itemParentID}
            />
        </Block>
    );
};

const styles = StyleSheet.create({
    crossImageItem: {
        position: 'absolute',
        top: -5,
        right: -5,
        zIndex: 1000,
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 2,
    },
    cardContainer: {
        position: 'relative',
    },
    addToTabsButton: {
        position: 'absolute',
        bottom: 8,
        right: Metrics.ISPad ? 36 : 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    addToTabsText: {
        fontSize: 10,
        color: Colors.primary,
        marginLeft: 4,
        fontWeight: '500',
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    showTabsButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    showTabsButtonText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 12,
    },
    chromeTabsContainer: {
        flex: 1,
    },
    chromeTabsHeader: {
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        paddingVertical: 8,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backToListButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 6,
        marginRight: 8,
    },
    backToListText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 4,
    },
    tabsScrollView: {
        flex: 1,
    },
    tabsScrollContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingRight: 8,
    },
    chromeTab: {
        minWidth: 130,
        maxWidth: 180,
        height: 43,
        backgroundColor: '#e9ecef',
        // borderTopLeftRadius: 6,
        // borderTopRightRadius: 6,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginBottom: 0,
        marginRight: 2,
        borderWidth: 1,
        borderColor: '#dee2e6',
        // borderBottomWidth: 0,
    },
    activeChromeTab: {
        backgroundColor: Colors.background,
        elevation: 2,
    },
    chromeTabTitle: {
        flex: 1,
        fontSize: 10,
        color: '#6c757d',
        fontWeight: '400',
    },
    activeChromeTabTitle: {
        color: '#212529',
        fontWeight: '500',
        fontSize: 16,
    },
    chromeTabClose: {
        marginLeft: 4,
        padding: 2,
        borderRadius: 8,
    },
    tabCounter: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 4,
    },
    tabCounterText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    pdfViewerContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    noPdfContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noPdfText: {
        fontSize: 16,
        color: '#999',
    },
});

export default YourListScreen;