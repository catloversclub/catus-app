import { Post } from "@/api/domains/post/types";
import {
  searchKeys,
  useSearchPostsQuery,
  useSearchProfilesQuery,
} from "@/api/domains/search/queries";
import { SearchCatItem, SearchUserItem } from "@/api/domains/search/types";
import ActionPressable from "@/components/common/action-pressable";
import { RefreshableScrollView } from "@/components/common/logo-refresh-control";
import { Skeleton } from "@/components/ui/skeleton";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { useSearchHistoryStore } from "@/store/explore/search-history-store";
import { Image } from "expo-image";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useAnimatedScrollHandler } from "react-native-reanimated";

interface ExploreResultsViewProps {
  query: string;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
}

// ─── Skeletons ───────────────────────────────────────────────

const PostGridSkeleton = () => {
  const { width } = useWindowDimensions();
  const size = Math.floor(width * 0.38);

  return (
    <View className="flex-row gap-2 px-3">
      {[0, 1, 2].map((i) => (
        <Skeleton
          key={i}
          className="rounded"
          style={{ width: size, height: size }}
        />
      ))}
    </View>
  );
};

const ProfileListSkeleton = () => {
  return (
    <View className="flex-row gap-2 px-3">
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          className="rounded border border-semantic-border-light bg-semantic-bg-primary"
          style={{
            width: 220,
            padding: 14,
            gap: 10,
          }}
        >
          <Skeleton
            className="rounded-full"
            style={{ width: 52, height: 52 }}
          />
          <View style={{ gap: 6 }}>
            <Skeleton className="rounded" style={{ width: 120, height: 16 }} />
            <Skeleton className="rounded" style={{ width: 72, height: 12 }} />
          </View>
        </View>
      ))}
    </View>
  );
};

// ─── Section layout ──────────────────────────────────────────

const ResultSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <View className="gap-3">
      <Text className="typo-title3 text-semantic-text-primary px-3">
        {title}
      </Text>
      {children}
    </View>
  );
};

const EmptyHorizontalList = () => {
  return (
    <View className="mx-3 rounded border border-semantic-border-light bg-semantic-bg-secondary px-4 py-6">
      <Text className="typo-body2 text-semantic-text-secondary text-center">
        검색 결과가 없어요
      </Text>
    </View>
  );
};

// ─── Post horizontal list ────────────────────────────────────

const PostHorizontalItem = ({ post }: { post: Post }) => {
  const { width } = useWindowDimensions();
  const size = Math.floor(width * 0.38);

  const imageUrl = post.images[0]?.url;
  return (
    <ActionPressable
      href={`/post/${post.id}`}
      className="rounded overflow-hidden"
      style={{ width: size, height: size }}
    >
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
    </ActionPressable>
  );
};

const SearchPostsHorizontalList = ({ query }: { query: string }) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSearchPostsQuery(query);

  const posts = data.pages.flatMap((page) =>
    page.type === "post" ? page.posts : [],
  );

  if (posts.length === 0) {
    return <EmptyHorizontalList />;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      renderItem={({ item }) => <PostHorizontalItem post={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginHorizontal: 12 }} />
        ) : null
      }
      style={{ flexGrow: 0 }}
    />
  );
};

// ─── Cat results ─────────────────────────────────────────────

const SearchCatCard = ({ cat }: { cat: SearchCatItem }) => {
  const addViewedCat = useSearchHistoryStore((s) => s.addViewedCat);
  return (
    <ActionPressable
      href={`/cat/${cat.id}`}
      onPress={() =>
        addViewedCat({
          id: cat.id,
          name: cat.name,
          breed: cat.breed ?? undefined,
          imageUrl: cat.profileImageUrl,
        })
      }
      className="w-[220px] flex-row items-center gap-3 rounded border border-semantic-border-light bg-semantic-bg-primary px-3.5 py-3"
    >
      <View className="size-[52px] rounded-full bg-semantic-bg-secondary overflow-hidden">
        {cat.profileImageUrl && (
          <Image
            source={{ uri: cat.profileImageUrl }}
            style={{ width: 52, height: 52 }}
            contentFit="cover"
          />
        )}
      </View>
      <View className="flex-1 gap-0.5">
        <Text
          className="typo-body3 text-semantic-text-primary"
          numberOfLines={1}
        >
          {cat.name}
        </Text>
        {cat.breed && (
          <Text
            className="typo-label1 text-semantic-text-tertiary"
            numberOfLines={1}
          >
            {cat.breed}
          </Text>
        )}
        <Text
          className="typo-label1 text-semantic-text-tertiary"
          numberOfLines={1}
        >
          @{cat.butler.nickname}
        </Text>
      </View>
    </ActionPressable>
  );
};

const SearchCatsHorizontalList = ({ query }: { query: string }) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSearchProfilesQuery(query);

  const cats = data.pages.flatMap((page) =>
    page.type === "profile" ? page.cats : [],
  );

  if (cats.length === 0) {
    return <EmptyHorizontalList />;
  }

  return (
    <FlatList
      data={cats}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      renderItem={({ item }) => <SearchCatCard cat={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginHorizontal: 12 }} />
        ) : null
      }
      style={{ flexGrow: 0 }}
    />
  );
};

// ─── User results ────────────────────────────────────────────

const SearchUserCard = ({ user }: { user: SearchUserItem }) => {
  return (
    <ActionPressable
      href={`/user/${user.id}`}
      className="w-[220px] flex-row items-center gap-3 rounded border border-semantic-border-light bg-semantic-bg-primary px-3.5 py-3"
    >
      <View className="size-[52px] rounded-full bg-semantic-bg-secondary overflow-hidden">
        {user.profileImageUrl && (
          <Image
            source={{ uri: user.profileImageUrl }}
            style={{ width: 52, height: 52 }}
            contentFit="cover"
          />
        )}
      </View>
      <View className="flex-1 gap-0.5">
        <Text
          className="typo-body3 text-semantic-text-primary"
          numberOfLines={1}
        >
          {user.nickname}
        </Text>
        <Text
          className="typo-label1 text-semantic-text-tertiary"
          numberOfLines={1}
        >
          팔로워 {user.followerCount.toLocaleString()}명
        </Text>
      </View>
    </ActionPressable>
  );
};

const SearchUsersHorizontalList = ({ query }: { query: string }) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSearchProfilesQuery(query);

  const users = data.pages.flatMap((page) =>
    page.type === "profile" ? page.users : [],
  );

  if (users.length === 0) {
    return <EmptyHorizontalList />;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      renderItem={({ item }) => <SearchUserCard user={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginHorizontal: 12 }} />
        ) : null
      }
      style={{ flexGrow: 0 }}
    />
  );
};

// ─── Results view ─────────────────────────────────────────────

const ExploreResultsView = ({ query, scrollHandler }: ExploreResultsViewProps) => {
  const refreshQueries = useRefreshQueries([
    searchKeys.results("post", query),
    searchKeys.results("profile", query),
  ]);

  return (
    <RefreshableScrollView
      onRefresh={refreshQueries}
      onScroll={scrollHandler as any}
      scrollEventThrottle={16}
      className="flex-1"
      contentContainerClassName="gap-8 pb-8"
    >
      <ResultSection title="게시글">
        <SuspenseWithDelay fallback={<PostGridSkeleton />}>
          <SearchPostsHorizontalList query={query} />
        </SuspenseWithDelay>
      </ResultSection>

      <ResultSection title="고양이">
        <SuspenseWithDelay fallback={<ProfileListSkeleton />}>
          <SearchCatsHorizontalList query={query} />
        </SuspenseWithDelay>
      </ResultSection>

      <ResultSection title="집사">
        <SuspenseWithDelay fallback={<ProfileListSkeleton />}>
          <SearchUsersHorizontalList query={query} />
        </SuspenseWithDelay>
      </ResultSection>
    </RefreshableScrollView>
  );
};

export default ExploreResultsView;
