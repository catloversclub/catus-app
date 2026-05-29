import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import {
  useMyBookmarkedPostsQuery,
  useMyLikedPostsQuery,
  useMyPostsQuery,
} from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import { useMyCatsQuery } from "@/api/domains/cat/queries";
import CatList from "@/components/cat/cat-list";
import CatRegistration from "@/components/cat/cat-registration";
import IconButton from "@/components/common/icon-button";
import IconTabPager from "@/components/layout/icon-tab-pager";
import ProfileActions from "@/components/user/my-profile-actions";
import { ProfileInfo } from "@/components/user/profile-info";
import { useColors } from "@/hooks/use-colors";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { Suspense } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

// ─── Post thumbnail ──────────────────────────────────────────

function PostThumbnail({ post }: { post: Post }) {
  const { width } = useWindowDimensions();
  const size = (width - 4) / 3;

  const imageUrl = post.images[0]?.url;
  return (
    <Link href={`/post/${post.id}`} asChild>
      <Pressable style={{ width: size, height: size }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: size, height: size }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{ width: size, height: size }}
            className="bg-semantic-bg-secondary"
          />
        )}
      </Pressable>
    </Link>
  );
}

function EmptyFeed({ message }: { message: string }) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="typo-body1 text-semantic-text-tertiary">{message}</Text>
    </View>
  );
}

// ─── Feed tabs ───────────────────────────────────────────────

function MyPostsTab() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyPostsQuery();
  const posts = data.pages.flat();

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={{ gap: 2 }}
      columnWrapperStyle={{ gap: 2 }}
      renderItem={({ item }) => <PostThumbnail post={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
        ) : null
      }
      ListEmptyComponent={<EmptyFeed message="게시글이 없어요" />}
    />
  );
}

function LikedPostsTab() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyLikedPostsQuery();
  const posts = data.pages.flat();

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={{ gap: 2 }}
      columnWrapperStyle={{ gap: 2 }}
      renderItem={({ item }) => <PostThumbnail post={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
        ) : null
      }
      ListEmptyComponent={<EmptyFeed message="좋아요한 게시글이 없어요" />}
    />
  );
}

function BookmarkedPostsTab() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyBookmarkedPostsQuery();
  const posts = data.pages.flat();

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={{ gap: 2 }}
      columnWrapperStyle={{ gap: 2 }}
      renderItem={({ item }) => <PostThumbnail post={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
        ) : null
      }
      ListEmptyComponent={<EmptyFeed message="저장한 게시글이 없어요" />}
    />
  );
}

// ─── Cat section ─────────────────────────────────────────────

const MyCatListSection = () => {
  const { colors } = useColors();
  const { data: catData } = useMyCatsQuery();
  const hasCats = catData.length > 0;

  return (
    <>
      <View className="w-full flex-row justify-between items-center px-5 mb-3">
        <Text className="text-semantic-text-secondary typo-body3">
          함께 사는 고양이
        </Text>
        <Link href={`/cat/list`} asChild>
          <IconButton className="active:opacity-60">
            <ChevronRightIcon
              width={16}
              height={16}
              color={colors.icon.secondary}
            />
          </IconButton>
        </Link>
      </View>
      {hasCats ? (
        <View className="flex-row items-center pr-5">
          <View className="flex-1">
            <CatList />
          </View>
          <CatRegistration />
        </View>
      ) : (
        <View className="pl-5">
          <CatRegistration />
        </View>
      )}
    </>
  );
};

// ─── Page ────────────────────────────────────────────────────

export default function Mypage() {
  const { colors } = useColors();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "마이페이지",
          headerTintColor: colors.text.primary,
          headerStyle: { backgroundColor: colors.bg.primary },
          headerRight: () => (
            <Link href="/settings" asChild>
              <IconButton className="p-2 active:opacity-60">
                <SettingsIcon
                  width={24}
                  height={24}
                  color={colors.icon.primary}
                />
              </IconButton>
            </Link>
          ),
        }}
      />

      <View className="flex-1 bg-semantic-bg-primary">
        {/* Profile section */}
        <View className="pt-6">
          <ProfileInfo />
          <ProfileActions />
          <MyCatListSection />
          <View className="h-6" />
        </View>

        {/* Feed tabs */}
        <IconTabPager>
          <Suspense
            fallback={
              <ActivityIndicator size="large" style={{ marginTop: 50 }} />
            }
          >
            <MyPostsTab />
          </Suspense>
          <Suspense
            fallback={
              <ActivityIndicator size="large" style={{ marginTop: 50 }} />
            }
          >
            <LikedPostsTab />
          </Suspense>
          <Suspense
            fallback={
              <ActivityIndicator size="large" style={{ marginTop: 50 }} />
            }
          >
            <BookmarkedPostsTab />
          </Suspense>
        </IconTabPager>
      </View>
    </>
  );
}
