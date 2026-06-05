import { useDraftStore } from "@/store/post/draft-store";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import CheckboxFilledIcon from "@/assets/icons/checkbox-filled.svg";
import DefaultAvatarCatIcon from "@/assets/icons/default-avatar-cat.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import Toggle from "@/components/common/toggle";
import { useColors } from "@/hooks/use-colors";
import { useToast } from "@/hooks/use-toast";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_CAPTION = 300;

const MOCK_CATS = [
  { id: "1", name: "깜냥이" },
  { id: "2", name: "치즈" },
];

const EditListScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { colors } = useColors();
  const toast = useToast();
  const { saveDraft } = useDraftStore();

  const { imageUris } = useLocalSearchParams<{ imageUris: string }>();
  const images = useMemo(() => {
    if (!imageUris) return [];
    try {
      return JSON.parse(imageUris) as string[];
    } catch {
      return [];
    }
  }, [imageUris]);

  const [caption, setCaption] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const pagerRef = useRef<PagerView>(null);

  const canUpload = caption.trim().length > 0 || selectedCats.length > 0;

  const handleBack = () => setShowDraftModal(true);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      // TODO: actual upload API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("게시물이 업로드되었어요");
      router.dismissAll();
    } catch {
      toast.error("게시물 업로드 중 오류가 발생했어요");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDraftDiscard = () => {
    setShowDraftModal(false);
    router.back();
  };

  const handleDraftSave = () => {
    saveDraft({ imageUris: images });
    setShowDraftModal(false);
    router.back();
  };

  const toggleCat = (id: string) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const renderBackdrop = useCallback(
    (props: Parameters<typeof BottomSheetBackdrop>[0]) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg.primary,
          paddingTop: top,
        }}
      >
        {/* AppBar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 32,
            backgroundColor: colors.bg.primary,
          }}
        >
          <IconButton onPress={handleBack} className="p-3">
            <ArrowLeftIcon width={20} height={20} color={colors.icon.primary} />
          </IconButton>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 16,
                fontWeight: "600",
                letterSpacing: -0.32,
              }}
            >
              새 게시물
            </Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* Scrollable form */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingBottom: 32,
            paddingTop: 24,
            gap: 30,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image preview */}
          <View style={{ gap: 12 }}>
            {images.length > 0 && (
              <PagerView
                ref={pagerRef}
                style={{ height: 252, borderRadius: 6, overflow: "hidden" }}
                initialPage={0}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
              >
                {images.map((uri, i) => (
                  <View key={i} style={{ flex: 1 }}>
                    <Image
                      source={{ uri }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </View>
                ))}
              </PagerView>
            )}
            {images.length > 1 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {images.map((_, i) => (
                  <View
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor:
                        i === currentPage
                          ? colors.icon.accent
                          : colors.icon.minor,
                    }}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Caption */}
          <View style={{ gap: 12 }}>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 16,
                fontWeight: "600",
                letterSpacing: -0.32,
              }}
            >
              캡션
            </Text>
            <View style={{ gap: 8 }}>
              <View
                style={{
                  backgroundColor: colors.bg.secondary,
                  borderRadius: 6,
                  height: 150,
                  padding: 12,
                  paddingTop: 10,
                }}
              >
                <TextInput
                  value={caption}
                  onChangeText={(t) => setCaption(t.slice(0, MAX_CAPTION))}
                  placeholder="설명을 작성해주세요."
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                  textAlignVertical="top"
                  style={{
                    flex: 1,
                    color: colors.text.primary,
                    fontSize: 14,
                    letterSpacing: -0.56,
                    padding: 0,
                    includeFontPadding: false,
                  }}
                />
              </View>
              <Text
                style={{
                  color: colors.text.tertiary,
                  fontSize: 12,
                  textAlign: "right",
                  letterSpacing: -0.36,
                }}
              >
                <Text style={{ color: colors.text.secondary }}>
                  {caption.length}
                </Text>
                /{MAX_CAPTION}
              </Text>
            </View>
          </View>

          {/* Cat info */}
          <View style={{ gap: 12 }}>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 14,
                fontWeight: "600",
                letterSpacing: -0.42,
              }}
            >
              고양이 정보
            </Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.present()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: 6,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.bg.secondary,
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <DefaultAvatarCatIcon width={36} height={36} />
                </View>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 14,
                    letterSpacing: -0.56,
                  }}
                >
                  {selectedCats.length === 0
                    ? "고양이를 선택해주세요."
                    : `${selectedCats.length}마리 선택됨`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.present()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: colors.border.primary,
                  borderRadius: 4,
                  height: 46,
                  gap: 6,
                }}
              >
                <PlusIcon
                  width={16}
                  height={16}
                  color={colors.button.ghost.text}
                />
                <Text
                  style={{
                    color: colors.button.ghost.text,
                    fontSize: 14,
                    letterSpacing: -0.56,
                  }}
                >
                  더 추가하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Settings */}
          <View style={{ gap: 18 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 2, flex: 1, marginRight: 12 }}>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 14,
                    fontWeight: "600",
                    letterSpacing: -0.42,
                  }}
                >
                  댓글 허용
                </Text>
                <Text
                  style={{
                    color: colors.text.tertiary,
                    fontSize: 12,
                    letterSpacing: -0.36,
                  }}
                >
                  다른 사용자가 이 게시글에 댓글을 달 수 있어요.
                </Text>
              </View>
              <Toggle
                value={commentsEnabled}
                onValueChange={setCommentsEnabled}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 2, flex: 1, marginRight: 12 }}>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 14,
                    fontWeight: "600",
                    letterSpacing: -0.42,
                  }}
                >
                  공유 허용
                </Text>
                <Text
                  style={{
                    color: colors.text.tertiary,
                    fontSize: 12,
                    letterSpacing: -0.36,
                  }}
                >
                  이 게시글을 외부로 공유할 수 있어요.
                </Text>
              </View>
              <Toggle
                value={sharingEnabled}
                onValueChange={setSharingEnabled}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom upload button */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border.primary,
            paddingTop: 12,
            paddingBottom: Math.max(bottom, 12) + 12,
            paddingHorizontal: 12,
            backgroundColor: colors.bg.primary,
          }}
        >
          <Button
            button={{
              label: "업로드",
              onPress: handleUpload,
              disabled: !canUpload,
              isPending: isUploading,
              size: "lg",
            }}
          />
        </View>
      </View>

      {/* 임시저장 Modal */}
      <Modal
        transparent
        visible={showDraftModal}
        animationType="fade"
        onRequestClose={() => setShowDraftModal(false)}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.dimmed.primary,
          }}
        >
          <View
            style={{
              backgroundColor: colors.bg.primary,
              borderRadius: 6,
              paddingHorizontal: 16,
              paddingTop: 24,
              paddingBottom: 16,
              width: 312,
              gap: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text.secondary,
                letterSpacing: -0.32,
                lineHeight: 25.6,
              }}
            >
              지금까지 작성된 내용을 임시저장할까요?
            </Text>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Pressable
                onPress={handleDraftDiscard}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: colors.border.primary,
                  borderRadius: 4,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.text.tertiary,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  삭제
                </Text>
              </Pressable>
              <Pressable
                onPress={handleDraftSave}
                style={{
                  flex: 1,
                  backgroundColor: colors.button.primary.bg,
                  borderRadius: 4,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.button.primary.text,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  임시저장
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cat profile bottom sheet */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["50%"]}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.bg.secondary }}
        handleIndicatorStyle={{
          backgroundColor: colors.icon.secondary,
          width: 120,
          height: 6,
        }}
      >
        <BottomSheetView
          style={{
            flex: 1,
            paddingHorizontal: 12,
            paddingBottom: Math.max(bottom, 12) + 24,
            gap: 60,
          }}
        >
          <View style={{ gap: 10 }}>
            {/* Cat list */}
            <View>
              {MOCK_CATS.map((cat, idx) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => toggleCat(cat.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 14,
                    borderRadius: 4,
                    backgroundColor:
                      idx % 2 === 0
                        ? colors.bg.secondary
                        : colors.border.primary,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 27,
                        backgroundColor: colors.bg.primary,
                        overflow: "hidden",
                      }}
                    />
                    <Text
                      style={{
                        color: colors.text.secondary,
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {cat.name}
                    </Text>
                  </View>
                  {selectedCats.includes(cat.id) ? (
                    <CheckboxFilledIcon
                      width={24}
                      height={24}
                      color={colors.icon.accent}
                    />
                  ) : (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 1.5,
                        borderColor: colors.border.primary,
                        margin: 2,
                      }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {/* 고양이 정보 수정하기 */}
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: colors.border.primary,
                borderRadius: 4,
                height: 46,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.button.ghost.text,
                  fontSize: 14,
                  letterSpacing: -0.56,
                }}
              >
                고양이 정보 수정하기
              </Text>
            </TouchableOpacity>
          </View>

          {/* 확인 */}
          <TouchableOpacity
            onPress={() => bottomSheetRef.current?.dismiss()}
            style={{
              backgroundColor: colors.button.primary.bg,
              borderRadius: 4,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: colors.button.primary.text,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              확인
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default EditListScreen;
