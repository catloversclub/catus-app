import { useWindowDimensions, View } from "react-native";

import { Post } from "@/api/domains/post/types";
import MoreIcon from "@/assets/icons/more.svg";
import CommentSheet from "@/components/bottom-sheet/comment-sheet";
import MoreSheet from "@/components/bottom-sheet/more-sheet";
import IconButton from "@/components/common/icon-button";
import PostCarousel from "@/components/post/carousel";
import PostOverlayActions from "@/components/post/overlay-actions";
import {
  CatPostProfileInfo,
  UserPostProfileInfo,
} from "@/components/post/profile-info";
import { Skeleton } from "@/components/ui/skeleton";
import { useColors } from "@/hooks/use-colors";
import usePostActions from "@/hooks/use-post-actions";
import { formatRelativeTime } from "@/lib/utils";

interface ProfileInfoProps {
  post: Post;
  onMorePress: () => void;
}

const ProfileInfo = ({ post, onMorePress }: ProfileInfoProps) => {
  const { colors } = useColors();
  const primaryCat = post.cats[0];

  return (
    <View className="flex-row items-center justify-between">
      {primaryCat ? (
        <CatPostProfileInfo
          imageUrl={primaryCat.profileImageUrl}
          catId={primaryCat.id}
          name={primaryCat.name}
          subtitle={formatRelativeTime(post.createdAt)}
        />
      ) : (
        <UserPostProfileInfo
          imageUrl={post.author.profileImageUrl}
          userId={post.author.id}
          name={post.author.nickname}
          subtitle={formatRelativeTime(post.createdAt)}
        />
      )}
      <IconButton onPress={onMorePress}>
        <MoreIcon color={colors.icon.primary} />
      </IconButton>
    </View>
  );
};

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
      <ProfileInfo post={post} onMorePress={handleMorePress} />
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
