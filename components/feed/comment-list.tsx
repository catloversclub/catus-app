import { usePostCommentsQuery } from "@/api/domains/comment/queries";
import { Comment } from "@/api/domains/comment/types";
import CommentItem from "@/components/feed/comment-item";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface CommentListProps {
  postId: string;
}

const CommentList = ({ postId }: CommentListProps) => {
  const { data: comments } = usePostCommentsQuery(postId);

  if (comments.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Text className="typo-body4 text-semantic-text-tertiary">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </Text>
      </View>
    );
  }

  return (
    <View>
      {comments.map((comment: Comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </View>
  );
};

export default CommentList;
