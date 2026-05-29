import { create } from "zustand";

/**
 * 앱 부팅 시 결정되는 인증 상태.
 * - unknown: 아직 토큰 확인/검증 전 (splash 유지)
 * - authenticated: 토큰이 있고, 서버 검증도 통과
 * - unauthenticated: 토큰이 없거나 무효
 */
export type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

interface AuthStore {
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  status: "unknown",
  setStatus: (status) => set({ status }),
}));
