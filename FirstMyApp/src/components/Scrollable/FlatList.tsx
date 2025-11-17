import React, { forwardRef } from 'react';
import {
  FlatListProps,
  FlatList as FlatListBase,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../config';
import { ListEmptyComponent } from './EmptyComponents';

interface Props<ItemT> extends FlatListProps<ItemT> {
  page?: boolean;
  tab?: boolean;
  showBottomLoader?: boolean;
}

// ✅ forward ref properly
export const FlatList = forwardRef(<ItemT,>(
  props: Props<ItemT>,
  ref: React.Ref<FlatListBase<ItemT>>
) => {
  return (
    <FlatListBase
      showsHorizontalScrollIndicator={!props.page}
      showsVerticalScrollIndicator={!props.page}
      {...props}
      ref={ref} // ✅ now the parent gets the real FlatListBase ref
      ListEmptyComponent={() => <ListEmptyComponent />}
      contentContainerStyle={
        props?.data?.length <= 0
          ? { flex: 1, justifyContent: 'center' }
          : { ...props.contentContainerStyle }
      }
      ListFooterComponent={
        props.showBottomLoader && <ActivityIndicator size="large" />
      }
      style={[props.style, !!props.page && style.page]}
    />
  );
});

const style = StyleSheet.create({
  // page: {flex: 1, padding: 16, backgroundColor: Colors.background},
});
