import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import IconButton from "@/components/common/icon-button";
import CenterModal from "@/components/modal/center-modal";
import CropTool from "@/components/post/CropTool";
import MosaicTool from "@/components/post/MosaicTool";
import TextTool from "@/components/post/TextTool";
import { DARK } from "@/constants/editor-dark";
import { useColors } from "@/hooks/use-colors";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type EditMode = "none" | "crop" | "mosaic" | "text";

const CHIPS: { id: Exclude<EditMode, "none">; label: string }[] = [
  { id: "crop", label: "자르기" },
  { id: "mosaic", label: "모자이크" },
  { id: "text", label: "텍스트" },
];

export default function EditorScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { colors } = useColors();
  const { imageUris } = useLocalSearchParams<{ imageUris: string }>();

  const images = useMemo(() => {
    if (!imageUris) return [];
    try {
      return JSON.parse(imageUris) as string[];
    } catch {
      return [];
    }
  }, [imageUris]);

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
      <View style={{ flex: 1, backgroundColor: DARK.bg, paddingTop: top }}>

        {/* AppBar */}
        <View style={{ flexDirection: "row", alignItems: "center", height: 52, paddingHorizontal: 12 }}>
          <IconButton onPress={() => router.back()} className="p-3">
            <ArrowLeftIcon width={20} height={20} color={DARK.text} />
          </IconButton>
          <Text style={{ flex: 1, textAlign: "center", color: DARK.text, fontSize: 16, fontWeight: "600", letterSpacing: -0.32, marginRight: 44 }}>
            이미지 편집
          </Text>
        </View>

        {/* Number badge */}
        <View style={{ alignSelf: "flex-end", paddingRight: 12, marginBottom: 4 }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: DARK.yellow, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: DARK.yellowText, fontSize: 16, fontWeight: "600" }}>
              {currentPage + 1}
            </Text>
          </View>
        </View>

        {/* Image pager */}
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          {editedImages.length > 0 && (
            <PagerView
              style={{ flex: 1 }}
              initialPage={0}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
              {editedImages.map((uri, i) => (
                <View key={i} style={{ flex: 1, justifyContent: "center" }}>
                  <Image
                    source={{ uri }}
                    style={{ width: "100%", height: 300 }}
                    contentFit="contain"
                  />
                </View>
              ))}
            </PagerView>
          )}
        </View>

        {/* Bottom: chips + button */}
        <View style={{ paddingHorizontal: 12, paddingBottom: Math.max(bottom, 12) + 12, gap: 16, alignItems: "center" }}>
          {/* Chip tabs */}
          <View style={{ backgroundColor: DARK.bgSecondary, borderRadius: 100, flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingVertical: 4, width: 224 }}>
            {CHIPS.map((chip, idx) => (
              <View key={chip.id} style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => setCurrentMode(chip.id)}
                  style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4 }}
                >
                  <Text style={{ color: DARK.textMuted, fontSize: 12, letterSpacing: -0.36 }}>
                    {chip.label}
                  </Text>
                </TouchableOpacity>
                {idx < CHIPS.length - 1 && (
                  <View style={{ width: 1, height: 16, backgroundColor: DARK.separator }} />
                )}
              </View>
            ))}
          </View>

          {/* 다음으로 */}
          <TouchableOpacity
            onPress={handleNext}
            style={{ backgroundColor: DARK.yellow, borderRadius: 4, height: 50, alignItems: "center", justifyContent: "center", width: "100%" }}
          >
            <Text style={{ color: DARK.yellowText, fontSize: 16, fontWeight: "600", letterSpacing: -0.32 }}>
              다음으로
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 임시저장 불러오기 Modal */}
      <CenterModal visible={showDraftModal} onClose={() => setShowDraftModal(false)}>
        <View style={{ backgroundColor: colors.bg.primary, borderRadius: 6, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16, gap: 20 }}>
          <View style={{ gap: 12 }}>
            <View style={{ width: 24, height: 24, borderWidth: 2, borderStyle: "dashed", borderColor: colors.icon.secondary, borderRadius: 2 }} />
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text.secondary, letterSpacing: -0.32, lineHeight: 25.6 }}>
              임시 저장된 글을 불러올까요?
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Pressable
              onPress={() => setShowDraftModal(false)}
              style={{ flex: 1, borderWidth: 1, borderColor: colors.border.primary, borderRadius: 4, paddingVertical: 12, alignItems: "center" }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text.tertiary }}>취소</Text>
            </Pressable>
            <Pressable
              onPress={() => { setShowDraftModal(false); handleNext(); }}
              style={{ flex: 1, backgroundColor: colors.button.primary.bg, borderRadius: 4, paddingVertical: 12, alignItems: "center" }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.button.primary.text }}>불러오기</Text>
            </Pressable>
          </View>
        </View>
      </CenterModal>
    </>
  );
}
