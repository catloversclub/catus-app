import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import IconButton from "@/components/common/icon-button";
import { dark, light } from "@/styles/semantic-colors";
import { Stack, router } from "expo-router";
import { useColorScheme } from "react-native";

export default function PostLayout() {
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
          <IconButton onPress={() => router.back()} className="p-2">
            <ArrowLeftIcon width={24} height={24} color={colors.icon.primary} />
          </IconButton>
        ),
      }}
    >
      <Stack.Screen name="[id]" />

      <Stack.Screen
        name="follower"
        options={{ title: "팔로워", headerTintColor: colors.text.primary }}
      />
      <Stack.Screen
        name="following"
        options={{ title: "팔로잉", headerTintColor: colors.text.primary }}
      />
    </Stack>
  );
}
