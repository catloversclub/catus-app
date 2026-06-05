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

let mockNotificationSettings: NotificationSettings = {
  all: true,
  likes: true,
  comments: true,
  replies: true,
  newFollowers: true,
  marketing: true,
};

const waitMockResponse = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 150);
  });

export const getNotificationSettings =
  async (): Promise<NotificationSettings> => {
    await waitMockResponse();
    return { ...mockNotificationSettings };
  };

export const updateNotificationSettings = async (
  settings: NotificationSettings,
): Promise<NotificationSettings> => {
  await waitMockResponse();
  mockNotificationSettings = { ...settings };
  return { ...mockNotificationSettings };
};
