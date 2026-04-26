import { registerPushToken } from "@/api/domains/notification/api";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    SpaceMono: require("@/assets/fonts/PretendardVariable.ttf"),
  });

  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    [],
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token),
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? []),
      );
    }
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    async function doAsyncStuff() {
      try {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        const { status } = await Notifications.requestPermissionsAsync();

        if (accessToken && refreshToken) {
          // 로그인 상태일 때만 푸시 토큰 등록
          if (status === "granted" && expoPushToken) {
            await registerPushToken(expoPushToken);
          }
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    if (fontsLoaded) doAsyncStuff();
  }, [fontsLoaded, expoPushToken]);

  // isReady 제거, fontsLoaded만 체크
  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="post" />
          </Stack>
        </BottomSheetModalProvider>
        <PortalHost />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "A channel is needed for the permissions prompt to appear",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
