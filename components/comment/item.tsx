import { Comment } from "@/api/domains/comment/types";
import { ReplyTarget } from "@/components/comment/input-bar";
import CommentProfileInfo from "@/components/comment/profile-info";
import ActionPressable from "@/components/common/action-pressable";
import { Text } from "@/components/ui/text";
import { Heart, MessageCircle } from "@/lib/icons";
import { formatRelativeTime } from "@/lib/utils";
import { memo, useState } from "react";
import { View } from "react-native";

interface CommentActionsProps {
  isLikedByMe: boolean;
  likeCount: number;
  onLike: () => void;
  onReply: () => void;
}

const CommentActions = ({
  isLikedByMe,
  likeCount,
  onLike,
  onReply,
}: CommentActionsProps) => {
  return (
    <View className="flex-row items-center">
      <ActionPressable
        onPress={onLike}
        className="items-center gap-0.5 px-2 py-1"
      >
        <Heart
          size={14}
          className={
            isLikedByMe
              ? "fill-semantic-icon-error text-semantic-icon-error"
              : "text-semantic-text-tertiary"
          }
        />
        {likeCount > 0 && (
          <Text className="typo-label1 text-semantic-text-tertiary">
            {likeCount}
          </Text>
        )}
      </ActionPressable>
      <ActionPressable onPress={onReply} className="px-2 py-1">
        <MessageCircle size={14} className="text-semantic-text-tertiary" />
      </ActionPressable>
    </View>
  );
};

const ReplyItem = ({ reply }: { reply: Comment }) => (
  <View className="px-3 pb-2 pl-12 pt-3">
    <CommentProfileInfo
      imageUrl={reply.author.profileImageUrl}
      userId={reply.author.id}
      name={reply.author.nickname}
      content={reply.content}
      createdAtLabel={formatRelativeTime(reply.createdAt)}
    />
  </View>
);

type CommentItemProps = {
  comment: Comment;
  onReply?: (target: ReplyTarget) => void;
  onToggleLike: (comment: Comment) => void;
};

const CommentItem = ({ comment, onReply, onToggleLike }: CommentItemProps) => {
  const [isRepliesExpanded, setIsRepliesExpanded] = useState(false);

  const { id, author, content, isLikedByMe, likeCount, createdAt, replies } =
    comment;

  const handleLike = () => {
    onToggleLike(comment);
  };

  const handleReply = () => {
    onReply?.({ id, nickname: author.nickname });
  };

  return (
    <View className="flex-col">
      <View className="flex-row items-start justify-between p-3 pb-3">
        <CommentProfileInfo
          imageUrl={author.profileImageUrl}
          userId={author.id}
          name={author.nickname}
          content={content}
          createdAtLabel={formatRelativeTime(createdAt)}
        />
        <CommentActions
          isLikedByMe={isLikedByMe}
          likeCount={likeCount}
          onLike={handleLike}
          onReply={handleReply}
        />
      </View>

      {replies && replies.length > 0 ? (
        <>
          {!isRepliesExpanded && (
            <ActionPressable
              className="flex-row items-center justify-start gap-1.5 py-2 pl-12"
              onPress={() => setIsRepliesExpanded(true)}
            >
              <View className="h-[1px] w-4 bg-semantic-border-primary" />
              <Text className="typo-label1 text-semantic-text-tertiary">
                답글 {replies.length}개 더 보기...
              </Text>
            </ActionPressable>
          )}

          {isRepliesExpanded && (
            <View className="bg-semantic-bg-secondary pb-2">
              {replies.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} />
              ))}

              <ActionPressable
                className="flex-row items-center gap-1.5 pb-4 pl-12 pt-2"
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
      ) : (
        <View className="h-5" />
      )}
    </View>
  );
};

export default memo(CommentItem);
