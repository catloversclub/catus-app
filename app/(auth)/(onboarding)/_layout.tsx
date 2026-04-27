import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import { dark, light } from "@/styles/semantic-colors";
import { Stack, router } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";

export default function OnboardingLayout() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: "",
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
      <Stack.Screen name="index" />
      <Stack.Screen name="step1" />
      <Stack.Screen name="step2" />
      <Stack.Screen name="step3" />
      <Stack.Screen name="step4" />
      <Stack.Screen name="step5" />
      <Stack.Screen name="step6" />
      <Stack.Screen name="step7" />
    </Stack>
  );
}
