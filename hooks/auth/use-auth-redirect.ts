// hooks/use-auth-redirect.ts
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export function useAuthRedirect(fontsLoaded: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!fontsLoaded) return;

    async function redirect() {
      try {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (accessToken && refreshToken) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)");
        }
      } catch (e) {
        console.warn(e);
      }
    }

    redirect();
  }, [fontsLoaded]);
}
