import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { Stack } from "expo-router";

const UserDetailLayout = () => {
  const screenOptions = useDefaultStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" />
      <Stack.Screen name="follower" options={{ title: "팔로워" }} />
      <Stack.Screen name="following" options={{ title: "팔로잉" }} />
    </Stack>
  );
};

export default UserDetailLayout;
