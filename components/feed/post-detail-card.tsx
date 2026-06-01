import { Pressable, Text, View } from "react-native";

import { Post } from "@/api/domains/post/types";
import MoreIcon from "@/assets/icons/more.svg";
import CommentSheet from "@/components/bottom-sheet/comment-sheet";
import MoreSheet from "@/components/bottom-sheet/more-sheet";
import IconButton from "@/components/common/icon-button";
import ProfileImage from "@/components/common/profile-image";
import PostCarousel from "@/components/feed/post-carousel";
import { useColors } from "@/hooks/use-colors";
import usePostActions from "@/hooks/use-post-actions";
import { Bookmark, Heart } from "@/lib/icons";
import { formatRelativeTime } from "@/lib/utils";

const ProfileInfo = ({ post, onMorePress }: { post: Post; onMorePress: () => void }) => {
  const { colors } = useColors();
  const catName = post.cat?.name ?? post.author.nickname;

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <ProfileImage imageUrl={post.cat?.profileImageUrl ?? null} size="sm" />
        <View>
          <Text className="typo-body3 text-semantic-text-primary">{catName}</Text>
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

const PostDetailCard = ({ post }: { post: Post }) => {
  const {
    commentSheetRef,
    moreSheetRef,
    handleLike,
    handleBookmark,
    handleMorePress,
  } = usePostActions(post);

  return (
    <View className="flex-col gap-3 px-3">
      <ProfileInfo post={post} onMorePress={handleMorePress} />
      <PostCarousel post={post} linkable={false} />
      <View className="typo-body4">
        <Text className="text-semantic-text-primary">{post.content}</Text>
      </View>
      <View className="flex-row items-center justify-end gap-4">
        <Pressable onPress={handleLike} className="active:opacity-60">
          <Heart
            size={20}
            className={
              post.isLikedByMe
                ? "fill-semantic-icon-error text-semantic-icon-error"
                : "text-semantic-text-tertiary"
            }
          />
        </Pressable>
        <Pressable onPress={handleBookmark} className="active:opacity-60">
          <Bookmark
            size={20}
            className={
              post.isBookmarkedByMe
                ? "fill-semantic-icon-accent text-semantic-icon-accent"
                : "text-semantic-text-tertiary"
            }
          />
        </Pressable>
      </View>
      <CommentSheet CommentSheetModalRef={commentSheetRef} postId={post.id} />
      <MoreSheet MoreSheetModalRef={moreSheetRef} />
    </View>
  );
};

export default PostDetailCard;
