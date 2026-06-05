import { Bookmark, Heart, MessageCircle } from "@/lib/icons";
import { Pressable, View } from "react-native";

interface PostOverlayActionsProps {
  isLikedByMe: boolean;
  isBookmarkedByMe: boolean;
  onLike: () => void;
  onCommentPressIn?: () => void;
  onCommentPress: () => void;
  onBookmark: () => void;
}

const PostOverlayActions = ({
  isLikedByMe,
  isBookmarkedByMe,
  onLike,
  onCommentPressIn,
  onCommentPress,
  onBookmark,
}: PostOverlayActionsProps) => {
  return (
    <View className="absolute bottom-1.5 right-1.5 z-10 flex-row items-center">
      <Pressable onPress={onLike} className="px-2 py-3 active:opacity-60">
        <Heart
          size={20}
          className={
            isLikedByMe
              ? "fill-semantic-icon-error text-semantic-icon-error"
              : "text-white"
          }
        />
      </Pressable>
      <Pressable
        onPressIn={onCommentPressIn}
        onPress={onCommentPress}
        className="px-2 py-3 active:opacity-60"
      >
        <MessageCircle size={20} className="text-white" />
      </Pressable>
      <Pressable onPress={onBookmark} className="px-2 py-3 active:opacity-60">
        <Bookmark
          size={20}
          className={
            isBookmarkedByMe
              ? "fill-semantic-icon-accent text-semantic-icon-accent"
              : "text-white"
          }
        />
      </Pressable>
    </View>
  );
};

export default PostOverlayActions;
