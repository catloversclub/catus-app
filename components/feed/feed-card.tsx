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
import { Bookmark, Heart, MessageCircle } from "@/lib/icons";
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
    <Pressable className="absolute bottom-1.5 right-1.5 z-10 flex-row items-center" onPress={() => {}}>
      <Pressable onPress={handleLike} className="px-2 py-3 active:opacity-60">
        <Heart
          size={20}
          className={
            post.isLikedByMe
              ? "fill-semantic-icon-error text-semantic-icon-error"
              : "text-white"
          }
        />
      </Pressable>
      <Pressable onPress={handleCommentPress} className="px-2 py-3 active:opacity-60">
        <MessageCircle size={20} className="text-white" />
      </Pressable>
      <Pressable onPress={handleBookmark} className="px-2 py-3 active:opacity-60">
        <Bookmark
          size={20}
          className={
            post.isBookmarkedByMe
              ? "fill-semantic-icon-accent text-semantic-icon-accent"
              : "text-white"
          }
        />
      </Pressable>
    </Pressable>
  );

  return (
    <View className="mb-5 flex-col gap-3 px-3">
      <PostCarousel post={post} overlay={overlay} />
      <ProfileInfo post={post} onMorePress={handleMorePress} />
      <CommentSheet CommentSheetModalRef={commentSheetRef} postId={post.id} />
      <MoreSheet MoreSheetModalRef={moreSheetRef} />
    </View>
  );
};

export default FeedCard;
