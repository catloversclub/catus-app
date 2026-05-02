import { apiClient, publicClient } from "@/api/client";
import { tokenStorage } from "@/lib/token";
import { OidcExchangeRequest, OidcExchangeResponse } from "./types";

const BASE_URL = "/auth";

const AUTH_ENDPOINTS = {
  OIDC_EXCHANGE: `${BASE_URL}/oidc/exchange`,
  LOGOUT: `${BASE_URL}/logout`,
  REFRESH: `${BASE_URL}/refresh`,
} as const;

// 로그인 (OIDC 교환) - 토큰이 없으므로 publicClient 사용
const exchangeOidcToken = async (
  payload: OidcExchangeRequest,
): Promise<OidcExchangeResponse> => {
  const { data } = await publicClient.post<OidcExchangeResponse>(
    AUTH_ENDPOINTS.OIDC_EXCHANGE,
    payload,
  );
  return data;
};

export const exchangeAndSaveTokens = async (
  payload: OidcExchangeRequest,
): Promise<OidcExchangeResponse> => {
  const data = await exchangeOidcToken(payload);
  await tokenStorage.setTokens(
    data.accessToken,
    data.refreshToken ?? undefined,
  );
  return data;
};

// 로그아웃 - 헤더에 AccessToken이 필요하므로 apiClient 사용
export const logoutUser = async (refreshToken: string): Promise<void> => {
  await apiClient.post(AUTH_ENDPOINTS.LOGOUT, { refreshToken });
};
