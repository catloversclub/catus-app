import { useCallback, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { postCommentsQueryOptions } from "@/api/domains/comment/queries";
import {
  useBookmarkMutation,
  useLikePostMutation,
  useUnbookmarkMutation,
  useUnlikePostMutation,
} from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";

const usePostActions = (post: Post) => {
  const queryClient = useQueryClient();
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

  const handleCommentPressIn = useCallback(() => {
    if (!post.isCommentable) return;
    queryClient.prefetchQuery(postCommentsQueryOptions(post.id));
  }, [post.id, post.isCommentable, queryClient]);

  const handleCommentPress = useCallback(() => {
    if (!post.isCommentable) return;
    commentSheetRef.current?.present();
  }, [post.isCommentable]);

  const handleMorePress = useCallback(() => {
    moreSheetRef.current?.present();
  }, []);

  return {
    commentSheetRef,
    moreSheetRef,
    handleLike,
    handleBookmark,
    handleCommentPressIn,
    handleCommentPress,
    handleMorePress,
  };
};

export default usePostActions;
