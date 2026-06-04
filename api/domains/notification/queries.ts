import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import {
  deleteNotification,
  getNotifications,
  getPushToken,
  registerPushToken,
  updatePushToken,
} from "./api";

const DEFAULT_TAKE = 20;

export const notificationKeys = {
  all: ["notification"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  pushToken: (token: string) =>
    [...notificationKeys.all, "pushToken", token] as const,
};

export const useNotificationsQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: notificationKeys.list(),
    queryFn: ({ pageParam }) =>
      getNotifications({
        take: DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < DEFAULT_TAKE) return undefined;
      return lastPage[lastPage.length - 1].id;
    },
  });
};

export const useGetPushTokenQuery = (token: string, enabled: boolean) => {
  return useQuery({
    queryKey: notificationKeys.pushToken(token),
    queryFn: () => getPushToken(token),
    enabled: enabled && token.length > 0,
  });
};

export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
};

export const useRegisterPushTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) => registerPushToken(token),
  });
};

export const useUpdatePushTokenMutation = () => {
  return useMutation({
    mutationFn: ({
      token,
      enabled,
    }: {
      token: string;
      enabled: boolean;
    }) => updatePushToken(token, enabled),
  });
};
