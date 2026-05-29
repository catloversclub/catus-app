import { create } from "zustand";

interface DraftData {
  imageUris: string[];
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
