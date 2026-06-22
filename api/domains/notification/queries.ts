import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import {
  deleteNotification,
  getNotificationSettings,
  getNotifications,
  getPushToken,
  registerPushToken,
  setPushTokenEnabled,
  updateNotificationSettings,
} from "./api";
import { NotificationSettings, PushToken } from "./types";

const DEFAULT_TAKE = 20;

export const notificationKeys = {
  all: ["notification"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  settings: () => [...notificationKeys.all, "settings"] as const,
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

export const useNotificationSettingsQuery = () => {
  return useQuery({
    queryKey: notificationKeys.settings(),
    queryFn: getNotificationSettings,
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
    mutationFn: (payload: Pick<PushToken, "token" | "platform">) =>
      registerPushToken(payload),
  });
};

export const useUpdateNotificationSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<NotificationSettings>) =>
      updateNotificationSettings(settings),
    onSuccess: (settings) => {
      queryClient.setQueryData(notificationKeys.settings(), settings);
    },
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
    }) => setPushTokenEnabled(token, enabled),
  });
};
