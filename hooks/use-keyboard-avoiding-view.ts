import { Platform } from "react-native";
import { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const useKeyboardAvoidingView = (keyboardVerticalOffset?: number) => {
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();

  // Android: adjustResize + edgeToEdge는 API 30+에서 동작 안 함.
  // reanimated의 useAnimatedKeyboard는 WindowInsetsCompat을 직접 읽어 정확한 값을 제공.
  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value,
  }));

  return {
    keyboardAvoidingViewProps: {
      behavior: Platform.OS === "ios" ? ("padding" as const) : undefined,
      keyboardVerticalOffset: keyboardVerticalOffset ?? insets.top,
    },
    containerStyle: Platform.OS === "android" ? animatedStyle : undefined,
    insets,
  };
};

export { useKeyboardAvoidingView };
