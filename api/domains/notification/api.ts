import { apiClient } from "@/api/client";
import { Platform } from "react-native";

const BASE_URL = "/notification";

const NOTI_ENDPOINTS = {
  PUSH_TOKEN: `${BASE_URL}/push-token`,
  TEST: `${BASE_URL}/test`,
} as const;

export const registerPushToken = async (
  expoPushToken: string,
): Promise<void> => {
  await apiClient.post(NOTI_ENDPOINTS.PUSH_TOKEN, {
    token: expoPushToken,
    platform: Platform.OS as "ios" | "android",
  });
};

export const testNotification = async (): Promise<void> => {
  await apiClient.post(NOTI_ENDPOINTS.TEST);
};
