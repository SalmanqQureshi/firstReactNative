import {useCallback, useMemo, useRef, useState} from 'react';
import {RefreshControl} from 'react-native';
import {ApiType} from '../ApiService';
import {Colors} from '../../config';
import {useFocusEffect} from '@react-navigation/native';

interface usePaginationOptions {
  request: ApiType;
}

type usePaginationType = (options: usePaginationOptions) => [
  {
    data: any[];
    refreshControl: React.JSX.Element;
    onEndReached: () => void;
  },
  ApiType,
];

export const usePagination: usePaginationType = ({request}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [pages, setPage] = useState<
    {
      data: any[];
      pagination: {
        total: number;
        perPage: number;
        currentPage: number;
        prev: number;
        next: number;
      };
    }[]
  >([]);

  const Api = useRef(
    request?.withOutToast()
      .onFailure(() => {
        setPage([
          {
            data: [],
            pagination: {},
          },
        ]);
      })
      .onRequest(() => setIsFetching(true))
      .onSuccess(data => {
        console.log('data===========================data' ,data)
        setIsFetching(false);
        setPage(s =>
          data.data.pagination?.currentPage == 1
            ? [data.data]
            : s.filter(s=>s.pagination.currentPage!=data.data.pagination.currentPage).concat([data.data]),
        );
      })
      .trackParams(),
  ).current;
  const data = useMemo(() => pages.flatMap(s => s.data), [pages]);
  useFocusEffect(
    useCallback(() => {
      Api?.withParams({
        page: 1,
      }).call();
    }, []),
  );
  return [
    {
      data,
      refreshControl: (
        <RefreshControl
          refreshing={!!pages.length && isFetching}
          onRefresh={() => {
            setIsFetching(true);
            Api?.withParams({
              page: 1,
            });
          }}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      ),
      isFetching,
      onEndReached: () => {
        console.log('pages=================>',pages);
        
        if (
          !!pages.length &&
          pages[pages.length - 1].data.length ==
            pages[pages.length - 1]?.pagination?.perPage
        ) {
          Api.withParams({
            page: pages[pages.length - 1]?.pagination?.next,
          });
        }
      },
      emptyListProps: {
        firstFetch: !pages.length,
      },
      page:pages[pages.length - 1]?.pagination.currentPage
    },
    Api,
  ];
};
