import PostActionButtons from "@/components/post/action-buttons";
import { View } from "react-native";

interface PostOverlayActionsProps {
  isLikedByMe: boolean;
  likeCount: number;
  isBookmarkedByMe: boolean;
  isCommentable: boolean;
  onLike: () => void;
  onCommentPressIn?: () => void;
  onCommentPress: () => void;
  onBookmark: () => void;
}

const PostOverlayActions = ({
  isLikedByMe,
  likeCount,
  isBookmarkedByMe,
  isCommentable,
  onLike,
  onCommentPressIn,
  onCommentPress,
  onBookmark,
}: PostOverlayActionsProps) => {
  return (
    <View className="absolute bottom-1.5 right-1.5 z-10">
      <PostActionButtons
        isLikedByMe={isLikedByMe}
        likeCount={likeCount}
        isBookmarkedByMe={isBookmarkedByMe}
        onLike={onLike}
        onCommentPressIn={onCommentPressIn}
        onCommentPress={isCommentable ? onCommentPress : undefined}
        onBookmark={onBookmark}
      />
    </View>
  );
};

export default PostOverlayActions;
