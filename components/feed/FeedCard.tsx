import { Image } from "expo-image";
import { Link } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  useColorScheme,
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
import { CommentSheet } from "@/components/bottom-sheet/comment-sheet";
import { MoreSheet } from "@/components/bottom-sheet/more-sheet";
import { CAROUSEL_CONFIG } from "@/constants/config";
import { Bookmark, Heart, MessageCircle } from "@/lib/icons";
import { formatRelativeTime, getMediaUrl } from "@/lib/utils";
import { dark, light } from "@/styles/semantic-colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";

interface FeedCardProps {
  post: Post;
  isDetail?: boolean; // 선택적 prop으로 설정
  // CommentSheetModalRef?: React.RefObject<BottomSheetModal | null>;
  // MoreSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

export function FeedCard({
  post,
  isDetail = false,
  // CommentSheetModalRef,
  // MoreSheetModalRef,
}: FeedCardProps) {
  const [current, setCurrent] = useState(0);

  const { width } = useWindowDimensions();
  const CAROUSEL_WIDTH = width - 32;

  // 화면에 보이는 아이템이 바뀔 때 인덱스 업데이트
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<PostImage>[] }) => {
      if (viewableItems.length > 0) {
        setCurrent(viewableItems[0].index || 0);
      }
    },
    [],
  );

  const { mutate: likePost } = useLikePostMutation();
  const { mutate: unlikePost } = useUnlikePostMutation();

  const { mutate: bookmarkPost } = useBookmarkMutation();
  const { mutate: unbookmarkPost } = useUnbookmarkMutation();

  const handleLike = () => {
    // 좋아요 여부에 따라 적절한 mutation 호출
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

  // ref
  const CommentSheetModalRef = useRef<BottomSheetModal>(null);
  const MoreSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handleCommentPress = useCallback(() => {
    CommentSheetModalRef?.current?.present();
  }, []);

  const handleMorePress = useCallback(() => {
    MoreSheetModalRef.current?.present();
  }, []);

  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;

  const catName = post.cat.name;
  const defaultAvatar =
    scheme === "dark"
      ? require("@/assets/images/avatar/user-dark.png")
      : require("@/assets/images/avatar/user-light.png");
  const imageSource = post.cat.profileImageUrl
    ? { uri: post.cat.profileImageUrl }
    : defaultAvatar;

  const daysAgo = formatRelativeTime(post.createdAt);

  const ProfileInfo = (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Image
          source={imageSource}
          style={{ width: 36, height: 36, borderRadius: 36 }}
          contentFit="cover"
        />
        <View className="flex-col">
          <Text className="typo-body3 text-semantic-text-primary">
            {catName}
          </Text>
          <Text className="typo-label1 text-semantic-text-secondary">
            {daysAgo}
          </Text>
        </View>
      </View>
      <MoreIcon onPress={handleMorePress} color={colors.icon.primary} />
    </View>
  );

  return (
    <View className="mb-5 flex-col gap-4 px-4">
      {isDetail && ProfileInfo}
      <View className="relative overflow-hidden rounded-md">
        <FlatList
          data={post.images}
          keyExtractor={(post) => post.id}
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
                  style={{ width: CAROUSEL_WIDTH, height: CAROUSEL_WIDTH }}
                />
              </Pressable>
            </Link>
          )}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
          }}
          pointerEvents="none" // ✨ 필수
        />
        {post.images.length > 1 && (
          <View
            className="absolute right-1.5 top-1.5 z-10 rounded bg-semantic-dimmed-primary px-2 py-1.5"
            pointerEvents="none" // 카운터 클릭 시에도 이미지 클릭이 전달되도록 설정
          >
            <Text className="typo-label2 text-gray-0">
              {current + 1} / {post.images.length}
            </Text>
          </View>
        )}
        {/* 액션 버튼들 */}
        {!isDetail && (
          <View className="absolute bottom-[18px] right-[14px] z-10 flex-row items-center gap-4">
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

            <Pressable
              onPress={handleCommentPress}
              className="active:opacity-60"
            >
              <MessageCircle
                size={20}
                className="text-semantic-text-tertiary"
              />
            </Pressable>

            <Pressable onPress={handleBookmark} className="active:opacity-60">
              <Bookmark
                size={20}
                className={
                  post.isBookmarkedByMe // 추후 북마크 상태로 변경!
                    ? "fill-semantic-icon-accent text-semantic-icon-accent"
                    : "text-white"
                }
              />
            </Pressable>
          </View>
        )}
      </View>

      {/* 이미지 네비게이션 도트 (하단 중앙) */}
      {post.images.length > 1 && (
        <View className="w-full flex-row justify-center gap-1.5">
          {post.images.map((_, index) => (
            <View
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${
                index === current
                  ? "bg-semantic-icon-accent"
                  : "bg-semantic-icon-minor" // 색상은 프로젝트 테마에 맞게 수정 필요
              }`}
            />
          ))}
        </View>
      )}
      {/* 프로필 정보 (이미지 하단) */}
      {!isDetail && ProfileInfo}

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
                  post.isBookmarkedByMe // 추후 북마크 상태로 변경!
                    ? "fill-semantic-icon-accent text-semantic-icon-accent"
                    : "text-semantic-text-tertiary"
                }
              />
            </Pressable>
          </View>
        </>
      )}
      <CommentSheet
        CommentSheetModalRef={CommentSheetModalRef}
        postId={post.id}
      />
      <MoreSheet MoreSheetModalRef={MoreSheetModalRef} />
    </View>
  );
}
