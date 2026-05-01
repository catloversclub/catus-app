import { API_BASE_URL, STORAGE_BASE_URL } from "@/constants/api";
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const TIMEOUT = 10000; // 10초
const STORAGE_TIMEOUT = 30000; // 30초

// ─── 클라이언트 생성 ───────────────────────────────────────

export const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

export const storageClient = axios.create({
  baseURL: STORAGE_BASE_URL,
  timeout: STORAGE_TIMEOUT,
});

// ─── 토큰 갱신 ────────────────────────────────────────────

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const getNewAccessToken = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise<string>((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!storedRefreshToken) throw new Error("Refresh Token이 없습니다.");

    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: storedRefreshToken,
    });

    await SecureStore.setItemAsync("accessToken", data.accessToken);
    if (data.refreshToken) {
      await SecureStore.setItemAsync("refreshToken", data.refreshToken);
    }

    refreshSubscribers.forEach((cb) => cb(data.accessToken));
    return data.accessToken;
  } catch (e) {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    router.replace("/(auth)");
    throw e;
  } finally {
    isRefreshing = false;
    refreshSubscribers = [];
  }
};

// ─── apiClient 인터셉터 ───────────────────────────────────

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(undefined, async (error) => {
  console.error("API 요청 에러:", {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    data: error.response?.data,
  });
  if (error.response?.status !== 401) throw error;

  const newToken = await getNewAccessToken();
  error.config.headers.Authorization = `Bearer ${newToken}`;
  return apiClient(error.config);
});

storageClient.interceptors.response.use(undefined, async (error) => {
  console.error("Storage 요청 에러:", {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    data: error.response?.data,
  });
  throw error;
});
