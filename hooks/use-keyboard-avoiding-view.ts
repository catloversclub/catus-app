import { useSafeAreaInsets } from "react-native-safe-area-context";

const useKeyboardAvoidingView = (keyboardVerticalOffset?: number) => {
  const insets = useSafeAreaInsets();

  return {
    keyboardAvoidingViewProps: {
      behavior: "padding" as const,
      keyboardVerticalOffset: keyboardVerticalOffset ?? insets.top,
    },
    insets,
  };
};

export { useKeyboardAvoidingView };
