import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { Stack } from "expo-router";

const MypageLayout = () => {
  const screenOptions = useDefaultStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="update/index" options={{ title: "내 프로필 수정" }} />
      <Stack.Screen name="update/tag" options={{ title: "관심태그 수정" }} />
    </Stack>
  );
};

export default MypageLayout;
