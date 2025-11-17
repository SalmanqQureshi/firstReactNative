// AssignedTask.tsx (Optimized in a single file)

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatedTab,
  Block,
  AssignedCard,
  FlatList,
  Text,
  Icon,
  SearchBar,
  ImageButton,
  Button,
  useAuth,
  CheckBox,
} from '../../../components';
import { TabProps } from '.';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { Colors, Icons, Metrics, Sizes } from '../../../config';
import RBSheet from 'react-native-raw-bottom-sheet';
import { usePagination } from '../../../components/usePagination';
import { request } from '../../../components/ApiService';
import { DateTimePicker } from '../../../components/Form/Components/DateTimePicker';
import { _setRoomId, dateFormat } from '../../../Utility';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskList = React.memo(({ data, isFetching, renderItem }: any) => (
  // console.log('data', data),
  <FlatList
    keyExtractor={(item, index) => item.key + '' + index}
    style={styles.flatListStyle}
    contentContainerStyle={styles.flatListContentContainerStyle}
    {...data}
    showBottomLoader={isFetching && !!data.page}
    showsVerticalScrollIndicator={false}
    renderItem={renderItem}
  />
));

const RadioButton = ({ label, isSelected, onPress }: any) => (
  <Block row style={{ paddingTop: 16 }}>
    <Block align='center' style={{ alignSelf: 'center' }}>
      <ImageButton
        source={isSelected ? Icons.icRadioChecked : Icons.icRadioUnchecked}
        onPress={onPress}
      />
    </Block>
    <Text size={'H6'} font={'Regular'} margin={{ Left: 8 }} style={{ alignSelf: 'center' }}>
      {label}
    </Text>
  </Block>
);

export const AssignedTask = (props: TabProps<any>) => {
  const [Tab, setTab] = useState(1);
  const { user } = useAuth();
  const [dateState, setDateState] = useState({ startDate: '', endDate: '' });
  const refRBSheet = useRef();
  const refProjectFilter = useRef();
  const [selectedIndex, setSelectedIndex] = useState({ filterObj: 0, sortObj: 0 });
  const [indexOfFilter, setIndexOfFilter] = useState(0)
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      // ✅ Only runs when tab is tapped
      // console.log('Tab pressed – refresh data');
      setDateState({ startDate: '', endDate: '' })
      isProjectListningPending.withParams({ start_at: '', end_at: '' })
      isProjectListningProcess.withParams({ start_at: '', end_at: '' })
      isProjectListningCompleted.withParams({ start_at: '', end_at: '' })
    });
    return unsubscribe;
  }, [navigation]);




  const [projectListningPending, isProjectListningPending] = usePagination({
    request: request('tasks', 'get').withParams({ status: 'pending' }),
  });
  const [projectListningProcess, isProjectListningProcess] = usePagination({
    request: request('tasks', 'get').withParams({ status: 'in-process' }),
  });
  const [projectListningCompleted, isProjectListningCompleted] = usePagination({
    request: request('tasks', 'get').withParams({ status: 'completed' }),
  });

  const [projectName, setProjectName] = useState([{ _id: 'All', title: 'All' }]);

  useEffect(() => {
    request('projects', 'GET')
      .withOutToast()
      .withLoader()
      .onSuccess((res) => {
        setProjectName((s) => [...s, ...res?.data?.data]);
        console.log(' ...res?.data?.data', res?.data)
        if (res?.data?.data?.length > 0) {
          setTimeout(() => {
            refProjectFilter.current?.onChecked({ _id: 'All', title: 'All' });
          }, 100);
        }
      })
      .call();
  }, []);

  const sortObj = useMemo(
    () => [
      { id: 1, select: true, title: 'Most recently opened' },
      { id: 2, select: false, title: 'Alphabetically' },
      { id: 3, select: false, title: 'Newest to Oldest' },
    ],
    []
  );

  const handleProjectFilterChange = useCallback(
    (item) => {
      const projectId = item?._id === 'All' ? undefined : item?._id;
      // if (Tab === 1) {
      isProjectListningPending.withParams({ project_id: projectId });
      // } else if (Tab === 2) {
      isProjectListningProcess.withParams({ project_id: projectId });
      // } else {
      isProjectListningCompleted.withParams({ project_id: projectId });
      // }
    },
    [Tab]
  );
  const handleTaskTextChange = useCallback(
    (item) => {
      // if (Tab === 1) {
      isProjectListningPending.withParams({ keyword: item });
      // } else if (Tab === 2) {
      isProjectListningProcess.withParams({ keyword: item });
      // } else {
      isProjectListningCompleted.withParams({ keyword: item });
      // }
    },
    [Tab]
  );
  const handleAscending = useCallback(
    (item) => {
      if (Tab === 1) {
        isProjectListningPending.withParams({
          filter_by: item == 0 ? 'recently_opened' : item == 1 ? 'alphabetically' : 'dsc',
        }), refRBSheet.current?.close()
      } else if (Tab === 2) {
        isProjectListningProcess.withParams({
          filter_by: item == 0 ? 'recently_opened' : item == 1 ? 'alphabetically' : 'dsc',
        }), refRBSheet.current?.close()
      } else {
        isProjectListningCompleted.withParams({
          filter_by: item == 0 ? 'recently_opened' : item == 1 ? 'alphabetically' : 'dsc',
        }), refRBSheet.current?.close()
      }
    },
    [Tab]
  );
  console.log('====================================');
  console.log(selectedIndex, 'dsdsd');
  console.log('====================================');
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Block width={'50%'} height={88} margin={{ Right: Metrics.iPadHeightRatio(18), Top: Metrics.iPadHeightRatio(12) }}>
          <CheckBox
            ref={refProjectFilter}
            key={projectName.length}
            extraData={[{ _id: 'All', title: 'All' }]}
            // data={projectName || []}
            request={request('projects', 'GET')}
            open={true}
            label='Projects'
            onChange={handleProjectFilterChange}
          />
        </Block>
      ),
    });
  }, [projectName, handleProjectFilterChange]);

  const deleteTask = useCallback((id: string) => {
    return request(`tasks/${id}`, 'DELETE')
      .onSuccess(() => {
        isProjectListningPending.call();
        isProjectListningProcess.call();
        isProjectListningCompleted.call();
      })
      .call();
  }, []);

  const _renderHeader = useCallback(() => (
    <AnimatedTab
      value={Tab}
      onChange={setTab}
      options={[
        { label: 'New', id: 1 },
        { label: 'In Process', id: 2 },
        { label: 'Completed', id: 3 },
      ]}
    />
  ), [Tab]);

  const _renderItem = useCallback(({ item }: any) => (
    <AssignedCard
      onPress={() => {
        // AsyncStorage.setItem('_setRoomId',item?._id);
        props.navigation.navigate('TaskDetail', { refrence_key: item?._id });
      }}
      onPressDelete={() =>
        Alert.alert('Delete', 'Are you sure you want to delete this task?', [
          { text: 'No' },
          { text: 'Yes', onPress: () => deleteTask(item?._id) },
        ])
      }
      {...item}
    />
  ), []);

  return (
    <Block flex gradient={[Colors.background, Colors.textBackground]}>
      <Block backgroundColor='primary' height={54} margin={{ Horizontal: Metrics.iPadHeightRatio(16), Top: Metrics.iPadHeightRatio(24) }}>
        {_renderHeader()}
      </Block>

      <Block row margin={{ Horizontal: Metrics.iPadHeightRatio(16), Top: Metrics.iPadHeightRatio(24) }}>
        <SearchBar onChange={handleTaskTextChange} Style={{ flex: 1 }} />
        <Icon
          size={60}
          onPress={() => refRBSheet.current.open()}
          margin={{ Right: -8 }}
          name='icFilter'
        />
      </Block>

      {Tab === 1 ? (
        <TaskList data={projectListningPending} isFetching={projectListningPending.isFetching} renderItem={_renderItem} />
      ) : Tab === 2 ? (
        <TaskList data={projectListningProcess} isFetching={projectListningProcess.isFetching} renderItem={_renderItem} />
      ) : (
        <TaskList data={projectListningCompleted} isFetching={projectListningCompleted.isFetching} renderItem={_renderItem} />
      )}

      {user?.policies?.filter((res) => res.module === 'task')?.map((item, index) =>
        item?.can_create ? (
          <Icon
            key={'-' + index}
            size={54}
            style={{ position: 'absolute', right: 24, bottom: 24 }}
            onPress={() => props.navigation.navigate('AddTask')}
            margin={{ Right: -8 }}
            name='fabIconAdd'
          />
        ) : null
      )}

      <RBSheet
        ref={refRBSheet}
        openDuration={500}
        closeDuration={500}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            height: Metrics.ISPad ? (Metrics.screenHeight / 2) - 100 : Metrics.screenHeight / 2,
            backgroundColor: Colors.onSecondary,
            borderTopRightRadius: 18,
            borderTopLeftRadius: 18,
          },
        }}
      >
        <Block flex margin={{ Horizontal: 12 }}>
          <Block row margin={{ Top: Metrics.ISPad ? 12 : 24 }} width='100%'>
            <Text font='Medium' size='H3' align='center' style={{ alignSelf: 'center', flex: 1 }}>
              {'  Filters'}
            </Text>
            <ImageButton source={Icons.icClose} onPress={() => refRBSheet.current.close()} />
          </Block>

          <Block margin={{ Top: Metrics.ISPad ? 12 : 24 }}>
            <Text font='Medium' size='H5'>{'Sort By Priority'}</Text>
          </Block>

          {sortObj.map((item, index) => (
            <RadioButton
              key={index}
              label={item.title}
              isSelected={selectedIndex.sortObj === index}
              onPress={() => { setSelectedIndex((s) => ({ ...s, sortObj: index })); setIndexOfFilter(item?.id) }}
            />
          ))}

          <Block row width='100%' margin={{ Top: 24 }} flex>
            <DateTimePicker
              key={dateState.startDate?.toString() + '1'}
              style={{
                marginRight: 3,
                width: Metrics.iOSPlatform ? (Metrics.screenHeight / 2) - 230 : (Metrics.screenWidth / 2.2),
                color: 'black'
              }}
              errorTxt='Start at'
              label='Start Date'
              mode='date'
              onChange={(date) => setDateState((s) => ({ ...s, startDate: date, endDate: '' }))}
              value={dateState.startDate}
            />
            <DateTimePicker
              key={dateState.endDate?.toString() + '2'}
              style={{
                marginRight: 3,
                width: Metrics.iOSPlatform ? (Metrics.screenHeight / 2) - 230 : (Metrics.screenWidth / 2.2),
                color: 'black'
              }}
              errorTxt='due at'
              label='End Date'
              mode='date'
              minimumDate={dateState.startDate == '' ? new Date() : new Date(dateState.startDate)}
              value={dateState.endDate}
              onChange={(date) => setDateState((s) => ({ ...s, endDate: date }))}
            />
          </Block>
        </Block>
        <SafeAreaView >
          <Block row margin={{ Horizontal: 16, Bottom: Metrics.ISPad ? 16 : Metrics.ISPad ? 16 : Metrics.androidPlatform ? 16 : 0 }}>
            <Button
              label='Reset'
              onPress={() => {
                // dateState.startDate == '' && dateState.endDate == '' ?
                //   (showMessage({ message: 'Pease fill the both fields', type: 'danger' })) :
                (isProjectListningPending.withParams({ start_at: '', end_at: '' }),
                  isProjectListningProcess.withParams({ start_at: '', end_at: '' }),
                  isProjectListningCompleted.withParams({ start_at: '', end_at: '' }),
                  (setDateState({ startDate: '', endDate: '' })))
                  setSelectedIndex({
                     filterObj: 0, sortObj: 0 })
                refRBSheet.current.close();
              }}
              type='DullSecondary'
              style={{ marginRight: 4 }}
            />
          <Button
  label="Apply"
  onPress={() => {
    const hasStartDate = dateState.startDate !== '';
    const hasEndDate = dateState.endDate !== '';

    if (hasStartDate && hasEndDate) {
      // Both dates provided
      isProjectListningPending.withParams({
        start_at: dateFormat(dateState.startDate),
        end_at: dateFormat(dateState.endDate),
        filter_by: selectedIndex?.sortObj === 0
          ? 'recently_opened'
          : selectedIndex?.sortObj === 1
          ? 'alphabetically'
          : 'dsc',
      });

      isProjectListningProcess.withParams({
        start_at: dateFormat(dateState.startDate),
        end_at: dateFormat(dateState.endDate),
        filter_by: selectedIndex?.sortObj === 0
          ? 'recently_opened'
          : selectedIndex?.sortObj === 1
          ? 'alphabetically'
          : 'dsc',
      });

      isProjectListningCompleted.withParams({
        start_at: dateFormat(dateState.startDate),
        end_at: dateFormat(dateState.endDate),
        filter_by: selectedIndex?.sortObj === 0
          ? 'recently_opened'
          : selectedIndex?.sortObj === 1
          ? 'alphabetically'
          : 'dsc',
      });

      refRBSheet.current?.close();
    } else if (hasStartDate || hasEndDate) {
      // Only one date provided
      showMessage({
        message: 'Must Select Both Dates. Single Date Is Not Acceptable',
        type: 'danger',
      });
    } else {
      // No dates provided
      isProjectListningPending.withParams({
        filter_by: selectedIndex?.sortObj === 0
          ? 'recently_opened'
          : selectedIndex?.sortObj === 1
          ? 'alphabetically'
          : 'dsc',
      });

      isProjectListningProcess.withParams({
        filter_by: selectedIndex?.sortObj === 0
          ? 'recently_opened'
          : selectedIndex?.sortObj === 1
          ? 'alphabetically'
          : 'dsc',
      });

      isProjectListningCompleted.withParams({
        filter_by: selectedIndex?.sortObj === 0
          ? 'recently_opened'
          : selectedIndex?.sortObj === 1
          ? 'alphabetically'
          : 'dsc',
      });

      refRBSheet.current?.close();
    }
  }}
  style={{ marginLeft: 4 }}
/>
          </Block>
        </SafeAreaView>
      </RBSheet>
    </Block>
  );
};

const styles = StyleSheet.create({
  flatListStyle: {
    marginBottom: Metrics.heightRatio(0),
    padding: Metrics.iPadHeightRatio(Sizes.Base),
  },
  flatListContentContainerStyle: {
    gap: Sizes.Base,
    paddingBottom: Metrics.iPadHeightRatio(20),
  },
});
