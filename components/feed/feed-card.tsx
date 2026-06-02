import { Text, View } from "react-native";

import { Post } from "@/api/domains/post/types";
import MoreIcon from "@/assets/icons/more.svg";
import CommentSheet from "@/components/bottom-sheet/comment-sheet";
import MoreSheet from "@/components/bottom-sheet/more-sheet";
import IconButton from "@/components/common/icon-button";
import ProfileImage from "@/components/common/profile-image";
import PostCarousel from "@/components/feed/post-carousel";
import PostOverlayActions from "@/components/feed/post-overlay-actions";
import { useColors } from "@/hooks/use-colors";
import usePostActions from "@/hooks/use-post-actions";
import { formatRelativeTime } from "@/lib/utils";

interface ProfileInfoProps {
  post: Post;
  onMorePress: () => void;
}

const ProfileInfo = ({ post, onMorePress }: ProfileInfoProps) => {
  const { colors } = useColors();
  const catName = post.cat?.name ?? post.author.nickname;

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <ProfileImage
          imageUrl={post.cat?.profileImageUrl ?? null}
          size="sm"
          isCatLink
          catId={post.cat?.id}
        />
        <View>
          <Text className="typo-body3 text-semantic-text-primary">
            {catName}
          </Text>
          <Text className="typo-label1 text-semantic-text-secondary">
            {formatRelativeTime(post.createdAt)}
          </Text>
        </View>
      </View>
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
    handleCommentPress,
    handleMorePress,
  } = usePostActions(post);

  const overlay = (
    <PostOverlayActions
      isLikedByMe={post.isLikedByMe}
      isBookmarkedByMe={post.isBookmarkedByMe}
      onLike={handleLike}
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

export default FeedCard;
