import BottomActionBar from "@/components/layout/bottom-action-bar";
import CropTool from "@/components/post-editor/crop-tool";
import EditorHeader from "@/components/post-editor/editor-header";
import ImagePager from "@/components/post-editor/image-pager";
import MosaicTool from "@/components/post-editor/mosaic-tool";
import TextTool from "@/components/post-editor/text-tool";
import { ROUTES } from "@/constants/route";
import { useImageUrisParam } from "@/hooks/use-image-uris-param";
import { useComposeStore } from "@/store/post/compose-store";
import { Stack, router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type EditMode = "none" | "crop" | "mosaic" | "text";

const CHIPS: { id: Exclude<EditMode, "none">; label: string }[] = [
  { id: "crop", label: "자르기" },
  { id: "mosaic", label: "모자이크" },
  { id: "text", label: "텍스트" },
];

const EditorScreen = () => {
  const images = useImageUrisParam();
  const setComposeImageUris = useComposeStore((s) => s.setImageUris);

  const [edits, setEdits] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [currentMode, setCurrentMode] = useState<EditMode>("none");

  const editedImages = useMemo(
    () => images.map((uri, i) => edits[i] ?? uri),
    [edits, images],
  );

  const handleEditSave = (editedUri: string) => {
    setEdits((prev) => ({ ...prev, [currentPage]: editedUri }));
    setCurrentMode("none");
  };

  const handleEditCancel = () => {
    setCurrentMode("none");
  };

  const editToolProps = {
    uri: editedImages[currentPage],
    onSave: handleEditSave,
    onCancel: handleEditCancel,
  };

  const handleNext = () => {
    setComposeImageUris(editedImages);
    router.push({
      pathname: ROUTES.POST.COMPOSE,
      params: { imageUris: JSON.stringify(editedImages) },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {currentMode === "crop" && <CropTool {...editToolProps} />}
      {currentMode === "mosaic" && <MosaicTool {...editToolProps} />}
      {currentMode === "text" && <TextTool {...editToolProps} />}
      {currentMode === "none" && (
        <View className="flex-1 bg-[#1A1A1A]">
          <EditorHeader title="이미지 편집" onBack={() => router.back()} />

          <View className="self-end pr-4">
            <View className="bg-semantic-icon-accent rounded-full size-9 items-center justify-center">
              <Text className="text-gray-990 typo-body1">
                {currentPage + 1}
              </Text>
            </View>
          </View>

          <View className="flex-1 justify-center px-3 py-3">
            <ImagePager
              images={editedImages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </View>

          <View className="px-3 pb-3 items-center">
            <View className="rounded-full flex-row items-center px-1.5 py-1 w-56 bg-gray-950">
              {CHIPS.map((chip, idx) => (
                <View key={chip.id} className="flex-row flex-1 items-center">
                  <TouchableOpacity
                    onPress={() => setCurrentMode(chip.id)}
                    className="flex-1 items-center justify-center py-1 px-2.5"
                  >
                    <Text className="text-semantic-chips-primary-text typo-label1">
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                  {idx < CHIPS.length - 1 && (
                    <View className="w-px h-4 bg-semantic-chips-primary-text" />
                  )}
                </View>
              ))}
            </View>
          </View>

          <BottomActionBar
            containerClassName="bg-gray-990"
            buttons={[
              {
                label: "다음으로",
                onPress: handleNext,
              },
            ]}
          />
        </View>
      )}
    </>
  );
};

export default EditorScreen;
