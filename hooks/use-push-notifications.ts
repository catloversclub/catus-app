// hooks/use-push-notifications.ts
import { registerPushToken } from "@/api/domains/notification/api";
import { useErrorStore } from "@/store/error-store";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn("푸시 알림은 실제 기기에서만 동작합니다.");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "기본 알림",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const finalStatus =
    existingStatus !== "granted"
      ? (await Notifications.requestPermissionsAsync()).status
      : existingStatus;

  if (finalStatus !== "granted") {
    console.warn("푸시 알림 권한이 거부되었습니다.");
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    console.warn("Project ID를 찾을 수 없습니다.");
    return null;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return token;
}

export function usePushNotifications() {
  const showError = useErrorStore((s) => s.showError);
  useEffect(() => {
    async function setup() {
      try {
        const token = await getExpoPushToken();
        if (!token) {
          showError(
            "푸시 알림 설정 실패",
            "푸시 알림 토큰을 가져올 수 없습니다.",
          );
          return;
        }

        // 로그인 상태일 때만 서버에 등록
        const accessToken = await SecureStore.getItemAsync("accessToken");
        if (accessToken) {
          await registerPushToken(token);
        }
      } catch (e) {
        showError(
          "푸시 알림 설정 실패",
          e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.",
        );
      }
    }

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("알림 수신:", notification);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("알림 응답:", response);
      });

    setup();

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
}
