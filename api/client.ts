import { API_BASE_URL, STORAGE_BASE_URL } from "@/constants/api";
import { tokenStorage } from "@/lib/token";
import axios from "axios";
import { router } from "expo-router";

const TIMEOUT = 10000;
const STORAGE_TIMEOUT = 30000;

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
    const storedRefreshToken = await tokenStorage.getRefresh();
    if (!storedRefreshToken) throw new Error("Refresh Token이 없습니다.");

    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: storedRefreshToken,
    });

    await tokenStorage.setTokens(data.accessToken, data.refreshToken);

    refreshSubscribers.forEach((cb) => cb(data.accessToken));
    return data.accessToken;
  } catch (e) {
    await tokenStorage.clearTokens();
    router.replace("/(auth)");
    throw e;
  } finally {
    isRefreshing = false;
    refreshSubscribers = [];
  }
};

// ─── apiClient 인터셉터 ───────────────────────────────────

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccess();
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

publicClient.interceptors.response.use(undefined, async (error) => {
  console.error("Public 요청 에러:", {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    data: error.response?.data,
  });
});
