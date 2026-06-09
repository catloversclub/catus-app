import { useWindowDimensions, View } from "react-native";

import { Post } from "@/api/domains/post/types";
import CommentSheet from "@/components/bottom-sheet/comment-sheet";
import MoreSheet from "@/components/bottom-sheet/more-sheet";
import PostCarousel from "@/components/post/carousel";
import PostOverlayActions from "@/components/post/overlay-actions";
import { PostProfileHeader } from "@/components/post/profile-info";
import { Skeleton } from "@/components/ui/skeleton";
import usePostActions from "@/hooks/use-post-actions";

const FeedCard = ({ post }: { post: Post }) => {
  const {
    commentSheetRef,
    moreSheetRef,
    handleLike,
    handleBookmark,
    handleCommentPressIn,
    handleCommentPress,
    handleMorePress,
  } = usePostActions(post);

  const overlay = (
    <PostOverlayActions
      isLikedByMe={post.isLikedByMe}
      isBookmarkedByMe={post.isBookmarkedByMe}
      onLike={handleLike}
      onCommentPressIn={handleCommentPressIn}
      onCommentPress={handleCommentPress}
      onBookmark={handleBookmark}
    />
  );

  return (
    <View className="mb-5 flex-col gap-3 px-3">
      <PostCarousel post={post} overlay={overlay} />
      <PostProfileHeader post={post} onMorePress={handleMorePress} />
      <CommentSheet CommentSheetModalRef={commentSheetRef} postId={post.id} />
      <MoreSheet MoreSheetModalRef={moreSheetRef} post={post} />
    </View>
  );
};

const FeedCardSkeleton = () => {
  const { width } = useWindowDimensions();
  const imageSize = width - 24;

  return (
    <View style={{ marginBottom: 20, gap: 12, paddingHorizontal: 12 }}>
      <Skeleton style={{ width: imageSize, height: imageSize }} />
      <View style={{ flexDirection: "row", gap: 6, justifyContent: "center" }}>
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            className="rounded-full"
            style={{ width: 6, height: 6 }}
          />
        ))}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Skeleton className="rounded-full" style={{ width: 36, height: 36 }} />
        <View style={{ gap: 6 }}>
          <Skeleton className="rounded" style={{ width: 96, height: 14 }} />
          <Skeleton className="rounded" style={{ width: 56, height: 12 }} />
        </View>
      </View>
    </View>
  );
};

export { FeedCardSkeleton };

export default FeedCard;
