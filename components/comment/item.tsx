import { Comment } from "@/api/domains/comment/types";
import CommentActionSheet from "@/components/bottom-sheet/comment-action-sheet";
import CommentBody from "@/components/comment/body";
import { ReplyTarget } from "@/components/comment/input-bar";
import ActionPressable from "@/components/common/action-pressable";
import { Text } from "@/components/ui/text";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { memo, useRef, useState } from "react";
import { View } from "react-native";

interface CommentItemProps {
  postId: string;
  comment: Comment;
  currentUserId?: string;
  isRepliesExpanded: boolean;
  onToggleReplies: () => void;
  onReply?: (target: ReplyTarget) => void;
  onToggleLike: (comment: Comment) => void;
}

const CommentItem = ({
  postId,
  comment,
  currentUserId,
  isRepliesExpanded,
  onToggleReplies,
  onReply,
  onToggleLike,
}: CommentItemProps) => {
  const [selectedComment, setSelectedComment] = useState(comment);
  const actionSheetRef = useRef<BottomSheetModal>(null);

  const { id, author, replies } = comment;

  const handleLike = () => {
    onToggleLike(comment);
  };

  const handleReply = () => {
    onReply?.({ id, nickname: author.nickname });
  };

  const openActionSheet = (targetComment: Comment) => {
    setSelectedComment(targetComment);
    actionSheetRef.current?.present();
  };

  return (
    <View className="flex-col">
      <View className="flex-row items-start justify-between">
        <CommentBody
          comment={comment}
          onLike={handleLike}
          onReply={handleReply}
          onMorePress={() => openActionSheet(comment)}
        />
      </View>

      {replies && replies.length > 0 && (
        <>
          {!isRepliesExpanded && (
            <ActionPressable
              className="flex-row items-center justify-start gap-1.5 py-1.5 pl-12"
              onPress={onToggleReplies}
            >
              <View className="h-[1px] w-4 bg-semantic-border-primary" />
              <Text className="typo-label1 text-semantic-text-tertiary">
                답글 {replies.length}개 더 보기...
              </Text>
            </ActionPressable>
          )}

          {isRepliesExpanded && (
            <View className="bg-semantic-bg-secondary rounded">
              {replies.map((reply) => (
                <View key={reply.id} className="pl-12">
                  <CommentBody
                    comment={reply}
                    onLike={() => onToggleLike(reply)}
                    onMorePress={() => openActionSheet(reply)}
                  />
                </View>
              ))}

              <ActionPressable
                className="flex-row items-center gap-1.5 py-1.5 pl-12"
                onPress={onToggleReplies}
              >
                <View className="h-[1px] w-4 bg-semantic-border-primary" />
                <Text className="typo-label1 text-semantic-text-tertiary">
                  답글 닫기
                </Text>
              </ActionPressable>
            </View>
          )}
        </>
      )}

      <CommentActionSheet
        sheetRef={actionSheetRef}
        postId={postId}
        comment={selectedComment}
        currentUserId={currentUserId}
      />
    </View>
  );
};

export default memo(CommentItem);
