import ActionPressable from "@/components/common/action-pressable";
import { Text } from "@/components/ui/text";
import { Bookmark, Heart, MessageCircle } from "@/lib/icons";
import { View } from "react-native";

interface PostActionButtonsProps {
  isLikedByMe: boolean;
  likeCount?: number;
  isBookmarkedByMe: boolean;
  onLike: () => void;
  onCommentPressIn?: () => void;
  onCommentPress?: () => void;
  onBookmark: () => void;
}

const PostActionButtons = ({
  isLikedByMe,
  likeCount = 0,
  isBookmarkedByMe,
  onLike,
  onCommentPressIn,
  onCommentPress,
  onBookmark,
}: PostActionButtonsProps) => {
  return (
    <View className="flex-row items-center">
      <ActionPressable
        onPress={onLike}
        className="flex-row items-center gap-0.5 px-2 py-3"
      >
        <Heart
          size={24}
          className={
            isLikedByMe
              ? "fill-semantic-icon-error text-semantic-icon-error"
              : "text-white"
          }
        />
        {likeCount > 0 && (
          <Text className="typo-label1 text-white">{likeCount}</Text>
        )}
      </ActionPressable>
      {onCommentPress && (
        <ActionPressable
          onPressIn={onCommentPressIn}
          onPress={onCommentPress}
          className="px-2 py-3"
        >
          <MessageCircle size={24} className="text-white" />
        </ActionPressable>
      )}
      <ActionPressable onPress={onBookmark} className="px-2 py-3">
        <Bookmark
          size={24}
          className={
            isBookmarkedByMe
              ? "fill-semantic-icon-accent text-semantic-icon-accent"
              : "text-white"
          }
        />
      </ActionPressable>
    </View>
  );
};

export default PostActionButtons;
