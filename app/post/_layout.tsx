import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { Stack } from "expo-router";

const PostLayout = () => {
  const screenOptions = useDefaultStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="compose"
        options={{ gestureEnabled: false, headerShown: false }}
      />
      <Stack.Screen name="editor" options={{ headerShown: false }} />
    </Stack>
  );
};

export default PostLayout;
