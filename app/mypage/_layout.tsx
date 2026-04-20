// app/mypage/_layout.tsx
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import { dark, light } from "@/styles/semantic-colors";
import { Stack, router } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";

export default function MypageLayout() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.bg.primary,
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeftIcon width={24} height={24} color={colors.icon.primary} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="update/index"
        options={{
          title: "내 프로필 수정",
          headerTintColor: colors.text.primary,
        }}
      />
      <Stack.Screen
        name="update/tag"
        options={{
          title: "관심태그 수정",
          headerTintColor: colors.text.primary,
        }}
      />
    </Stack>
  );
}
