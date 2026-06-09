import { useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@tanstack/react-query";
import { useCallback } from "react";

const useRefreshQueries = (queryKeys: QueryKey[]) => {
  const queryClient = useQueryClient();
  return useCallback(
    () =>
      Promise.all(
        queryKeys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
      ),
    [queryClient, queryKeys],
  );
};

export { useRefreshQueries };
