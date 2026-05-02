// _layout.tsx
import ErrorModal from "@/components/modal/error-modal";
import { useAuthRedirect } from "@/hooks/auth/use-auth-redirect";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useErrorStore } from "@/store/error-store";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../styles/global.css";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const showError = useErrorStore((s) => s.showError);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (error: Error) => {
              const message =
                error instanceof AxiosError
                  ? (error.response?.data?.message ?? error.message)
                  : error.message;
              showError("오류가 발생했어요", message);
            },
          },
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
    [],
  );

  useReactQueryDevTools(queryClient);

  const [fontsLoaded] = useFonts({
    SpaceMono: require("@/assets/fonts/PretendardVariable.ttf"),
  });

  useAuthRedirect(fontsLoaded);
  usePushNotifications();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="post" />
          </Stack>
          <ErrorModal />
        </BottomSheetModalProvider>
        <PortalHost />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return <AppContent />;
}
