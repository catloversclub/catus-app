import { create } from "zustand";

export type Gender = "FEMALE" | "MALE" | null;

interface CatOnboardingData {
  name: string;
  gender: Gender;
  profileImageUrl: string | null;
  birthDate: string | null;
  breed: string | null;
  personalities: number[];
  appearances: number[];
}

interface OnboardingStore {
  cat: CatOnboardingData;
  setCat: (data: Partial<CatOnboardingData>) => void;
  reset: () => void;
}

const initialCat: CatOnboardingData = {
  name: "",
  gender: null,
  profileImageUrl: null,
  birthDate: null,
  breed: null,
  personalities: [],
  appearances: [],
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  cat: initialCat,
  setCat: (data) => set((state) => ({ cat: { ...state.cat, ...data } })),
  reset: () => set({ cat: initialCat }),
}));
