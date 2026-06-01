import { Image } from "expo-image";
import { Link } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";

import {
  useBookmarkMutation,
  useLikePostMutation,
  useUnbookmarkMutation,
  useUnlikePostMutation,
} from "@/api/domains/post/queries";
import { Post, PostImage } from "@/api/domains/post/types";

import MoreIcon from "@/assets/icons/more.svg";
import CommentSheet from "@/components/bottom-sheet/comment-sheet";
import MoreSheet from "@/components/bottom-sheet/more-sheet";
import IconButton from "@/components/common/icon-button";
import ProfileImage from "@/components/common/profile-image";
import { CAROUSEL_CONFIG } from "@/constants/config";
import { Bookmark, Heart, MessageCircle } from "@/lib/icons";
import { formatRelativeTime, getMediaUrl } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";

interface FeedCardProps {
  post: Post;
  isDetail?: boolean;
}

type ProfileInfoProps = {
  post: Post;
  onMorePress: () => void;
};

const ProfileInfo = ({ post, onMorePress }: ProfileInfoProps) => {
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

const FeedCard = ({ post, isDetail = false }: FeedCardProps) => {
  const [current, setCurrent] = useState(0);
  const { width } = useWindowDimensions();
  const carouselWidth = width - 32;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<PostImage>[] }) => {
      if (viewableItems.length > 0) {
        setCurrent(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  const { mutate: likePost } = useLikePostMutation();
  const { mutate: unlikePost } = useUnlikePostMutation();
  const { mutate: bookmarkPost } = useBookmarkMutation();
  const { mutate: unbookmarkPost } = useUnbookmarkMutation();

  const commentSheetRef = useRef<BottomSheetModal>(null);
  const moreSheetRef = useRef<BottomSheetModal>(null);

  const handleLike = () => {
    if (post.isLikedByMe) {
      unlikePost({ postId: post.id });
    } else {
      likePost({ postId: post.id });
    }
  };

  const handleBookmark = () => {
    if (post.isBookmarkedByMe) {
      unbookmarkPost({ postId: post.id });
    } else {
      bookmarkPost({ postId: post.id });
    }
  };

  const handleCommentPress = useCallback(() => {
    commentSheetRef.current?.present();
  }, []);

  const handleMorePress = useCallback(() => {
    moreSheetRef.current?.present();
  }, []);

  const catName = post.cat?.name ?? post.author.nickname;

  return (
    <View className="mb-5 flex-col gap-3 px-3">
      {isDetail && <ProfileInfo post={post} onMorePress={handleMorePress} />}

      <View className="relative overflow-hidden rounded-md">
        <FlatList
          data={post.images}
          keyExtractor={(image) => image.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={CAROUSEL_CONFIG}
          renderItem={({ item, index }) => (
            <Link href={`/post/${post.id}`} asChild>
              <Pressable>
                <Image
                  source={getMediaUrl(item.url)}
                  alt={`${catName} photo ${index + 1}`}
                  style={{ width: carouselWidth, height: carouselWidth }}
                />
              </Pressable>
            </Link>
          )}
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80 }}
          pointerEvents="none"
        />

        {post.images.length > 1 && (
          <View
            className="absolute right-1.5 top-1.5 z-10 rounded bg-semantic-dimmed-primary px-2 py-1.5"
            pointerEvents="none"
          >
            <Text className="typo-label2 text-gray-0">
              {current + 1} / {post.images.length}
            </Text>
          </View>
        )}

        {!isDetail && (
          <View className="absolute bottom-1.5 right-1.5 z-10 flex-row items-center">
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
          </View>
        )}
      </View>

      {post.images.length > 1 && (
        <View className="w-full flex-row justify-center gap-1.5">
          {post.images.map((_, index) => (
            <View
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${
                index === current ? "bg-semantic-icon-accent" : "bg-semantic-icon-minor"
              }`}
            />
          ))}
        </View>
      )}

      {!isDetail && <ProfileInfo post={post} onMorePress={handleMorePress} />}

      {isDetail && (
        <>
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
        </>
      )}

      <CommentSheet CommentSheetModalRef={commentSheetRef} postId={post.id} />
      <MoreSheet MoreSheetModalRef={moreSheetRef} />
    </View>
  );
};

export default FeedCard;
