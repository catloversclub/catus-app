import { Text, useWindowDimensions, View } from "react-native";

import { usePostByIdQuery } from "@/api/domains/post/queries";
import CommentSheet from "@/components/bottom-sheet/comment-sheet";
import MoreSheet from "@/components/bottom-sheet/more-sheet";
import PostActionButtons from "@/components/post/action-buttons";
import PostCarousel from "@/components/post/carousel";
import { PostProfileHeader } from "@/components/post/profile-info";
import { Skeleton } from "@/components/ui/skeleton";
import usePostActions from "@/hooks/use-post-actions";
import { Stack } from "expo-router";

const PostDetailCard = ({ postId }: { postId: string }) => {
  const { data: post } = usePostByIdQuery(postId);
  const {
    commentSheetRef,
    moreSheetRef,
    handleLike,
    handleBookmark,
    handleMorePress,
  } = usePostActions(post);

  return (
    <View className="flex-col gap-3 px-3">
      <Stack.Screen options={{ title: `${post.author.nickname}의 게시물` }} />
      <PostProfileHeader post={post} onMorePress={handleMorePress} />
      <PostCarousel post={post} linkable={false} />
      <View className="typo-body4">
        <Text className="text-semantic-text-primary pt-2">{post.content}</Text>
      </View>
      <View className="self-end">
        <PostActionButtons
          isLikedByMe={post.isLikedByMe}
          likeCount={post.likeCount}
          isBookmarkedByMe={post.isBookmarkedByMe}
          onLike={handleLike}
          onBookmark={handleBookmark}
        />
      </View>
      {post.isCommentable && (
        <CommentSheet CommentSheetModalRef={commentSheetRef} postId={post.id} />
      )}
      <MoreSheet MoreSheetModalRef={moreSheetRef} post={post} />
    </View>
  );
};

const PostDetailCardSkeleton = () => {
  const { width } = useWindowDimensions();
  const imageSize = width - 24;

  return (
    <View className="flex-col gap-3 px-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Skeleton
            className="rounded-full"
            style={{ width: 36, height: 36 }}
          />
          <View style={{ gap: 6 }}>
            <Skeleton className="rounded" style={{ width: 96, height: 14 }} />
            <Skeleton className="rounded" style={{ width: 56, height: 12 }} />
          </View>
        </View>
        <Skeleton className="rounded" style={{ width: 24, height: 24 }} />
      </View>
      <Skeleton style={{ width: imageSize, height: imageSize }} />
      <Skeleton className="rounded" style={{ width: "75%", height: 14 }} />
      <View className="flex-row items-center justify-end gap-4">
        <Skeleton className="rounded" style={{ width: 20, height: 20 }} />
        <Skeleton className="rounded" style={{ width: 20, height: 20 }} />
      </View>
    </View>
  );
};

export { PostDetailCardSkeleton };
export default PostDetailCard;
