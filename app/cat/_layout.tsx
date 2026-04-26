import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import { dark, light } from "@/styles/semantic-colors";
import { Stack, router } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";

export default function CatLayout() {
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
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="list"
        options={{
          title: "함께 사는 고양이",
          headerTintColor: colors.text.primary,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "고양이 프로필 입력",
          headerTintColor: colors.text.primary,
        }}
      />
      <Stack.Screen
        name="update"
        options={{
          title: "고양이 프로필 수정",
          headerTintColor: colors.text.primary,
        }}
      />
    </Stack>
  );
}
