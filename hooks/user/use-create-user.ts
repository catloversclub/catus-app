// hooks/use-create-user.ts
import { exchangeAndSaveTokens } from "@/api/domains/auth/api";
import { useCreateUserMutation } from "@/api/domains/user/queries";
import { useOidcStore } from "@/store/auth/oidc-store";
import { useOnboardingStore } from "@/store/auth/onboarding-store";
import { useState } from "react";

const useCreateUser = () => {
  const { idToken, provider } = useOidcStore();
  const { setCurrentNickname } = useOnboardingStore();
  const { mutateAsync: createUser, isPending: isCreating } =
    useCreateUserMutation();
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);

  const isPending = isCreating || isTokenRefreshing;

  const submit = async (nickname: string) => {
    await createUser({ nickname, hasAgreedToTerms: true });

    setIsTokenRefreshing(true);
    try {
      await exchangeAndSaveTokens({
        idToken: idToken!,
        provider: provider!,
      });
      // 사용자 생성 완료 → 이후 Step1으로 돌아오면 edit 모드로 동작
      setCurrentNickname(nickname);
    } finally {
      setIsTokenRefreshing(false);
    }
  };

  return { submit, isPending };
};

export { useCreateUser };
