"use client";

import { useCallback, useEffect, useState } from "react";

type FetchResult<T> = {
  success: boolean;
  data: T;
};

type UseRefreshableResourceParams<T> = {
  fetcher: () => Promise<FetchResult<T>>;
  fetchErrorMessage: string;
  requestErrorMessage: string;
};

export const useRefreshableResource = <T>({
  fetcher,
  fetchErrorMessage,
  requestErrorMessage,
}: UseRefreshableResourceParams<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const result = await fetcher();
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(fetchErrorMessage);
      }
    } catch {
      setError(requestErrorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetcher, fetchErrorMessage, requestErrorMessage]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data,
    loading,
    error,
    refresh,
  };
};
