import * as SecureStore from "expo-secure-store";
import { Appearance, ColorSchemeName } from "react-native";
import { create } from "zustand";

export type ThemeMode = "system" | "light" | "dark";

const THEME_MODE_KEY = "themeMode";

const applyThemeMode = (mode: ThemeMode) => {
  const colorScheme: ColorSchemeName = mode === "system" ? null : mode;
  Appearance.setColorScheme(colorScheme);
};

interface ThemeStore {
  mode: ThemeMode;
  isLoaded: boolean;
  loadMode: () => Promise<void>;
  setMode: (mode: ThemeMode) => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: "system",
  isLoaded: false,
  loadMode: async () => {
    const storedMode = await SecureStore.getItemAsync(THEME_MODE_KEY);
    const mode: ThemeMode =
      storedMode === "light" || storedMode === "dark" || storedMode === "system"
        ? storedMode
        : "system";

    applyThemeMode(mode);
    set({ mode, isLoaded: true });
  },
  setMode: async (mode) => {
    applyThemeMode(mode);
    set({ mode });
    await SecureStore.setItemAsync(THEME_MODE_KEY, mode);
  },
}));
