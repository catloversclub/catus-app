import * as Haptics from "expo-haptics";

export const triggerSelectionHaptic = () => {
  if (process.env.EXPO_OS === "web") return;

  void Haptics.selectionAsync();
};
