// _layout.tsx
import ErrorModal from "@/components/modal/error-modal";
import { ToastProvider } from "@/components/ui/toast-provider";
import { useAuthBootstrap } from "@/hooks/auth/use-auth-redirect";
import { useAuthStore } from "@/store/auth/auth-store";
import { useErrorStore } from "@/store/error-store";
import { ROUTES } from "@/constants/route";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../styles/global.css";

SplashScreen.preventAutoHideAsync();

const AppContent = () => {
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

  // 토큰 존재 확인 + 서버 검증 → store에 상태 기록
  useAuthBootstrap();
  const authStatus = useAuthStore((s) => s.status);

  // 폰트와 auth 둘 다 결정될 때까지 splash 유지
  const isReady = fontsLoaded && authStatus !== "unknown";

  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!isReady || hasNavigated.current) return;
    hasNavigated.current = true;
    SplashScreen.hideAsync();
    if (authStatus === "authenticated") {
      router.replace(ROUTES.TABS.INDEX);
    } else {
      router.replace(ROUTES.AUTH.INDEX);
    }
  }, [isReady, authStatus]);

  if (!isReady) return null;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="post" />
            </Stack>
            <ErrorModal />
          </BottomSheetModalProvider>
          <PortalHost />
        </GestureHandlerRootView>
      </QueryClientProvider>
      <ToastProvider />
    </>
  );
}

const RootLayout = () => {
  return <AppContent />;
}

export default RootLayout;
