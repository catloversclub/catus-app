import { create } from "zustand";
import type { DraftData } from "@/store/post/draft-store";

const INITIAL_COMPOSE_STATE = {
  imageUris: [],
  caption: "",
  selectedCats: [],
  commentsEnabled: true,
  sharingEnabled: true,
} satisfies Omit<
  ComposeStore,
  "setImageUris" | "setComposeData" | "clearComposeData" | "clearImageUris"
>;

interface ComposeStore {
  imageUris: DraftData["imageUris"];
  caption: DraftData["caption"];
  selectedCats: DraftData["selectedCats"];
  commentsEnabled: DraftData["commentsEnabled"];
  sharingEnabled: DraftData["sharingEnabled"];
  setImageUris: (imageUris: string[]) => void;
  setComposeData: (data: DraftData) => void;
  clearComposeData: () => void;
  clearImageUris: () => void;
}

export const useComposeStore = create<ComposeStore>((set) => ({
  ...INITIAL_COMPOSE_STATE,
  setImageUris: (imageUris) => set({ imageUris }),
  setComposeData: (data) => set(data),
  clearComposeData: () => set(INITIAL_COMPOSE_STATE),
  clearImageUris: () => set({ imageUris: [] }),
}));
