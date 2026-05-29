// hooks/auth/use-auth-redirect.ts
import { getUserProfile } from "@/api/domains/user/api";
import { tokenStorage } from "@/lib/token";
import { useAuthStore } from "@/store/auth/auth-store";
import { useEffect } from "react";

/**
 * 앱 부팅 시 1회 실행되는 인증 상태 부트스트랩.
 * 1. SecureStore에서 토큰 존재 확인
 * 2. 토큰이 있으면 /user/me로 실제 유효성 검증
 * 3. 검증 실패 시 토큰 정리 + unauthenticated
 *
 * 라우팅 자체는 하지 않고 store에 상태만 기록합니다.
 * 화면 분기는 app/_layout.tsx의 initialRouteName이 담당.
 */
export function useAuthBootstrap() {
  const setStatus = useAuthStore((s) => s.setStatus);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [accessToken, refreshToken] = await Promise.all([
          tokenStorage.getAccess(),
          tokenStorage.getRefresh(),
        ]);

        if (!accessToken || !refreshToken) {
          if (active) setStatus("unauthenticated");
          return;
        }

        // 토큰이 있다고 끝이 아님 → 서버에서 실제 유효한지 검증
        // 401 시 axios 인터셉터가 refresh를 시도, 그것도 실패하면 throw
        try {
          await getUserProfile();
          if (active) setStatus("authenticated");
        } catch {
          await tokenStorage.clearTokens();
          if (active) setStatus("unauthenticated");
        }
      } catch (e) {
        console.warn("[auth bootstrap]", e);
        if (active) setStatus("unauthenticated");
      }
    })();

    return () => {
      active = false;
    };
  }, [setStatus]);
}
