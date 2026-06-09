import {
  useDeleteCommentMutation,
  useReportCommentMutation,
} from "@/api/domains/comment/queries";
import { Comment } from "@/api/domains/comment/types";
import BanIcon from "@/assets/icons/ban.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import ActionPressable from "@/components/common/action-pressable";
import { Text } from "@/components/ui/text";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

interface CommentActionSheetProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  postId: string;
  comment: Comment;
  currentUserId?: string;
}

const CommentActionSheet = ({
  sheetRef,
  postId,
  comment,
  currentUserId,
}: CommentActionSheetProps) => {
  const { mutate: deleteComment } = useDeleteCommentMutation();
  const { mutate: reportComment } = useReportCommentMutation();
  const canDelete = comment.author.id === currentUserId;

  const dismiss = () => sheetRef.current?.dismiss();

  const handleDelete = () => {
    deleteComment(
      { postId, commentId: comment.id },
      {
        onSuccess: () => {
          dismiss();
          Toast.show({ type: "success", text1: "댓글을 삭제했어요" });
        },
        onError: () => {
          Toast.show({ type: "error", text1: "다시 시도해주세요" });
        },
      },
    );
  };

  const handleReport = () => {
    reportComment(comment.id, {
      onSuccess: () => {
        dismiss();
        Toast.show({ type: "success", text1: "신고가 접수 되었어요" });
      },
      onError: () => {
        Toast.show({ type: "error", text1: "다시 시도해주세요" });
      },
    });
  };

  return (
    <BaseBottomSheet BaseBottomSheetModalRef={sheetRef} stackBehavior="push">
      <View className="flex-1 flex-col w-full justify-center pb-16 pt-6">
        {canDelete ? (
          <ActionPressable
            onPress={handleDelete}
            className="flex-row gap-1.5 py-[14px] items-center justify-center"
          >
            <TrashIcon height={20} width={20} />
            <Text className="typo-body1 text-semantic-text-primary">
              삭제하기
            </Text>
          </ActionPressable>
        ) : (
          <ActionPressable
            onPress={handleReport}
            className="flex-row gap-1.5 py-[14px] items-center justify-center"
          >
            <BanIcon height={20} width={20} />
            <Text className="typo-body1 text-semantic-text-primary">
              신고하기
            </Text>
          </ActionPressable>
        )}
      </View>
    </BaseBottomSheet>
  );
};

export default CommentActionSheet;
