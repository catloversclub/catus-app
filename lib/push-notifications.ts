import {
  registerPushToken,
  setPushTokenEnabled,
} from "@/api/domains/notification/api";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type PushPlatform = "ios" | "android";

const ANDROID_NOTIFICATION_CHANNEL_ID = "default";
const REGISTERED_PUSH_TOKEN_KEY = "registeredPushToken";

const getPushPlatform = (): PushPlatform | null => {
  if (Platform.OS === "ios" || Platform.OS === "android") return Platform.OS;
  return null;
};

const ensureAndroidNotificationChannel = async () => {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(
    ANDROID_NOTIFICATION_CHANNEL_ID,
    {
      name: "기본 알림",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    },
  );
};

const getExpoProjectId = () =>
  Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

const getDevicePushToken = async ({
  requestPermission,
}: {
  requestPermission: boolean;
}): Promise<string | null> => {
  if (!Device.isDevice) {
    console.warn("푸시 알림은 실제 기기에서만 동작합니다.");
    return null;
  }

  const platform = getPushPlatform();
  if (!platform) return null;

  await ensureAndroidNotificationChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const finalStatus =
    existingStatus !== "granted" && requestPermission
      ? (await Notifications.requestPermissionsAsync()).status
      : existingStatus;

  if (finalStatus !== "granted") {
    console.warn("푸시 알림 권한이 거부되었습니다.");
    return null;
  }

  const projectId = getExpoProjectId();
  if (!projectId) {
    console.warn("Project ID를 찾을 수 없습니다.");
    return null;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return token;
};

export const registerCurrentDevicePushToken = async () => {
  const token = await getDevicePushToken({ requestPermission: true });
  const platform = getPushPlatform();

  if (!token || !platform) return null;

  const registered = await registerPushToken({ token, platform });
  await SecureStore.setItemAsync(REGISTERED_PUSH_TOKEN_KEY, token);

  return registered;
};

export const disableCurrentDevicePushToken = async () => {
  const token =
    (await SecureStore.getItemAsync(REGISTERED_PUSH_TOKEN_KEY)) ??
    (await getDevicePushToken({ requestPermission: false }));

  if (!token) return null;

  const disabled = await setPushTokenEnabled(token, false);
  await SecureStore.deleteItemAsync(REGISTERED_PUSH_TOKEN_KEY);

  return disabled;
};
