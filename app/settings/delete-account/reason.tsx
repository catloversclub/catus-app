import { useDeleteUserMutation } from "@/api/domains/user/queries";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import { ROUTES } from "@/constants/route";
import { tokenStorage } from "@/lib/token";
import { useAuthStore } from "@/store/auth/auth-store";
import { useOidcStore } from "@/store/auth/oidc-store";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const DeleteAccount = () => {
  const { mutate: deleteUser, isPending } = useDeleteUserMutation();
  const setAuthStatus = useAuthStore((s) => s.setStatus);
  const clearOidc = useOidcStore((s) => s.clearOidc);

  const handleDeleteAccount = () => {
    deleteUser(undefined, {
      onSuccess: async () => {
        await tokenStorage.clearTokens();
        clearOidc();
        setAuthStatus("unauthenticated");
        router.replace(ROUTES.AUTH.INDEX);
      },
    });
  };

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <ScrollView contentContainerClassName="py-6 px-5 gap-10 flex-col">
        <Text className="typo-title2 text-semantic-text-primary">
          떠나시는 이유를 알려주세요. {"\n"}더욱 노력하는 CatUs가 되겠습니다.
        </Text>
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "탈퇴하기",
            onPress: handleDeleteAccount,
            isPending,
          },
          {
            label: "계정 유지하기",
            onPress: () => router.dismissAll(),
            variant: "secondary",
            disabled: isPending,
          },
        ]}
      />
    </View>
  );
};

export default DeleteAccount;
