import {
  useLikeCommentMutation,
  usePostCommentsQuery,
  useUnlikeCommentMutation,
} from "@/api/domains/comment/queries";
import { Comment } from "@/api/domains/comment/types";
import { ReplyTarget } from "@/components/feed/comment-input-bar";
import CommentItem from "@/components/feed/comment-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useCallback } from "react";
import { View } from "react-native";

interface CommentListProps {
  postId: string;
  onReply?: (target: ReplyTarget) => void;
}

const CommentList = ({ postId, onReply }: CommentListProps) => {
  const { data: comments } = usePostCommentsQuery(postId);
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

  if (comments.length === 0) {
    return (
      <View className="items-center justify-center py-20">
        <Text className="typo-body2 text-semantic-text-secondary text-center">
          {"아직 댓글이 없어요!\n첫 댓글을 남겨볼까요?"}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onToggleLike={handleToggleLike}
        />
      ))}
    </View>
  );
};

const CommentItemSkeleton = () => (
  <View className="flex-row items-start gap-3 p-3">
    <Skeleton className="rounded-full" style={{ width: 36, height: 36 }} />
    <View className="flex-1 flex-col" style={{ gap: 6 }}>
      <Skeleton className="rounded" style={{ width: 80, height: 12 }} />
      <Skeleton className="rounded" style={{ width: 160, height: 14 }} />
      <Skeleton className="rounded" style={{ width: 48, height: 11 }} />
    </View>
    <Skeleton className="rounded" style={{ width: 14, height: 14 }} />
  </View>
);

const CommentListSkeleton = () => (
  <View>
    {[0, 1, 2].map((i) => (
      <CommentItemSkeleton key={i} />
    ))}
  </View>
);

export { CommentListSkeleton };
export default CommentList;
