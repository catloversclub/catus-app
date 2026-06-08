import { apiClient } from "@/api/client";
import { Platform } from "react-native";
import {
  DeleteNotificationResponse,
  GetNotificationsParams,
  Notification,
  NotificationSettings,
  PushToken,
  TestNotificationResponse,
} from "./types";

const BASE_URL = "/notification";

const NOTI_ENDPOINTS = {
  BASE: BASE_URL,
  DETAIL: (id: string) => `${BASE_URL}/${id}`,
  PUSH_TOKEN: `${BASE_URL}/push-token`,
  PUSH_TOKEN_DETAIL: (token: string) => `${BASE_URL}/push-token/${token}`,
  SETTINGS: `${BASE_URL}/settings`,
  TEST: `${BASE_URL}/test`,
} as const;

export const registerPushToken = async (
  expoPushToken: string,
): Promise<PushToken> => {
  const { data } = await apiClient.post<PushToken>(NOTI_ENDPOINTS.PUSH_TOKEN, {
    token: expoPushToken,
    platform: Platform.OS as "ios" | "android",
  });
  return data;
};

export const getPushToken = async (token: string): Promise<PushToken> => {
  const { data } = await apiClient.get<PushToken>(
    NOTI_ENDPOINTS.PUSH_TOKEN_DETAIL(token),
  );
  return data;
};

export const updatePushToken = async (
  token: string,
  enabled: boolean,
): Promise<{ token: string; enabled: boolean }> => {
  const { data } = await apiClient.patch<{ token: string; enabled: boolean }>(
    NOTI_ENDPOINTS.PUSH_TOKEN_DETAIL(token),
    { enabled },
  );
  return data;
};

export const getNotifications = async (
  params: GetNotificationsParams = {},
): Promise<Notification[]> => {
  const { data } = await apiClient.get<Notification[]>(NOTI_ENDPOINTS.BASE, {
    params,
  });
  return data;
};

export const deleteNotification = async (
  id: string,
): Promise<DeleteNotificationResponse> => {
  const { data } = await apiClient.delete<DeleteNotificationResponse>(
    NOTI_ENDPOINTS.DETAIL(id),
  );
  return data;
};

export const testNotification = async (): Promise<TestNotificationResponse> => {
  const { data } = await apiClient.post<TestNotificationResponse>(
    NOTI_ENDPOINTS.TEST,
  );
  return data;
};

export const getNotificationSettings =
  async (): Promise<NotificationSettings> => {
    const { data } = await apiClient.get<NotificationSettings>(
      NOTI_ENDPOINTS.SETTINGS,
    );
    return data;
  };

export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>,
): Promise<NotificationSettings> => {
  const { data } = await apiClient.patch<NotificationSettings>(
    NOTI_ENDPOINTS.SETTINGS,
    settings,
  );
  return data;
};
