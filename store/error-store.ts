import { create } from "zustand";

interface ErrorStore {
  error: { title: string; message: string } | null;
  showError: (title: string, message: string) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
  error: null,
  showError: (title, message) => set({ error: { title, message } }),
  clearError: () => set({ error: null }),
}));
