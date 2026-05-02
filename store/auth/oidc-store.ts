import { AuthProvider } from "@/api/domains/auth/types";
import { create } from "zustand";

interface OidcStore {
  idToken: string | null;
  provider: AuthProvider | null;
  setOidc: (idToken: string, provider: AuthProvider) => void;
  clearOidc: () => void;
}

export const useOidcStore = create<OidcStore>((set) => ({
  idToken: null,
  provider: null,
  setOidc: (idToken, provider) => set({ idToken, provider }),
  clearOidc: () => set({ idToken: null, provider: null }),
}));
