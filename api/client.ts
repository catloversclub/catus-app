// src/api/client.ts
import { API_BASE_URL } from "@/constants/api";

import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

// 🌟 1. 토큰이 필요 없는 공개 API용 인스턴스 (로그인, 회원가입 등)
export const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🌟 2. 토큰이 필요한 인증 API용 인스턴스 (기존 코드와 동일)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor (요청 시 토큰 삽입)
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status === 401) {
    console.log("401 에러 발생, 어떤 API:", error.config.url); // ✅ 추가
    const newToken = await refreshToken();
    error.config.headers.Authorization = `Bearer ${newToken}`;
    return apiClient(error.config);
  }
  throw error;
});

// 토큰 갱신 진행 여부 및 대기열 관리
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const refreshToken = async () => {
  if (isRefreshing) {
    // 이미 갱신 중이면 완료될 때까지 대기
    return new Promise<string>((resolve) => {
      addRefreshSubscriber(resolve);
    });
  }

  isRefreshing = true;

  try {
    const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");

    if (!storedRefreshToken) throw new Error("Refresh Token이 없습니다.");

    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: storedRefreshToken,
    });

    const newAccessToken = data.accessToken;
    const newRefreshToken = data.refreshToken;

    await SecureStore.setItemAsync("accessToken", newAccessToken);
    if (newRefreshToken) {
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
    }

    onTokenRefreshed(newAccessToken);
    return newAccessToken;
  } catch (e) {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    router.replace("/(auth)/login");
    throw e;
  } finally {
    isRefreshing = false;
  }
};
