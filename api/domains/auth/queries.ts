import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { login as kakaoLogin } from "@react-native-seoul/kakao-login";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { AuthProvider } from "@/api/domains/auth/types";
import { ROUTES } from "@/constants/route";
import { tokenStorage } from "@/lib/token";
import { useOidcStore } from "@/store/auth/oidc-store";
import { exchangeAndSaveTokens, logoutUser } from "./api";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

export const useLogin = () => {
  const { setOidc } = useOidcStore();
  // const showError = useErrorStore((s) => s.showError);

  return useMutation({
    mutationFn: async (provider: AuthProvider) => {
      let idToken: string | null = null;

      switch (provider) {
        case "kakao":
          const kakaoRes = await kakaoLogin();
          idToken = kakaoRes.idToken;
          break;
        case "google":
          await GoogleSignin.hasPlayServices();
          const googleRes = await GoogleSignin.signIn();
          if (isSuccessResponse(googleRes)) {
            idToken = googleRes.data.idToken;
            // 디버깅용
            // showError("Google 로그인 실패", JSON.stringify(googleRes));
          }
          break;
        case "apple":
          const appleRes = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          idToken = appleRes.identityToken;
          break;
      }

      if (!idToken) return;
      // throw new Error(`${provider}의 idToken을 가져오지 못했습니다.`);
      setOidc(idToken, provider);

      return await exchangeAndSaveTokens({ idToken, provider });
    },

    onSuccess: async (data) => {
      if (!data) throw new Error("로그인이 실패하였습니다. 다시 시도해주세요.");

      await tokenStorage.setTokens(
        data.accessToken,
        data.refreshToken ?? undefined,
      );

      if (data.onboardingRequired) {
        router.push(ROUTES.AUTH.ONBOARDING.INDEX);
      } else {
        router.replace(ROUTES.TABS.INDEX);
      }
    },

    onError: () => {
      return;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearOidc } = useOidcStore();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    },

    onSettled: async () => {
      await tokenStorage.clearTokens();

      // 모든 캐시 무효화 (다른 유저 정보 노출 방지)
      queryClient.clear();
      clearOidc();

      router.replace(ROUTES.AUTH.INDEX);
    },
  });
};
