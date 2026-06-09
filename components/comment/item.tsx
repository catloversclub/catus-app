import { Comment } from "@/api/domains/comment/types";
import CommentBody from "@/components/comment/body";
import { ReplyTarget } from "@/components/comment/input-bar";
import ActionPressable from "@/components/common/action-pressable";
import { Text } from "@/components/ui/text";
import { memo, useState } from "react";
import { View } from "react-native";

interface CommentItemProps {
  comment: Comment;
  onReply?: (target: ReplyTarget) => void;
  onToggleLike: (comment: Comment) => void;
}

const CommentItem = ({ comment, onReply, onToggleLike }: CommentItemProps) => {
  const [isRepliesExpanded, setIsRepliesExpanded] = useState(false);

  const { id, author, replies } = comment;

  const handleLike = () => {
    onToggleLike(comment);
  };

  const handleReply = () => {
    onReply?.({ id, nickname: author.nickname });
  };

  return (
    <View className="flex-col">
      <View className="flex-row items-start justify-between">
        <CommentBody
          comment={comment}
          onLike={handleLike}
          onReply={handleReply}
        />
      </View>

      {replies && replies.length > 0 && (
        <>
          {!isRepliesExpanded && (
            <ActionPressable
              className="flex-row items-center justify-start gap-1.5 py-1.5 pl-12"
              onPress={() => setIsRepliesExpanded(true)}
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
                  />
                </View>
              ))}

              <ActionPressable
                className="flex-row items-center gap-1.5 py-1.5 pl-12"
                onPress={() => setIsRepliesExpanded(false)}
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
    </View>
  );
};

export default memo(CommentItem);
