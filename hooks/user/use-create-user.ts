// hooks/use-create-user.ts
import { exchangeAndSaveTokens } from "@/api/domains/auth/api";
import { useCreateUserMutation } from "@/api/domains/user/queries";
import { useOidcStore } from "@/store/auth/oidc-store";
import { useState } from "react";

export const useCreateUser = () => {
  const { idToken, provider } = useOidcStore();
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
    } finally {
      setIsTokenRefreshing(false);
    }
  };

  return { submit, isPending };
};
