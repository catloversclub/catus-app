import { registerCurrentDevicePushToken } from "@/lib/push-notifications";
import { useErrorStore } from "@/store/error-store";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const showError = useErrorStore((s) => s.showError);

  useEffect(() => {
    async function setup() {
      try {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        if (accessToken) {
          await registerCurrentDevicePushToken();
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
  }, [showError]);
}
