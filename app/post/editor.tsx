import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import CenterModal from "@/components/modal/center-modal";
import CropTool from "@/components/post-editor/crop-tool";
import MosaicTool from "@/components/post-editor/mosaic-tool";
import TextTool from "@/components/post-editor/text-tool";
import { DARK } from "@/constants/editor-dark";
import { useImageUrisParam } from "@/hooks/use-image-uris-param";
import { Stack, router } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type EditMode = "none" | "crop" | "mosaic" | "text";

const CHIPS: { id: Exclude<EditMode, "none">; label: string }[] = [
  { id: "crop", label: "자르기" },
  { id: "mosaic", label: "모자이크" },
  { id: "text", label: "텍스트" },
];

const EditorScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const images = useImageUrisParam();

  const [editedImages, setEditedImages] = useState<string[]>(images);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentMode, setCurrentMode] = useState<EditMode>("none");
  const [showDraftModal, setShowDraftModal] = useState(false);

  const handleEditSave = (editedUri: string) => {
    setEditedImages((prev) => {
      const next = [...prev];
      next[currentPage] = editedUri;
      return next;
    });
    setCurrentMode("none");
  };

  const handleNext = () => {
    router.push({
      pathname: "/post/edit-list",
      params: { imageUris: JSON.stringify(editedImages) },
    });
  };

  if (currentMode === "crop") {
    return (
      <CropTool
        uri={editedImages[currentPage]}
        onSave={handleEditSave}
        onCancel={() => setCurrentMode("none")}
      />
    );
  }
  if (currentMode === "mosaic") {
    return (
      <MosaicTool
        uri={editedImages[currentPage]}
        onSave={handleEditSave}
        onCancel={() => setCurrentMode("none")}
      />
    );
  }
  if (currentMode === "text") {
    return (
      <TextTool
        uri={editedImages[currentPage]}
        onSave={handleEditSave}
        onCancel={() => setCurrentMode("none")}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ paddingTop: top }} className="flex-1 bg-gray-990">

        {/* AppBar */}
        <View className="flex-row items-center h-[52px] px-3">
          <IconButton onPress={() => router.back()} className="p-3">
            <ArrowLeftIcon width={20} height={20} color={DARK.text} />
          </IconButton>
          <Text className="flex-1 text-center text-gray-0 text-base font-semibold mr-11" style={{ letterSpacing: -0.32 }}>
            이미지 편집
          </Text>
        </View>

        {/* Number badge */}
        <View className="self-end pr-3 mb-1">
          <View className="w-9 h-9 rounded-full bg-yellow-500 items-center justify-center">
            <Text className="text-gray-990 text-base font-semibold">
              {currentPage + 1}
            </Text>
          </View>
        </View>

        {/* Image pager */}
        <View className="flex-1 px-3">
          {editedImages.length > 0 && (
            <PagerView
              className="flex-1"
              initialPage={0}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
              {editedImages.map((uri, i) => (
                <View key={i} className="flex-1 justify-center">
                  <Image
                    source={{ uri }}
                    className="w-full h-[300px]"
                    contentFit="contain"
                  />
                </View>
              ))}
            </PagerView>
          )}
        </View>

        {/* Bottom: chips + button */}
        <View style={{ paddingBottom: Math.max(bottom, 12) + 12 }} className="px-3 gap-4 items-center">
          {/* Chip tabs */}
          <View className="bg-gray-950 rounded-full flex-row items-center px-1.5 py-1 w-[224px]">
            {CHIPS.map((chip, idx) => (
              <View key={chip.id} className="flex-row flex-1 items-center">
                <TouchableOpacity
                  onPress={() => setCurrentMode(chip.id)}
                  className="flex-1 items-center justify-center py-1 px-2.5 rounded"
                >
                  <Text className="text-gray-100 text-xs" style={{ letterSpacing: -0.36 }}>
                    {chip.label}
                  </Text>
                </TouchableOpacity>
                {idx < CHIPS.length - 1 && (
                  <View className="w-px h-4 bg-gray-100/25" />
                )}
              </View>
            ))}
          </View>

          {/* 다음으로 */}
          <TouchableOpacity
            onPress={handleNext}
            className="bg-yellow-500 rounded h-[50px] items-center justify-center w-full"
          >
            <Text className="text-gray-990 text-base font-semibold" style={{ letterSpacing: -0.32 }}>
              다음으로
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 임시저장 불러오기 Modal */}
      <CenterModal visible={showDraftModal} onClose={() => setShowDraftModal(false)}>
        <View className="bg-semantic-bg-primary rounded-[6px] px-4 pt-6 pb-4 gap-5">
          <View className="gap-3">
            <View
              className="w-6 h-6 border-2 border-semantic-icon-secondary rounded-sm"
              style={{ borderStyle: "dashed" }}
            />
            <Text
              className="text-base font-semibold text-semantic-text-secondary"
              style={{ letterSpacing: -0.32, lineHeight: 25.6 }}
            >
              임시 저장된 글을 불러올까요?
            </Text>
          </View>
          <View className="flex-row gap-1.5">
            <View className="flex-1">
              <Button
                button={{
                  label: "취소",
                  onPress: () => setShowDraftModal(false),
                  variant: "secondary",
                  size: "lg",
                }}
              />
            </View>
            <View className="flex-1">
              <Button
                button={{
                  label: "불러오기",
                  onPress: () => {
                    setShowDraftModal(false);
                    handleNext();
                  },
                  size: "lg",
                }}
              />
            </View>
          </View>
        </View>
      </CenterModal>
    </>
  );
};

export default EditorScreen;
