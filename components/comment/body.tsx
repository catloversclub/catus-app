import { Comment } from "@/api/domains/comment/types";
import ActionPressable from "@/components/common/action-pressable";
import ProfileImage from "@/components/common/profile-image";
import { Text } from "@/components/ui/text";
import { Heart, MessageCircle, MoreVertical } from "@/lib/icons";
import { formatRelativeTime } from "@/lib/utils";
import { type Href } from "expo-router";
import { View } from "react-native";

interface CommentBodyProps {
  comment: Comment;
  onLike?: () => void;
  onReply?: () => void;
  onMorePress?: () => void;
}

const CommentBody = ({
  comment,
  onLike,
  onReply,
  onMorePress,
}: CommentBodyProps) => {
  const { author, content, createdAt, isLikedByMe, likeCount } = comment;
  const href: Href = { pathname: "/user/[id]", params: { id: author.id } };
  const hasActions = onLike || onReply;

  return (
    <View className="flex-row flex-1 items-start gap-3 p-3">
      <ProfileImage
        imageUrl={author.profileImageUrl}
        size="sm"
        href={href}
        alt={`${author.id} profile`}
      />
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <ActionPressable href={href} className="self-start">
            <Text className="typo-label1 text-semantic-text-primary">
              {author.nickname}
            </Text>
          </ActionPressable>
          {onMorePress && (
            <ActionPressable
              onPress={onMorePress}
              className="-mr-2 -mt-1 p-2"
              hitSlop={8}
            >
              <MoreVertical
                size={16}
                className="text-semantic-text-tertiary"
              />
            </ActionPressable>
          )}
        </View>
        <Text className="typo-body4 mt-1 text-semantic-text-primary">
          {content}
        </Text>
        <View className="mt-1.5 flex-row justify-between">
          <Text className="typo-label1 text-semantic-text-secondary">
            {formatRelativeTime(createdAt)}
          </Text>
          {hasActions && (
            <View className="flex-row items-center">
              {onLike && (
                <ActionPressable
                  onPress={onLike}
                  className="flex-row items-center gap-0.5 px-2"
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
              )}
              {onReply && (
                <ActionPressable onPress={onReply} className="px-2 py-1">
                  <MessageCircle
                    size={14}
                    className="text-semantic-text-tertiary"
                  />
                </ActionPressable>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default CommentBody;
