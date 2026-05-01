import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useKeyboardAvoidingView = () => {
  const insets = useSafeAreaInsets();
  return {
    behavior: Platform.OS === "ios" ? "padding" : "height",
    keyboardVerticalOffset: insets.top,
  } as const;
};
