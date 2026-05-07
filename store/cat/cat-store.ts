import { create } from "zustand";

interface CatStore {
  imageUri: null | string;
  setImageUri: (imageUri: string | null) => void;
  resetImageUri: () => void;
}

export const useCatStore = create<CatStore>((set) => ({
  imageUri: null,
  setImageUri: (imageUri) => set({ imageUri }),
  resetImageUri: () => set({ imageUri: null }),
}));
