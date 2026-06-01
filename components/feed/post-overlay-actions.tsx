import { Bookmark, Heart, MessageCircle } from "@/lib/icons";
import { Pressable } from "react-native";

interface PostOverlayActionsProps {
  isLikedByMe: boolean;
  isBookmarkedByMe: boolean;
  onLike: () => void;
  onCommentPress: () => void;
  onBookmark: () => void;
}

const PostOverlayActions = ({
  isLikedByMe,
  isBookmarkedByMe,
  onLike,
  onCommentPress,
  onBookmark,
}: PostOverlayActionsProps) => {
  return (
    <Pressable
      className="absolute bottom-1.5 right-1.5 z-10 flex-row items-center"
      onPress={() => {}}
    >
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
    </Pressable>
  );
};

export default PostOverlayActions;
