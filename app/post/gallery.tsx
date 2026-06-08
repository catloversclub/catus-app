import ImagePickerScreen from "@/components/media/image-picker-screen";
import DraftRestoreModal from "@/components/post/draft-restore-modal";
import { useDraftStore } from "@/store/post/draft-store";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";

const GalleryScreen = () => {
  const { draft, clearDraft } = useDraftStore();
  const [showDraftModal, setShowDraftModal] = useState(false);

  useEffect(() => {
    if (draft) setShowDraftModal(true);
  }, [draft]);

  const handleLoadDraft = () => {
    if (!draft) return;
    const uris = draft.imageUris;
    clearDraft();
    setShowDraftModal(false);
    router.push({
      pathname: "/post/edit-list",
      params: { imageUris: JSON.stringify(uris) },
    });
  };

  const handleDismissDraft = () => {
    clearDraft();
    setShowDraftModal(false);
  };

  const handleConfirm = (uris: string[]) => {
    router.push({
      pathname: "/post/editor",
      params: { imageUris: JSON.stringify(uris) },
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: "최근 항목" }} />

      <ImagePickerScreen
        selectionLimit={5}
        confirmLabel="다음으로"
        onConfirm={handleConfirm}
        onCancel={() => router.back()}
      />
      <DraftRestoreModal
        visible={showDraftModal}
        onCancel={handleDismissDraft}
        onRestore={handleLoadDraft}
      />
    </>
  );
};

export default GalleryScreen;
