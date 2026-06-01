import { useCallback, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  useBookmarkMutation,
  useLikePostMutation,
  useUnbookmarkMutation,
  useUnlikePostMutation,
} from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";

const usePostActions = (post: Post) => {
  const { mutate: likePost } = useLikePostMutation();
  const { mutate: unlikePost } = useUnlikePostMutation();
  const { mutate: bookmarkPost } = useBookmarkMutation();
  const { mutate: unbookmarkPost } = useUnbookmarkMutation();

  const commentSheetRef = useRef<BottomSheetModal>(null);
  const moreSheetRef = useRef<BottomSheetModal>(null);

  const handleLike = () => {
    if (post.isLikedByMe) {
      unlikePost({ postId: post.id });
    } else {
      likePost({ postId: post.id });
    }
  };

  const handleBookmark = () => {
    if (post.isBookmarkedByMe) {
      unbookmarkPost({ postId: post.id });
    } else {
      bookmarkPost({ postId: post.id });
    }
  };

  const handleCommentPress = useCallback(() => {
    commentSheetRef.current?.present();
  }, []);

  const handleMorePress = useCallback(() => {
    moreSheetRef.current?.present();
  }, []);

  return {
    commentSheetRef,
    moreSheetRef,
    handleLike,
    handleBookmark,
    handleCommentPress,
    handleMorePress,
  };
};

export default usePostActions;
