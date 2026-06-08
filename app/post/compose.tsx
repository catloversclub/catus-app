import { Cat } from "@/api/domains/cat/types";
import {
  useCreatePostMutation,
  usePostImageUploadUrlMutation,
} from "@/api/domains/post/queries";
import { uploadImage } from "@/api/domains/common/api";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import DefaultAvatarCatIcon from "@/assets/icons/default-avatar-cat.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import CatProfileSheet from "@/components/bottom-sheet/cat-profile-sheet";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import CenterModal from "@/components/modal/center-modal";
import Toggle from "@/components/common/toggle";
import ImagePager from "@/components/post-editor/image-pager";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { STORAGE_BASE_URL } from "@/constants/api";
import { useColors } from "@/hooks/use-colors";
import { useImageUrisParam } from "@/hooks/use-image-uris-param";
import { useToast } from "@/hooks/use-toast";
import { useDraftStore } from "@/store/post/draft-store";
import { useComposeStore } from "@/store/post/compose-store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack, router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_CAPTION = 300;

const ComposeScreen = () => {
  const { colors } = useColors();
  const toast = useToast();
  const { saveDraft } = useDraftStore();
  const {
    imageUris: storedImageUris,
    setImageUris,
    clearImageUris,
  } = useComposeStore();
  const routeImageUris = useImageUrisParam();
  const images = storedImageUris.length > 0 ? storedImageUris : routeImageUris;

  const { mutateAsync: getPostImageUploadUrl } =
    usePostImageUploadUrlMutation();
  const { mutateAsync: createPost } = useCreatePostMutation();

  const [caption, setCaption] = useState("");
  const [selectedCats, setSelectedCats] = useState<Pick<Cat, "id" | "name">[]>(
    [],
  );
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleCatSelectionChange = useCallback(
    (nextSelectedCats: Pick<Cat, "id" | "name">[]) => {
      setSelectedCats(nextSelectedCats);
    },
    [],
  );

  const canUpload = images.length > 0;

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

  const returnToPreviousStep = () => {
    router.back();
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      toast.error("업로드할 이미지가 없어요");
      return;
    }

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
        catIds: selectedCats.map((cat) => cat.id),
        isCommentable: commentsEnabled,
        isShareable: sharingEnabled,
        imageUrls: uploads.map(
          (upload) => `${STORAGE_BASE_URL}/${upload.fields.key}`,
        ),
      });

      clearImageUris();
      toast.success("게시물이 업로드되었어요");
      router.dismissAll();
    } catch {
      toast.error("게시물 업로드 중 오류가 발생했어요");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDraftDiscard = () => {
    clearImageUris();
    setShowDraftModal(false);
    returnToPreviousStep();
  };

  const handleDraftSave = () => {
    saveDraft({ imageUris: images });
    setImageUris(images);
    setShowDraftModal(false);
    returnToPreviousStep();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <View className="flex-1 bg-semantic-bg-primary">
        <SafeAreaView edges={["top"]}>
          <View className="flex-row items-center h-[52px] px-3">
            <IconButton onPress={handleBack} className="p-3">
              <ArrowLeftIcon
                width={20}
                height={20}
                color={colors.icon.primary}
              />
            </IconButton>
            <Text className="flex-1 text-center text-semantic-text-primary typo-body1 mr-11">
              새 게시물
            </Text>
          </View>
        </SafeAreaView>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-3 pb-8 pt-6 gap-[30px]"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-3">
            {images.length > 0 && (
              <ImagePager
                images={images}
                height={252}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </View>

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

      <CenterModal
        visible={showDraftModal}
        onClose={() => setShowDraftModal(false)}
      >
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

      <SuspenseWithDelay fallback={null} delay={0}>
        <CatProfileSheet
          bottomSheetRef={bottomSheetRef}
          onSelectionChange={handleCatSelectionChange}
        />
      </SuspenseWithDelay>
    </>
  );
};

export default ComposeScreen;
