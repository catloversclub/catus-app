import { create } from "zustand";
import type { Cat } from "@/api/domains/cat/types";

export interface DraftData {
  imageUris: string[];
  caption: string;
  selectedCats: Pick<Cat, "id" | "name">[];
  commentsEnabled: boolean;
  sharingEnabled: boolean;
}

interface DraftStore {
  draft: DraftData | null;
  saveDraft: (data: DraftData) => void;
  clearDraft: () => void;
}

export const useDraftStore = create<DraftStore>((set) => ({
  draft: null,
  saveDraft: (data) => set({ draft: data }),
  clearDraft: () => set({ draft: null }),
}));
