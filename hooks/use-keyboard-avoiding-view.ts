import { useSafeAreaInsets } from "react-native-safe-area-context";

const useKeyboardAvoidingView = (keyboardVerticalOffset?: number) => {
  const insets = useSafeAreaInsets();

  return {
    keyboardAvoidingViewProps: {
      className: "flex-1",
      behavior: "padding" as const,
      keyboardVerticalOffset: keyboardVerticalOffset ?? insets.top,
    },
    insets,
  };
};

export { useKeyboardAvoidingView };
