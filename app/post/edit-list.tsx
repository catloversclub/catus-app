import { useDraftStore } from "@/store/post/draft-store";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import CheckboxFilledIcon from "@/assets/icons/checkbox-filled.svg";
import DefaultAvatarCatIcon from "@/assets/icons/default-avatar-cat.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import IconButton from "@/components/common/icon-button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toggle from "@/components/common/toggle";
import CenterModal from "@/components/modal/center-modal";
import { useColors } from "@/hooks/use-colors";
import { useImageUrisParam } from "@/hooks/use-image-uris-param";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Stack, router } from "expo-router";
import { Image } from "expo-image";
import { useCallback, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";


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

  const images = useImageUrisParam();

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
      <View style={{ paddingTop: top }} className="flex-1 bg-semantic-bg-primary">

        {/* AppBar */}
        <View className="flex-row items-center pt-8 bg-semantic-bg-primary">
          <IconButton onPress={handleBack} className="p-3">
            <ArrowLeftIcon width={20} height={20} color={colors.icon.primary} />
          </IconButton>
          <View className="flex-1 items-center">
            <Text
              className="text-semantic-text-primary text-base font-semibold"
              style={{ letterSpacing: -0.32 }}
            >
              새 게시물
            </Text>
          </View>
          <View className="w-11" />
        </View>

        {/* Scrollable form */}
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-3 pb-8 pt-6 gap-[30px]"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image preview */}
          <View className="gap-3">
            {images.length > 0 && (
              <PagerView
                ref={pagerRef}
                style={{ height: 252, borderRadius: 6, overflow: "hidden" }}
                initialPage={0}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
              >
                {images.map((uri, i) => (
                  <View key={i} className="flex-1">
                    <Image
                      source={{ uri }}
                      className="w-full h-full"
                      contentFit="cover"
                    />
                  </View>
                ))}
              </PagerView>
            )}
            {images.length > 1 && (
              <View className="flex-row justify-center gap-1.5">
                {images.map((_, i) => (
                  <View
                    key={i}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      i === currentPage
                        ? "bg-semantic-icon-accent"
                        : "bg-semantic-icon-minor",
                    )}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Caption */}
          <View className="gap-3">
            <Text
              className="text-semantic-text-secondary text-base font-semibold"
              style={{ letterSpacing: -0.32 }}
            >
              캡션
            </Text>
            <View className="gap-2">
              <View className="bg-semantic-bg-secondary rounded-[6px] h-[150px] p-3 pt-2.5">
                <TextInput
                  value={caption}
                  onChangeText={(t) => setCaption(t.slice(0, MAX_CAPTION))}
                  placeholder="설명을 작성해주세요."
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                  textAlignVertical="top"
                  className="flex-1 text-semantic-text-primary text-sm"
                  style={{ letterSpacing: -0.56, padding: 0, includeFontPadding: false }}
                />
              </View>
              <Text
                className="text-semantic-text-tertiary text-xs text-right"
                style={{ letterSpacing: -0.36 }}
              >
                <Text className="text-semantic-text-secondary">{caption.length}</Text>
                /{MAX_CAPTION}
              </Text>
            </View>
          </View>

          {/* Cat info */}
          <View className="gap-3">
            <Text
              className="text-semantic-text-secondary text-sm font-semibold"
              style={{ letterSpacing: -0.42 }}
            >
              고양이 정보
            </Text>
            <View className="gap-2.5">
              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.present()}
                className="flex-row items-center gap-3 p-1.5"
              >
                <View className="w-9 h-9 rounded-full bg-semantic-bg-secondary items-center justify-center overflow-hidden">
                  <DefaultAvatarCatIcon width={36} height={36} />
                </View>
                <Text
                  className="text-semantic-text-secondary text-sm"
                  style={{ letterSpacing: -0.56 }}
                >
                  {selectedCats.length === 0
                    ? "고양이를 선택해주세요."
                    : `${selectedCats.length}마리 선택됨`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.present()}
                className="flex-row items-center justify-center border border-semantic-border-primary rounded h-[46px] gap-1.5"
              >
                <PlusIcon
                  width={16}
                  height={16}
                  color={colors.button.ghost.text}
                />
                <Text
                  className="text-semantic-button-ghost-text text-sm"
                  style={{ letterSpacing: -0.56 }}
                >
                  더 추가하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Settings */}
          <View className="gap-[18px]">
            <View className="flex-row items-center justify-between">
              <View className="gap-0.5 flex-1 mr-3">
                <Text
                  className="text-semantic-text-secondary text-sm font-semibold"
                  style={{ letterSpacing: -0.42 }}
                >
                  댓글 허용
                </Text>
                <Text
                  className="text-semantic-text-tertiary text-xs"
                  style={{ letterSpacing: -0.36 }}
                >
                  다른 사용자가 이 게시글에 댓글을 달 수 있어요.
                </Text>
              </View>
              <Toggle
                value={commentsEnabled}
                onValueChange={setCommentsEnabled}
              />
            </View>
            <View className="flex-row items-center justify-between">
              <View className="gap-0.5 flex-1 mr-3">
                <Text
                  className="text-semantic-text-secondary text-sm font-semibold"
                  style={{ letterSpacing: -0.42 }}
                >
                  공유 허용
                </Text>
                <Text
                  className="text-semantic-text-tertiary text-xs"
                  style={{ letterSpacing: -0.36 }}
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

        <BottomActionBar
          buttons={[
            {
              label: "업로드",
              onPress: handleUpload,
              disabled: !canUpload,
              isPending: isUploading,
            },
          ]}
        />
      </View>

      {/* 임시저장 Modal */}
      <CenterModal visible={showDraftModal} onClose={() => setShowDraftModal(false)}>
        <View className="bg-semantic-bg-primary rounded-[6px] px-4 pt-6 pb-4 gap-5">
          <Text
            className="text-base font-semibold text-semantic-text-secondary"
            style={{ letterSpacing: -0.32, lineHeight: 25.6 }}
          >
            지금까지 작성된 내용을 임시저장할까요?
          </Text>
          <View className="flex-row gap-1.5">
            <View className="flex-1">
              <Button
                button={{
                  label: "삭제",
                  onPress: handleDraftDiscard,
                  variant: "secondary",
                  size: "lg",
                }}
              />
            </View>
            <View className="flex-1">
              <Button
                button={{
                  label: "임시저장",
                  onPress: handleDraftSave,
                  size: "lg",
                }}
              />
            </View>
          </View>
        </View>
      </CenterModal>

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
          style={{ paddingBottom: Math.max(bottom, 12) + 24 }}
          className="flex-1 px-3 gap-[60px]"
        >
          <View className="gap-2.5">
            {/* Cat list */}
            <View>
              {MOCK_CATS.map((cat, idx) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => toggleCat(cat.id)}
                  className={cn(
                    "flex-row items-center justify-between gap-1.5 px-3 py-3.5 rounded",
                    idx % 2 === 0
                      ? "bg-semantic-bg-secondary"
                      : "bg-semantic-border-primary",
                  )}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-[54px] h-[54px] rounded-full bg-semantic-bg-primary overflow-hidden" />
                    <Text className="text-semantic-text-secondary text-base font-semibold">
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
                      className="w-5 h-5 rounded-full m-0.5 border-semantic-border-primary"
                      style={{ borderWidth: 1.5 }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Button
              button={{
                label: "고양이 정보 수정하기",
                onPress: () => {},
                variant: "secondary",
                size: "md",
              }}
            />
          </View>

          {/* 확인 */}
          <Button
            button={{
              label: "확인",
              onPress: () => bottomSheetRef.current?.dismiss(),
              size: "lg",
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default EditListScreen;
