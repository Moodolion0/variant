import { useCallback, useMemo, useState } from 'react';

export interface FetcherResult<T> {
  items: T[];
  nextPageParam: number | null;
}

// Lightweight simulated useInfiniteFetchQuery for local/demo data
// fetcher: async ({ pageParam, pageSize }) => Promise<FetcherResult<T>>
export default function useInfiniteFetchQuery<T>(
  fetcher: (opts: { pageParam: number; pageSize: number }) => Promise<FetcherResult<T>>,
  { initialPageParam = 0, pageSize = 12 }: { initialPageParam?: number; pageSize?: number } = {}
) {
  const [pages, setPages] = useState<T[][]>([]);
  const [pageParams, setPageParams] = useState<number[]>([initialPageParam]);
  const [isFetchingNextPage, setFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchPage = useCallback(async (pageParam: number) => {
    const res = await fetcher({ pageParam, pageSize });
    return res;
  }, [fetcher, pageSize]);

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    setFetchingNextPage(true);
    try {
      const currentPage = pageParams[pageParams.length - 1];
      const nextParam = currentPage + 1;
      const res = await fetchPage(nextParam);
      setPages((prev) => [...prev, res.items]);
      if (res.nextPageParam == null) {
        setHasNextPage(false);
      } else {
        // nextPageParam is guaranteed non-null here
        setPageParams((prev) => [...prev, res.nextPageParam!]);
      }
    } catch (e) {
      console.warn('useInfiniteFetchQuery fetchNextPage failed', e);
      setHasNextPage(false);
    } finally {
      setFetchingNextPage(false);
    }
  }, [fetchPage, hasNextPage, isFetchingNextPage, pageParams]);

  const refetch = useCallback(async () => {
    // reset and fetch first page
    setPages([]);
    setPageParams([initialPageParam]);
    setHasNextPage(true);
    setFetchingNextPage(true);
    try {
      const res = await fetchPage(initialPageParam);
      setPages([res.items]);
      if (res.nextPageParam == null) setHasNextPage(false);
      else setPageParams([initialPageParam, res.nextPageParam!]);
    } catch (e) {
      console.warn('useInfiniteFetchQuery refetch failed', e);
      setHasNextPage(false);
    } finally {
      setFetchingNextPage(false);
    }
  }, [fetchPage, initialPageParam]);

  // initial fetch
  useMemo(() => {
    (async () => {
      try {
        const res = await fetchPage(initialPageParam);
        setPages([res.items]);
        if (res.nextPageParam == null) setHasNextPage(false);
        else setPageParams([initialPageParam, res.nextPageParam!]);
      } catch (e) {
        console.warn('useInfiniteFetchQuery initial fetch failed', e);
        setHasNextPage(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(() => ({ pages, pageParams }), [pages, pageParams]);

  return { data, fetchNextPage, isFetchingNextPage, hasNextPage, refetch };
}
