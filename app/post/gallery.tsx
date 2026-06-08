import ImagePickerScreen from "@/components/media/image-picker-screen";
import DraftRestoreModal from "@/components/post/draft-restore-modal";
import { ROUTES } from "@/constants/route";
import { useComposeStore } from "@/store/post/compose-store";
import { useDraftStore } from "@/store/post/draft-store";
import { router, Stack } from "expo-router";

const GalleryScreen = () => {
  const { draft, clearDraft } = useDraftStore();
  const setComposeImageUris = useComposeStore((s) => s.setImageUris);

  const handleLoadDraft = () => {
    if (!draft) return;
    const uris = draft.imageUris;
    setComposeImageUris(uris);
    clearDraft();
    router.push(ROUTES.POST.COMPOSE);
  };

  const handleDismissDraft = () => {
    clearDraft();
  };

  const handleConfirm = (uris: string[]) => {
    router.push({
      pathname: ROUTES.POST.EDITOR,
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
        visible={!!draft}
        onCancel={handleDismissDraft}
        onRestore={handleLoadDraft}
      />
    </>
  );
};

export default GalleryScreen;
