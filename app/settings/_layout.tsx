// app/settings/_layout.tsx
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import IconButton from "@/components/common/icon-button";
import { useColors } from "@/hooks/use-colors";
import { Stack, router } from "expo-router";

const SettingsLayout = () => {
  const { colors } = useColors();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.bg.primary,
        },
        headerLeft: () => (
          <IconButton onPress={() => router.back()} className="p-2">
            <ArrowLeftIcon width={24} height={24} color={colors.icon.primary} />
          </IconButton>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "설정", headerTintColor: colors.text.primary }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          title: "개인정보 처리방침",
          headerTintColor: colors.text.primary,
        }}
      />
      <Stack.Screen
        name="terms-of-service"
        options={{
          title: "서비스 이용약관",
          headerTintColor: colors.text.primary,
        }}
      />
      <Stack.Screen
        name="delete-account/index"
        options={{ title: "회원탈퇴", headerTintColor: colors.text.primary }}
      />
      <Stack.Screen
        name="delete-account/reason"
        options={{
          title: "회원탈퇴",
          headerTintColor: colors.text.primary,
        }}
      />
    </Stack>
  );
}

export default SettingsLayout;
