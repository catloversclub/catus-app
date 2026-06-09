import { usePostCommentsQuery } from "@/api/domains/comment/queries";
import { Comment } from "@/api/domains/comment/types";
import { useUserProfileNonSuspenseQuery } from "@/api/domains/user/queries";
import { ReplyTarget } from "@/components/comment/input-bar";
import CommentItem from "@/components/comment/item";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import useCommentActions from "@/hooks/comment/use-comment-actions";
import { useScrollToTop } from "@react-navigation/native";
import type { ReactElement } from "react";
import { useCallback } from "react";
import { RefreshControlProps, StyleProp, View, ViewStyle } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

interface CommentListProps {
  postId: string;
  onReply?: (target: ReplyTarget) => void;
  ListHeaderComponent?: ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
  refreshControl?: ReactElement<RefreshControlProps>;
}

const CommentList = ({
  postId,
  onReply,
  ListHeaderComponent,
  contentContainerStyle,
  refreshControl,
}: CommentListProps) => {
  const listRef = useAnimatedRef<Animated.FlatList<Comment>>();
  useScrollToTop(listRef);

  const { data: comments } = usePostCommentsQuery(postId);
  const { data: me } = useUserProfileNonSuspenseQuery();
  const { handleToggleLike } = useCommentActions(postId);

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentItem
        postId={postId}
        comment={item}
        currentUserId={me?.id}
        onReply={onReply}
        onToggleLike={handleToggleLike}
      />
    ),
    [handleToggleLike, me?.id, onReply, postId],
  );

  const listEmptyComponent = useCallback(
    () => (
      <View className="items-center justify-center py-20">
        <Text className="typo-body2 text-semantic-text-secondary text-center">
          {"아직 댓글이 없어요!\n첫 댓글을 남겨볼까요?"}
        </Text>
      </View>
    ),
    [],
  );

  return (
    <Animated.FlatList
      ref={listRef}
      className="flex-1"
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={renderComment}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={listEmptyComponent}
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
      refreshControl={refreshControl}
      initialNumToRender={8}
      maxToRenderPerBatch={6}
      updateCellsBatchingPeriod={50}
      windowSize={5}
      keyboardShouldPersistTaps="always"
    />
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
