import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { Stack } from "expo-router";

const SettingsLayout = () => {
  const screenOptions = useDefaultStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: "설정" }} />
      <Stack.Screen name="notifications" options={{ title: "알림" }} />
      <Stack.Screen name="privacy-policy" options={{ title: "개인정보 처리방침" }} />
      <Stack.Screen name="terms-of-service" options={{ title: "서비스 이용약관" }} />
      <Stack.Screen name="delete-account/index" options={{ title: "회원탈퇴" }} />
      <Stack.Screen name="delete-account/reason" options={{ title: "회원탈퇴" }} />
    </Stack>
  );
};

export default SettingsLayout;
