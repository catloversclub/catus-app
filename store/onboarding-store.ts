import { create } from "zustand";

interface UserOnboardingData {
  nickname: string;
  hasAgreedToTerms: boolean;
  isLivingWithCat: boolean;
  favoritePersonalities: number[];
  favoriteAppearances: number[];
  email: string | null;
  phone: string | null;
  profileImageUrl: string | null;
}

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
  user: UserOnboardingData;
  cat: CatOnboardingData;
  setUser: (data: Partial<UserOnboardingData>) => void;
  setCat: (data: Partial<CatOnboardingData>) => void;
  reset: () => void;
}

const initialUser: UserOnboardingData = {
  nickname: "",
  hasAgreedToTerms: false,
  isLivingWithCat: false,
  favoritePersonalities: [],
  favoriteAppearances: [],
  email: null,
  phone: null,
  profileImageUrl: null,
};

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
  user: initialUser,
  cat: initialCat,
  setUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
  setCat: (data) => set((state) => ({ cat: { ...state.cat, ...data } })),
  reset: () => set({ user: initialUser, cat: initialCat }),
}));
