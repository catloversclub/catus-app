import {
  useLikeCommentMutation,
  useUnlikeCommentMutation,
} from "@/api/domains/comment/queries";
import { Comment } from "@/api/domains/comment/types";
import { useCallback } from "react";

const useCommentActions = (postId: string) => {
  const { mutate: likeComment } = useLikeCommentMutation();
  const { mutate: unlikeComment } = useUnlikeCommentMutation();

  const handleToggleLike = useCallback(
    (comment: Comment) => {
      if (comment.isLikedByMe) {
        unlikeComment({ postId, commentId: comment.id });
      } else {
        likeComment({ postId, commentId: comment.id });
      }
    },
    [likeComment, postId, unlikeComment],
  );

  return { handleToggleLike };
};

export default useCommentActions;
