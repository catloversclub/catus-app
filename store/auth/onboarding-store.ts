import { create } from "zustand";

/**
 * 온보딩 진행 중에만 의미있는 세션 상태.
 * - currentNickname이 null이면 아직 createUser가 호출되지 않음 (create 모드)
 * - 문자열이면 이미 사용자가 생성된 상태 (edit 모드)
 *
 * 앱 재시작 시 자동으로 초기화되며, 로그아웃 시에는 reset()을 호출해 주세요.
 */
interface OnboardingStore {
  currentNickname: string | null;
  setCurrentNickname: (nickname: string | null) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentNickname: null,
  setCurrentNickname: (nickname) => set({ currentNickname: nickname }),
  reset: () => set({ currentNickname: null }),
}));
