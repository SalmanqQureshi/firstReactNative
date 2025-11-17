import React, { useEffect, useRef, useState } from 'react';
import { Block, Button, CheckBox, EmployeeTabs, Form, Image, ImageButton, Text, TextInput, useAuth } from '../../components';
import { MainStackProps } from '.';
import { Colors, Metrics, Icons, Images } from '../../config';
import { Platform, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { request } from '../../components/ApiService';
import { DateTimePicker } from '../../components/Form/Components/DateTimePicker';
import _ from 'lodash';
import { dateFormat } from '../../Utility';
import { showToast } from '../../components/Toast';

const AddTask = (props: MainStackProps<'AddTask'>) => {
    const projectRef = useRef();
    const folderRef = useRef();
    const subFolderRef = useRef();
    const memberRef = useRef();
    const user1 = useAuth();
    let userItem = props.route.params?.items;
    let isUpdated = props.route.params?.isUpdated; // Changed to constant
    const [dateState, setDateState] = useState({
        startDate: '',
        endDate: ''
    });
    useEffect(() => {
        if (isUpdated) {
            props.navigation.setOptions({
                headerTitle: "Edit Task"
            })
        }
    }, [isUpdated])
    const [selectedItems, setSelectedItems] = useState({
        projectState: true,
        folderState: false,
        subFolderState: false,
        projectMembers: [],
        selectProjectName: !!isUpdated ? userItem?.project.title : '',
        selectProjectId: !!isUpdated ? userItem.project?._id : 0,
        selectFolder: [],
        selectSubFolder: [],
        selectPdf: []
    });
    const [state, setState] = useState({
        project: !!isUpdated ? userItem.project : 0,
        root_directory: !!isUpdated ? userItem.root_directory : 0,
        sub_directory: !!isUpdated ? userItem.sub_directory : 0,
        foldername: ''
    });
    const [projectName, setProjectName] = useState([]);
    const [isEmployee, setEmployee] = useState(userItem?.assignees || []);
    const [isPdf, setPdf] = useState([]);
    const [isPdf2, setPdf2] = useState([]);
    const [visibleSubFolder, setVisibleSubFolder] = useState(false);
    const [isLoader, setLoader] = useState(true);
    const [subFolderVisible, setSubFolderVisisble] = useState(false);
    const [errors, setErrors] = useState({
        projectName: false,
        folder: false,
        subFolder: false,
        assignee: false
    });
    useEffect(() => {
        request(`projects`, "GET")
            .withOutToast()
            .withLoader()
            .onSuccess((res) => {
                setProjectName(res.data?.data || []);
            }).call();
    }, []);

    const getSetEditValue = () => {
        request(`directories`, "GET")
            .withParams({ project_id: userItem.project?._id })
            .withOutToast()
            .withLoader()
            .onSuccess((res) => {
                // console.log('getSetEditValue response:', res.data?.data, 'root_directory:', userItem.root_directory);
                setSelectedItems(s => ({ ...s, selectFolder: res.data?.data || [] }));
                setTimeout(() => {
                    getSetEditValue2(userItem.root_directory);
                    if (projectName.length > 0 && userItem.project) {
                        projectRef?.current?.isSelected(userItem.project);
                    }
                }, 200);
            }).onFailure((err)=>console.log('Folder ',err)).call();
    };

    const getSetEditValue2 = (id) => {
        request(`directories`, "GET")
            .withParams({ project_id: userItem.project?._id, parent_id: id })
            .withOutToast()
            .withLoader()
            .onSuccess((res) => {
                // console.log('getSetEditValue2 response:', res.data?.data, 'sub_directory:', userItem.sub_directory);
                setSelectedItems(s => ({ ...s, selectSubFolder: res.data?.data || [], subFolderState: true }));
                getSetEditValue3(userItem.sub_directory);
                if (userItem.root_directory) {
                    folderRef?.current?.isSelected(userItem.root_directory);
                }
            }).onFailure((err)=>console.log('SUBFolder ',err)).call();
    };

    const getSetEditValue3 = (id) => {
        request(`directories`, "GET")
            .withParams({ project_id: userItem.project?._id, parent_id: id })
            .withOutToast()
            .withLoader()
            .onSuccess((res) => {
                // console.log('getSetEditValue3 response:', res.data?.data, 'isPdf:', isPdf);
                const apiPdfs = res.data?.data || [];
                const finalPdfs = isUpdated && !apiPdfs.length && isPdf.length ? isPdf : apiPdfs;
                setSelectedItems(s => ({ ...s, selectPdf: finalPdfs, subFolderState: true }));
                setLoader(false)
                // if (userItem.sub_directory) {
                //     subFolderRef?.current?.isSelected(userItem.sub_directory);
                // }
                eidtSelectEmployee();
            }).onFailure((err)=>console.log('PDF Files ',err)).call();
    };

    const eidtSelectEmployee = () => {
        request(`projects/${userItem.project?._id}`, "GET")
            .withOutToast()
            .withLoader()
            .onSuccess((res) => {
                setSelectedItems(s => ({ ...s, projectMembers: res.data?.data?.members || [] }));
                memberRef?.current?.isSelected2(userItem?.assignees);
            }).onFailure((err)=>console.log('EMployee ',err)).call();
    };

    useEffect(() => {
        if (isUpdated) {
            getSetEditValue();
        }
    }, []);

    useEffect(() => {
        if (isUpdated && userItem?.directories) {
            const preselectedPdfs = userItem.directories
                .filter((dir) => dir?._id?._id && dir._id?.title)
                .map((dir) => dir._id);
            setPdf(preselectedPdfs);
            setSubFolderVisisble(true); // Ensure File not found shows if no PDFs
        }
    }, [isUpdated, userItem]);

    const setOthersValue = (id, id2, key) => {
        let params = {};
        if (selectedItems.projectState) {
            params = { project_id: id };
        }
        if (selectedItems.folderState) {
            params = { project_id: id, parent_id: id2 };
        }
        if (selectedItems.subFolderState) {
            params = { project_id: id, parent_id: id2 };
        }
        request(`directories`, 'GET')
            .withParams(params)
            .withOutToast()
            .withLoader()
            .onSuccess((res) => {
                if (key === 'Folder') {
                    setPdf([]);
                    setEmployee([]);
                    setState((s) => ({ ...s, project: id, root_directory: 0, sub_directory: 0 }));
                    setSelectedItems((s) => ({
                        ...s,
                        selectFolder: res.data?.data || [],
                        selectSubFolder: [],
                        selectPdf: [],
                        folderState: true,
                        subFolderState: false,
                    }));
                    folderRef.current?.emptyState();
                    subFolderRef.current?.emptyState();
                    memberRef.current?.emptyState();
                    setVisibleSubFolder(false);
                    setSubFolderVisisble(false);
                    request(`projects/${id}`, 'GET')
                        .withOutToast()
                        .withLoader()
                        .onSuccess((res) => {
                            setSelectedItems((s) => ({
                                ...s,
                                projectMembers: res.data?.data?.members || [],
                            }));
                        })
                        .call();
                } else if (key === 'subFolder') {
                    setSelectedItems((s) => ({
                        ...s,
                        selectSubFolder: res.data?.data || [],
                        // selectPdf: res.data?.data || [],
                        subFolderState: true,
                    }));
                    subFolderRef.current?.emptyState();
                    request(`directories`, 'GET')
                        .withParams({ project_id: id, parent_id: id2 })
                        .withOutToast()
                        .withLoader()
                        .onSuccess((res) => {
                            setSelectedItems((s) => ({ ...s, selectPdf: res.data?.data || [], subFolderState: true }));
                        })
                    // .call();
                }
            })
            .onFailure((res) => { })
            .call();
    };

    const Submit = (data) => {
        const newErrors = {
            projectName: !selectedItems.selectProjectName,
            folder: selectedItems.selectFolder.length <= 0,
            subFolder: selectedItems.selectSubFolder.length <= 0 || !state.sub_directory,
            assignee: isEmployee.length <= 0
        };
        const subFolderVal = subFolderRef.current?.selectedItem()

        setErrors(newErrors);
        if (Object.values(newErrors).some(error => error)) {
            showToast({ type: 'danger', message: 'Please fill all required fields' });
            return;
        }
        if (dateState.startDate > dateState.endDate) {
            return showToast({ type: 'danger', message: 'Start date must be less than end date' });
        }
        if (!!!subFolderVal?.length) {
            showToast({ type: 'danger', message: 'Sub folder is required' });
            return;
        }
        const checkEmp = isEmployee?.filter((item) => user1.user?._id !== item?._id?._id);
        if (!!!checkEmp?.length) {
            showToast({ type: 'danger', message: 'Please select a assignee' });
            return;
        }
        if (!!!isPdf?.length) {
            showToast({ type: 'danger', message: 'Please select a PDF file' });
            return;
        }

        const formData = new FormData();
        isEmployee.map((item) => (
            formData.append('assignees[]', !!isUpdated && item?._id?._id ? item?._id?._id : item?._id)
        ));
        isPdf.map((item) => (
            formData.append('directories[]', item?._id)
        ));
        


        if (!!isUpdated) {
            isPdf2.map((item) => (
                formData.append('_assignees[]', item?._id)
            ));
        }
        formData.append('title', data?.Title);
        formData.append('project_id', selectedItems?.selectProjectId);
        formData.append('root_directory', state?.root_directory);
        formData.append('sub_directory', state?.sub_directory);
        formData.append('start_at', dateFormat(data?.start_at));
        formData.append('end_at', dateFormat(data?.due_at));
        formData.append('description', data?.Description);

        // return

        // console.log('SELECT ITEMS', selectedItems)
        return request(!!isUpdated ? `tasks/${userItem?._id}` : `tasks`, !!isUpdated ? 'patch' : 'post')
            .withBody(formData)
            .onSuccess((response) => {
                console.log('response=====>', { response });
                props.navigation.pop(2);
            }).onFailure((error) => {
                console.log('response=====>', { error });
            })
            .call();
    };

    const nameFolder = selectedItems?.selectFolder.filter(s => s?._id == state?.root_directory).map(s => s?.title);
    const nameeee = selectedItems?.selectSubFolder.filter(s => s?._id == state?.sub_directory).map(s => s?.title);

    if (!!isUpdated && !!isLoader) {
        console.log('Loading edit data...');
        return <Block style={{flex:1,alignItems:'center',justifyContent:'center'}} align='center'><ActivityIndicator size={'large'} color={Colors.primary} /></Block>;
    }
    const getPdf = (projectId, subFolderId) => {
        request(`directories`, 'GET')
            .withParams({ project_id: projectId, parent_id: subFolderId })
            .withOutToast()
            .withLoader()
            .onSuccess((res) => {
                // console.log('setOthersValue pdfpdfpdf:', res.data?.data);
                setSelectedItems((s) => ({ ...s, selectPdf: res.data?.data || [], subFolderState: true }));
            })
            .call();
    }
    return (
        <Block flex gradient={[Colors.background, Colors.textBackground]}>
            <Form onSubmit={Submit}>
                {({ register, loading, submit }) => (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Block margin={{ Horizontal: Metrics.iPadHeightRatio(12) }}>
                            <TextInput
                                {...register({ id: "Title" })}
                                value={userItem?.title}
                                label="Task Title"
                                type="Text"
                                maxLength={48}
                                key={userItem ? userItem : ""}
                                style={{}}
                            />
                            <CheckBox
                                ref={projectRef}
                                data={projectName}
                                request={request('projects','GET')}
                                open={isUpdated ? false : true}
                                label='Project Name'
                                errortxt='Project Name'
                                title={selectedItems.selectProjectName}
                                error={errors.projectName}
                                onChange={(item) => {
                                    setSelectedItems(s => ({ ...s, selectProjectId: item._id, selectProjectName: item?.title, folderState: true, projectMembers: item?.members }));
                                    setOthersValue(item._id, null, 'Folder');
                                    setSubFolderVisisble(false);
                                    setErrors(e => ({ ...e, projectName: false }));
                                }}
                            />
                            <CheckBox
                                ref={folderRef}
                                data={selectedItems.selectFolder}
                                title={nameFolder[0] || ''}
                                error={errors.folder}
                                open={selectedItems.selectProjectName === '' ? false : true}
                                label='Select Folder'
                                errortxt='Folder'
                                onChange={(item) => {
                                    setOthersValue(selectedItems.selectProjectId, item._id, 'subFolder');
                                    setSelectedItems(s => ({ ...s, subFolderState: true }));
                                    setState(s => ({ ...s, root_directory: item?._id }));
                                    setVisibleSubFolder(true);
                                    setErrors(e => ({ ...e, folder: false }));
                                }}

                            />
                            <CheckBox
                                ref={subFolderRef}
                                data={selectedItems.selectSubFolder}
                                label='Select Sub Folder'
                                 errortxt='Sub folder'
                                open={visibleSubFolder ? true : false}
                                error={errors.subFolder}
                                title={nameeee?.[0] || ''}
                                onChange={(item) => {
                                    setOthersValue(selectedItems.selectProjectId, item._id);
                                    setState(s => ({ ...s, sub_directory: item?._id }));
                                    setSubFolderVisisble(true);
                                    setErrors(e => ({ ...e, subFolder: false }));
                                    getPdf(selectedItems.selectProjectId, item._id)
                                    setPdf([]);
                                }}
                            />
                            <CheckBox
                                data={selectedItems.projectMembers.filter((item) => user1.user?._id !== item?._id) || []}
                                initData={userItem?.assignees.filter((item) => user1.user?._id !== item?._id) || []}
                                label='Select Assignee'
                                errortxt={'Assignee'}
                                open={selectedItems.selectProjectName === '' ? false : true}
                                ref={memberRef}
                                error={errors.assignee}
                                onChange={(item) => {
                                    if (!!isUpdated) {
                                        const isAvailable = isEmployee.map((item) => item?._id?._id).includes(item?._id);
                                        if (isAvailable) {
                                            setEmployee(s => {
                                                return s.filter(s => s._id?._id !== item?._id);
                                            });
                                            setPdf2(s => {
                                                return [...s, item];
                                            });
                                        } else {
                                            setPdf2(s => {
                                                return s.filter(s => s._id !== item?._id);
                                            });
                                            setEmployee(s => {
                                                const available = s.some(s => s._id == item?._id);
                                                if (available) {
                                                    return s.filter(s => s._id !== item?._id);
                                                } else {
                                                    return [...s, item];
                                                }
                                            });
                                        }
                                    } else {
                                        setEmployee(s => {
                                            const available = s.some(s => s._id == item?._id);
                                            if (available) {
                                                return s.filter(s => s._id !== item?._id);
                                            } else {
                                                return [...s, item];
                                            }
                                        });
                                    }
                                    setErrors(e => ({ ...e, assignee: false }));
                                }}
                            />
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {isEmployee?.map((item, index) => (
                                    user1.user?._id !== item?._id?._id && (
                                        <EmployeeTabs
                                            key={index}
                                            image={{ uri: item?.image_url || item?._id?.image_url }}
                                            name={item?.name || item?._id?.name}
                                            email={item?.email || item?._id?.email}
                                            onPress={() => {
                                                if (!isUpdated) {
                                                    memberRef.current.UnSelectMembers(item._id);
                                                    setEmployee(s => {
                                                        const isSelected = s.some((selectedItem) => selectedItem._id === item._id);
                                                        if (isSelected) {
                                                            return s.filter((selectedItem) => selectedItem._id !== item._id);
                                                        }
                                                    });
                                                }
                                            }}
                                        />
                                    )
                                ))}
                            </ScrollView>
                            <Block row width={'100%'} margin={{ Top: Platform.OS === 'ios' ? 0 : 24 }}>
                                <DateTimePicker
                                    style={{  marginRight: 3,
                                                width:Metrics.iOSPlatform? (Metrics.screenHeight / 2)-230: (Metrics.screenWidth / 2.2),
                                                color:'black'}}
                                    errorTxt={'Start Date'}
                                    label='Start Date'
                                    {...register({ id: "start_at" })}
                                    mode={"date"}
                                    key={undefined}
                                    minimumDate={new Date()}
                                    onChange={(date) => {
                                        setDateState(s => ({ ...s, startDate: date, endDate: '' }));
                                    }}
                                    value={!!userItem?.start_at ? new Date(dateFormat(userItem?.start_at)) : ""}
                                />
                                <DateTimePicker
                                    style={{ marginLeft: 3,
                                            width:Metrics.iOSPlatform? (Metrics.screenHeight / 2)-240: (Metrics.screenWidth / 2.2),
                                            color:'black'}}
                                    errorTxt={'End Date'}
                                    label='End Date'
                                    {...register({ id: "due_at" })}
                                    mode={"date"}
                                    key={dateState.startDate}
                                    minimumDate={!!dateState.startDate ? new Date(dateFormat(dateState.startDate)) : new Date()}
                                    value={!!userItem?.end_at ? new Date(dateFormat(userItem?.end_at)) : ""}
                                    onChange={(date) => {
                                        setDateState(s => ({ ...s, endDate: date }));
                                    }}
                                />
                            </Block>
                            <TextInput
                                {...register({ id: 'Description' })}
                                // returnKeyType=''
                                // returnKeyLabel='enter'
                                type='Text'
                                inputStyleContainer={{ minHeight: 150, }}
                                style={{ minHeight: 136 }}
                                label="Description"
                                // errorText={'Description is required, must be more than 2 characters'}
                                // errorText={'Description is required, must be more than 2 characters and double space is not allowed'}
                                placeholderTextColor={Colors.outlineVariant}
                                multiline
                                value={!!userItem?.description ? userItem?.description : ''}
                                returnKeyLabel='Enter'
                                enterKeyHint='enter'
                            />
<Block margin={{Bottom:36}} />

                            <Block height={Platform.OS == 'ios' && Platform.isPad ? 210 : 160} margin={{ Top: 16, Bottom: 10 }} width={'100%'} backgroundColor='white' style={{ borderColor: '#e3e3e3', borderWidth: 1, borderRadius: 10 }}>
                                <Text size='H5' font='Regular' color='outlineVariant' margin={{ Left: 10, Top: 16 }}>Select Drawing PDF</Text>
                                <ScrollView horizontal>
                                    {!!selectedItems?.selectPdf.length && selectedItems.subFolderState ?
                                        selectedItems?.selectPdf?.map((item, index) => {
                                            const available = isPdf.some(s => s._id == item?._id);
                                            return (
                                                <Block key={item._id || index}>
                                                    <Image
                                                        source={Images.icPdfFile}
                                                        style={{ height: Metrics.heightRatio(80), width: Metrics.heightRatio(75), marginLeft: 10, marginTop: 10 }}
                                                    />
                                                    <ImageButton
                                                        resizeMode="contain"
                                                        style={[styles.crossImageItem, {}]}
                                                        source={available ? Icons.icCheckbox : Icons.icUnCheckbox}
                                                        onPress={() => {
                                                            setPdf(s => {
                                                                if (available) {
                                                                    return s.filter(s => s._id !== item?._id);
                                                                } else {
                                                                    return [...s, item];
                                                                }
                                                            });
                                                        }}
                                                    />
                                                    <Text size='Body' font='Regular' padding={{ Left: 18 }} margin={{ Left: 10, Top: 6 }} style={{ width: 70 }} numberOfLines={1}>{item?.title}</Text>
                                                </Block>
                                            );
                                        }) :
                                        subFolderVisible &&
                                        <Text
                                            size='H5'
                                            font='Regular'
                                            align='center'
                                            padding={{ Left: 18 }}
                                            style={{ textAlign: 'center', textAlignVertical: 'center' }}
                                            numberOfLines={1}>
                                            {'File not found'}
                                        </Text>
                                    }
                                </ScrollView>
                            </Block>
                        </Block>
                        <Block align='bottom' flex margin={{ Horizontal: 12, Bottom: 18 }}>
                            <Button
                                label={isUpdated ? 'Update Task' : 'Add Task'}
                                loading={loading}
                                onPress={submit}
                                style={{ marginRight: 4 }}
                            />
                        </Block>
                    </ScrollView>
                )}
            </Form>
        </Block>
    );
};

export { AddTask };

const styles = StyleSheet.create({
    crossImageItem: {
        position: 'absolute',
        width: 18,
        height: 18,
        top: 5,
        bottom: 2,
        left: Platform.OS == 'ios' && Platform.isPad ? 90 : 60,
    },
});