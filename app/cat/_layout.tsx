import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { Stack } from "expo-router";

const CatLayout = () => {
  const screenOptions = useDefaultStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="list" options={{ title: "함께 사는 고양이" }} />
      <Stack.Screen name="register" options={{ title: "고양이 프로필 생성" }} />
    </Stack>
  );
};

export default CatLayout;
