import { Cat } from "@/api/domains/cat/types";
import { uploadImage } from "@/api/domains/common/api";
import {
  useCreatePostMutation,
  usePostImageUploadUrlMutation,
} from "@/api/domains/post/queries";
import { useUserProfileQuery } from "@/api/domains/user/queries";
import DefaultAvatarCatIcon from "@/assets/icons/default-avatar-cat.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import SelectCatSheet from "@/components/bottom-sheet/select-cat-sheet";
import ImageCarousel from "@/components/common/image-carousel";
import { ScreenHeader } from "@/components/common/screen-header";
import Toggle from "@/components/common/toggle";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import DraftModal from "@/components/modal/draft-modal";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { STORAGE_BASE_URL } from "@/constants/api";
import { ROUTES } from "@/constants/route";
import { useColors } from "@/hooks/use-colors";
import { useImageUrisParam } from "@/hooks/use-image-uris-param";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { useToast } from "@/hooks/use-toast";
import { useComposeStore } from "@/store/post/compose-store";
import { useDraftStore } from "@/store/post/draft-store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack, router } from "expo-router";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  BackHandler,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const MAX_CAPTION = 300;

interface SettingRowProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingRow = ({
  title,
  description,
  value,
  onValueChange,
}: SettingRowProps) => (
  <View className="flex-row items-center justify-between">
    <View className="gap-0.5 flex-1 mr-3">
      <Text
        className="text-semantic-text-secondary text-sm font-semibold"
        style={{ letterSpacing: -0.42 }}
      >
        {title}
      </Text>
      <Text
        className="text-semantic-text-tertiary text-xs"
        style={{ letterSpacing: -0.36 }}
      >
        {description}
      </Text>
    </View>
    <Toggle value={value} onValueChange={onValueChange} />
  </View>
);

interface CatSelectorProps {
  selectedCats: Pick<Cat, "id" | "name">[];
  bottomSheetRef: RefObject<BottomSheetModal | null>;
  plusIconColor: string;
}

const CatSelector = ({
  selectedCats,
  bottomSheetRef,
  plusIconColor,
}: CatSelectorProps) => (
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
          : selectedCats.map((cat) => cat.name).join(", ")}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => bottomSheetRef.current?.present()}
      className="flex-row items-center justify-center border border-semantic-border-primary rounded h-[46px] gap-1.5"
    >
      <PlusIcon width={16} height={16} color={plusIconColor} />
      <Text
        className="text-semantic-button-ghost-text text-sm"
        style={{ letterSpacing: -0.56 }}
      >
        더 추가하기
      </Text>
    </TouchableOpacity>
  </View>
);

const ComposeScreen = () => {
  const { data: userProfile } = useUserProfileQuery();
  const { colors } = useColors();
  const toast = useToast();
  const {
    imageUris: storedImageUris,
    caption: storedCaption,
    selectedCats: storedSelectedCats,
    commentsEnabled: storedCommentsEnabled,
    sharingEnabled: storedSharingEnabled,
    clearComposeData,
  } = useComposeStore();
  const clearDraft = useDraftStore((s) => s.clearDraft);
  const routeImageUris = useImageUrisParam();
  const images = storedImageUris.length > 0 ? storedImageUris : routeImageUris;

  const { mutateAsync: getPostImageUploadUrl } =
    usePostImageUploadUrlMutation();
  const { mutateAsync: createPost } = useCreatePostMutation();

  const [caption, setCaption] = useState(storedCaption);
  const [selectedCats, setSelectedCats] = useState<Pick<Cat, "id" | "name">[]>(
    storedSelectedCats,
  );
  const [commentsEnabled, setCommentsEnabled] = useState(
    storedCommentsEnabled,
  );
  const [sharingEnabled, setSharingEnabled] = useState(storedSharingEnabled);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { insets } = useKeyboardAvoidingView();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const canUpload = images.length > 0;
  const selectedCatIds = useMemo(
    () => selectedCats.map((cat) => cat.id),
    [selectedCats],
  );
  const draft = useMemo(
    () => ({
      imageUris: images,
      caption,
      selectedCats,
      commentsEnabled,
      sharingEnabled,
    }),
    [caption, commentsEnabled, images, selectedCats, sharingEnabled],
  );

  const handleBack = () => setShowDraftModal(true);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true;
      },
    );
    return () => subscription.remove();
  }, []);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const { uploads } = await getPostImageUploadUrl(images.length);

      await Promise.all(
        uploads.map((upload, index) =>
          uploadImage({ fields: upload.fields, fileUri: images[index] }),
        ),
      );

      await createPost({
        content: caption.trim() || null,
        catIds: selectedCatIds,
        isCommentable: commentsEnabled,
        isShareable: sharingEnabled,
        imageUrls: uploads.map(
          (upload) => `${STORAGE_BASE_URL}/${upload.fields.key}`,
        ),
      });

      clearComposeData();
      clearDraft();
      toast.success("게시물이 업로드되었어요");
      router.dismissAll();
      router.replace(ROUTES.TABS.INDEX);
    } catch {
      toast.error("게시물 업로드 중 오류가 발생했어요");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <View className="flex-1 bg-semantic-bg-primary">
        <ScreenHeader title="새 게시물" onBack={handleBack} />
        <KeyboardAvoidingView
          className="flex-1"
          behavior="padding"
          keyboardVerticalOffset={insets.top + 52}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-3 pb-8 pt-6 gap-[30px]"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {images.length > 0 && (
              <ImageCarousel
                images={images.map((uri, i) => ({ id: String(i), url: uri }))}
                linkable={false}
              />
            )}

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
                    style={{
                      letterSpacing: -0.56,
                      padding: 0,
                      includeFontPadding: false,
                    }}
                  />
                </View>
                <Text
                  className="text-semantic-text-tertiary text-xs text-right"
                  style={{ letterSpacing: -0.36 }}
                >
                  <Text className="text-semantic-text-secondary">
                    {caption.length}
                  </Text>
                  /{MAX_CAPTION}
                </Text>
              </View>
            </View>

            <View className="gap-3">
              <Text
                className="text-semantic-text-secondary text-sm font-semibold"
                style={{ letterSpacing: -0.42 }}
              >
                고양이 정보
              </Text>
              <CatSelector
                selectedCats={selectedCats}
                bottomSheetRef={bottomSheetRef}
                plusIconColor={colors.button.ghost.text}
              />
            </View>

            <View className="gap-[18px]">
              <SettingRow
                title="댓글 허용"
                description="다른 사용자가 이 게시글에 댓글을 달 수 있어요."
                value={commentsEnabled}
                onValueChange={setCommentsEnabled}
              />
              <SettingRow
                title="공유 허용"
                description="이 게시글을 외부로 공유할 수 있어요."
                value={sharingEnabled}
                onValueChange={setSharingEnabled}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

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

      <DraftModal
        visible={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        draft={draft}
      />

      <SuspenseWithDelay fallback={null} delay={0}>
        <SelectCatSheet
          bottomSheetRef={bottomSheetRef}
          userId={userProfile.id}
          initialSelectedCatIds={selectedCatIds}
          onSelectionChange={setSelectedCats}
        />
      </SuspenseWithDelay>
    </>
  );
};

export default ComposeScreen;
