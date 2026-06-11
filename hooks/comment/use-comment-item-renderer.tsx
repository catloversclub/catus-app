import { Comment } from "@/api/domains/comment/types";
import { useUserProfileNonSuspenseQuery } from "@/api/domains/user/queries";
import CommentItem from "@/components/comment/item";
import { ReplyTarget } from "@/components/comment/input-bar";
import useCommentActions from "@/hooks/comment/use-comment-actions";
import { useCallback, useState } from "react";

interface UseCommentItemRendererParams {
  postId: string;
  onReply?: (target: ReplyTarget) => void;
}

const useCommentItemRenderer = ({
  postId,
  onReply,
}: UseCommentItemRendererParams) => {
  const { data: me } = useUserProfileNonSuspenseQuery();
  const { handleToggleLike } = useCommentActions(postId);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleReplies = useCallback((commentId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }, []);

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentItem
        postId={postId}
        comment={item}
        currentUserId={me?.id}
        isRepliesExpanded={expandedIds.has(item.id)}
        onToggleReplies={() => toggleReplies(item.id)}
        onReply={onReply}
        onToggleLike={handleToggleLike}
      />
    ),
    [expandedIds, handleToggleLike, me?.id, onReply, postId, toggleReplies],
  );

  return { renderComment };
};

export default useCommentItemRenderer;
