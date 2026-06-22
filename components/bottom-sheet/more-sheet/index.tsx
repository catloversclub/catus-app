import { useDeletePostMutation } from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import { useUserProfileNonSuspenseQuery } from "@/api/domains/user/queries";
import ShareIcon from "@/assets/icons/share.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import UpdateIcon from "@/assets/icons/update.svg";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import ActionPressable from "@/components/common/action-pressable";
import Button from "@/components/common/button";
import CenterModal from "@/components/modal/center-modal";
import { ROUTES } from "@/constants/route";
import { sharePost } from "@/lib/share";
import { useComposeStore } from "@/store/post/compose-store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, usePathname } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import BlockAction from "./block-action";
import ReportAction from "./report-action";

interface MoreSheetProps {
  MoreSheetModalRef: React.RefObject<BottomSheetModal | null>;
  post: Post;
}

interface ShareActionProps {
  post: Post;
  dismiss: () => void;
}

interface VisitProfileActionProps {
  authorId: string;
  dismiss: () => void;
}

interface OwnerActionsProps {
  post: Post;
  dismiss: () => void;
}

const ShareAction = ({ post, dismiss }: ShareActionProps) => {
  const handlePress = async () => {
    await sharePost(post.id);
    dismiss();
  };

  return (
    <ActionPressable
      onPress={handlePress}
      className="flex-row gap-1.5 py-[14px] items-center justify-center"
    >
      <ShareIcon height={20} width={20} />
      <Text className="typo-body1 text-semantic-text-primary">공유하기</Text>
    </ActionPressable>
  );
};

const VisitProfileAction = ({ authorId, dismiss }: VisitProfileActionProps) => {
  const handlePress = () => {
    dismiss();
    router.push(`/user/${authorId}`);
  };

  return (
    <Button
      button={{
        label: "집사 프로필 방문하기",
        onPress: handlePress,
        variant: "secondary",
        size: "lg",
      }}
    />
  );
};

const OwnerActions = ({ post, dismiss }: OwnerActionsProps) => {
  const pathname = usePathname();
  const setComposeData = useComposeStore((s) => s.setComposeData);
  const { mutate: deletePost, isPending } = useDeletePostMutation();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const handleEdit = () => {
    setComposeData({
      imageUris: [...post.images]
        .sort((a, b) => a.order - b.order)
        .map((image) => image.url),
      caption: post.content ?? "",
      selectedCats: post.cats.map((cat) => ({ id: cat.id, name: cat.name })),
      commentsEnabled: post.isCommentable,
      sharingEnabled: post.isShareable,
    });

    dismiss();
    router.push({
      pathname: ROUTES.POST.COMPOSE,
      params: { postId: post.id },
    });
  };

  const handleDelete = () => {
    if (isPending) return;

    setDeleteConfirmVisible(false);
    deletePost(post.id, {
      onSuccess: () => {
        dismiss();
        Toast.show({ type: "success", text1: "게시물을 삭제했어요" });

        if (pathname === ROUTES.POST.DETAIL(post.id)) {
          router.back();
        }
      },
      onError: () => {
        Toast.show({ type: "error", text1: "다시 시도해주세요" });
      },
    });
  };

  return (
    <>
      <ActionPressable
        onPress={handleEdit}
        className="flex-row gap-1.5 py-[14px] items-center justify-center"
      >
        <UpdateIcon height={20} width={20} />
        <Text className="typo-body1 text-semantic-text-primary">수정하기</Text>
      </ActionPressable>
      <ActionPressable
        onPress={() => setDeleteConfirmVisible(true)}
        disabled={isPending}
        className="flex-row gap-1.5 py-[14px] items-center justify-center disabled:opacity-50"
      >
        <TrashIcon height={20} width={20} />
        <Text className="typo-body1 text-semantic-text-primary">삭제하기</Text>
      </ActionPressable>
      <CenterModal
        visible={deleteConfirmVisible}
        onClose={() => setDeleteConfirmVisible(false)}
      >
        <View className="gap-5 rounded-[6px] bg-semantic-bg-primary px-4 pb-4 pt-6">
          <View className="gap-2">
            <Text className="typo-body1 text-semantic-text-primary">
              게시물을 삭제할까요?
            </Text>
            <Text className="typo-body3 text-semantic-text-tertiary">
              삭제한 게시물은 다시 복구할 수 없어요.
            </Text>
          </View>
          <View className="flex-row gap-1.5">
            <View className="flex-1">
              <Button
                button={{
                  label: "취소",
                  onPress: () => setDeleteConfirmVisible(false),
                  variant: "secondary",
                  size: "lg",
                }}
              />
            </View>
            <View className="flex-1">
              <Button
                button={{
                  label: "삭제하기",
                  onPress: handleDelete,
                  size: "lg",
                  isPending,
                }}
              />
            </View>
          </View>
        </View>
      </CenterModal>
    </>
  );
};

const MoreSheet = ({ MoreSheetModalRef, post }: MoreSheetProps) => {
  const { data: userProfile } = useUserProfileNonSuspenseQuery();
  const [reportExpanded, setReportExpanded] = useState(false);
  const isMyPost = userProfile?.id === post.authorId;

  const dismiss = () => MoreSheetModalRef.current?.dismiss();

  const handleDismiss = () => setReportExpanded(false);

  return (
    <BaseBottomSheet
      BaseBottomSheetModalRef={MoreSheetModalRef}
      onDismiss={handleDismiss}
      keyboardBehavior={reportExpanded ? "interactive" : undefined}
      keyboardBlurBehavior={reportExpanded ? "restore" : undefined}
    >
      {reportExpanded ? (
        <ReportAction
          post={post}
          dismiss={dismiss}
          expanded={true}
          onExpand={() => setReportExpanded(true)}
        />
      ) : (
        <View className="flex-1 flex-col w-full justify-center pb-16 pt-6">
          {isMyPost ? (
            <OwnerActions post={post} dismiss={dismiss} />
          ) : (
            <>
              <ReportAction
                post={post}
                dismiss={dismiss}
                expanded={false}
                onExpand={() => setReportExpanded(true)}
              />
              <BlockAction post={post} dismiss={dismiss} />
            </>
          )}
          {post.isShareable && <ShareAction post={post} dismiss={dismiss} />}
          {!isMyPost && (
            <VisitProfileAction authorId={post.author.id} dismiss={dismiss} />
          )}
        </View>
      )}
    </BaseBottomSheet>
  );
};

export default MoreSheet;
