import { useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@tanstack/react-query";
import { useCallback, useState } from "react";

const useRefreshQueries = (queryKeys: QueryKey[]) => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(
        queryKeys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
      );
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, queryKeys]);

  return { onRefresh, refreshing };
};

export { useRefreshQueries };
