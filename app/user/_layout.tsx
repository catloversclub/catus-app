import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import IconButton from "@/components/common/icon-button";
import { useColors } from "@/hooks/use-colors";
import { Stack, router } from "expo-router";

const PostLayout = () => {
  const { colors } = useColors();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: colors.text.primary,
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

      <Stack.Screen name="follower" options={{ title: "팔로워" }} />
      <Stack.Screen name="following" options={{ title: "팔로잉" }} />
    </Stack>
  );
}

export default PostLayout;
