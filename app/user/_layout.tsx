import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { Stack } from "expo-router";

const UserLayout = () => {
  const screenOptions = useDefaultStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default UserLayout;
