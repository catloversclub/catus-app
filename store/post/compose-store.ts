import { create } from "zustand";

interface ComposeStore {
  imageUris: string[];
  setImageUris: (imageUris: string[]) => void;
  clearImageUris: () => void;
}

export const useComposeStore = create<ComposeStore>((set) => ({
  imageUris: [],
  setImageUris: (imageUris) => set({ imageUris }),
  clearImageUris: () => set({ imageUris: [] }),
}));
