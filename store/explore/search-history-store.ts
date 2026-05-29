import * as FileSystem from "expo-file-system/legacy";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ViewedCat {
  id: string;
  name: string;
  breed?: string;
  imageUrl: string | null;
}

interface SearchHistoryState {
  recentSearches: string[];
  viewedCats: ViewedCat[];
  addSearch: (query: string) => void;
  removeSearch: (index: number) => void;
  clearSearches: () => void;
  addViewedCat: (cat: ViewedCat) => void;
  removeViewedCat: (id: string) => void;
}

const HISTORY_FILE = `${FileSystem.documentDirectory}search_history.json`;

const fileStorage = {
  getItem: async (_name: string) => {
    try {
      const info = await FileSystem.getInfoAsync(HISTORY_FILE);
      if (!info.exists) return null;
      return await FileSystem.readAsStringAsync(HISTORY_FILE);
    } catch {
      return null;
    }
  },
  setItem: async (_name: string, value: string) => {
    await FileSystem.writeAsStringAsync(HISTORY_FILE, value);
  },
  removeItem: async (_name: string) => {
    try {
      await FileSystem.deleteAsync(HISTORY_FILE, { idempotent: true });
    } catch {}
  },
};

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      recentSearches: [],
      viewedCats: [],

      addSearch: (query) =>
        set((s) => {
          const deduped = s.recentSearches.filter((q) => q !== query);
          return { recentSearches: [query, ...deduped].slice(0, 20) };
        }),

      removeSearch: (index) =>
        set((s) => ({
          recentSearches: s.recentSearches.filter((_, i) => i !== index),
        })),

      clearSearches: () => set({ recentSearches: [] }),

      addViewedCat: (cat) =>
        set((s) => {
          const deduped = s.viewedCats.filter((c) => c.id !== cat.id);
          return { viewedCats: [cat, ...deduped].slice(0, 10) };
        }),

      removeViewedCat: (id) =>
        set((s) => ({
          viewedCats: s.viewedCats.filter((c) => c.id !== id),
        })),
    }),
    {
      name: "search_history",
      storage: createJSONStorage(() => fileStorage),
    },
  ),
);
