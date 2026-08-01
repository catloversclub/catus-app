import PostActionButtons from "@/components/post/action-buttons";
import { View } from "react-native";

interface PostOverlayActionsProps {
  isLikedByMe: boolean;
  likeCount: number;
  commentCount: number;
  isBookmarkedByMe: boolean;
  isCommentable: boolean;
  onLike: () => void;
  onCommentPress: () => void;
  onBookmark: () => void;
}

const PostOverlayActions = ({
  isLikedByMe,
  likeCount,
  commentCount,
  isBookmarkedByMe,
  isCommentable,
  onLike,
  onCommentPress,
  onBookmark,
}: PostOverlayActionsProps) => {
  return (
    <View className="absolute bottom-1.5 right-1.5 z-10">
      <PostActionButtons
        isLikedByMe={isLikedByMe}
        likeCount={likeCount}
        commentCount={commentCount}
        isBookmarkedByMe={isBookmarkedByMe}
        onLike={onLike}
        onCommentPress={isCommentable ? onCommentPress : undefined}
        onBookmark={onBookmark}
      />
    </View>
  );
};

export default PostOverlayActions;
