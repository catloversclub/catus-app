import {
  useSearchPostsQuery,
  useSearchProfilesQuery,
} from "@/api/domains/search/queries";
import { SearchCatItem, SearchUserItem } from "@/api/domains/search/types";
import { Post } from "@/api/domains/post/types";
import { useSearchHistoryStore } from "@/store/explore/search-history-store";
import TabPager from "@/components/layout/tab-pager";
import { useColors } from "@/hooks/use-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { Suspense } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

interface ExploreResultsViewProps {
  query: string;
}

// ─── Skeletons ───────────────────────────────────────────────

const PostGridSkeleton = () => {
  const { scheme } = useColors();
  const colorMode = scheme === "dark" ? "dark" : "light";
  const { width } = useWindowDimensions();
  const size = Math.floor((width - 24 - 4) / 3);

  return (
    <Skeleton.Group show>
      <View style={{ padding: 12, gap: 2 }}>
        {[0, 1, 2].map((row) => (
          <View key={row} style={{ flexDirection: "row", gap: 2 }}>
            {[0, 1, 2].map((col) => (
              <Skeleton
                key={col}
                colorMode={colorMode}
                width={size}
                height={size}
                radius={0}
              />
            ))}
          </View>
        ))}
      </View>
    </Skeleton.Group>
  );
}

const ProfileListSkeleton = () => {
  const { scheme } = useColors();
  const colorMode = scheme === "dark" ? "dark" : "light";

  return (
    <Skeleton.Group show>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Skeleton colorMode={colorMode} width={52} height={52} radius="round" />
          <View style={{ gap: 6 }}>
            <Skeleton colorMode={colorMode} width={130} height={16} radius={4} />
            <Skeleton colorMode={colorMode} width={80} height={12} radius={4} />
          </View>
        </View>
      ))}
    </Skeleton.Group>
  );
}

// ─── Post grid ───────────────────────────────────────────────

const PostGrid = ({ post }: { post: Post }) => {
  const { width } = useWindowDimensions();
  const size = (width - 24 - 4) / 3;

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

const SearchPostsTab = ({ query }: { query: string }) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSearchPostsQuery(query);

  const posts =
    data.pages.flatMap((page) =>
      page.type === "post" ? page.posts : [],
    );

  if (posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="typo-body1 text-semantic-text-primary text-center">
          {"검색 결과가 없어요!\n다른 키워드로 검색해보세요"}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1 }}
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={{ padding: 12, gap: 2 }}
      columnWrapperStyle={{ gap: 2 }}
      renderItem={({ item }) => <PostGrid post={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
        ) : null
      }
    />
  );
}

// ─── Cat results ─────────────────────────────────────────────

const SearchCatCard = ({ cat }: { cat: SearchCatItem }) => {
  const addViewedCat = useSearchHistoryStore((s) => s.addViewedCat);
  return (
    <Link href={`/cat/${cat.id}`} asChild>
      <Pressable
        onPress={() =>
          addViewedCat({
            id: cat.id,
            name: cat.name,
            breed: cat.breed ?? undefined,
            imageUrl: cat.profileImageUrl,
          })
        }
        className="flex-row items-center gap-3 px-4 py-3 active:opacity-70"
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
      </Pressable>
    </Link>
  );
}

const SearchCatsTab = ({ query }: { query: string }) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSearchProfilesQuery(query);

  const cats =
    data.pages.flatMap((page) =>
      page.type === "profile" ? page.cats : [],
    );

  if (cats.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="typo-body1 text-semantic-text-primary text-center">
          {"검색 결과가 없어요!\n다른 키워드로 검색해보세요"}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1 }}
      data={cats}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SearchCatCard cat={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
        ) : null
      }
    />
  );
}

// ─── User results ────────────────────────────────────────────

const SearchUserCard = ({ user }: { user: SearchUserItem }) => {
  return (
    <Link href={`/user/${user.id}`} asChild>
      <Pressable className="flex-row items-center gap-3 px-4 py-3 active:opacity-70">
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
      </Pressable>
    </Link>
  );
}

const SearchUsersTab = ({ query }: { query: string }) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSearchProfilesQuery(query);

  const users =
    data.pages.flatMap((page) =>
      page.type === "profile" ? page.users : [],
    );

  if (users.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="typo-body1 text-semantic-text-primary text-center">
          {"검색 결과가 없어요!\n다른 키워드로 검색해보세요"}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1 }}
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SearchUserCard user={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
        ) : null
      }
    />
  );
}

// ─── Results view ─────────────────────────────────────────────

const ExploreResultsView = ({ query }: ExploreResultsViewProps) => {
  return (
    <TabPager tabs={["게시글", "고양이", "집사"]}>
      <Suspense fallback={<PostGridSkeleton />}>
        <SearchPostsTab query={query} />
      </Suspense>
      <Suspense fallback={<ProfileListSkeleton />}>
        <SearchCatsTab query={query} />
      </Suspense>
      <Suspense fallback={<ProfileListSkeleton />}>
        <SearchUsersTab query={query} />
      </Suspense>
    </TabPager>
  );
};

export default ExploreResultsView;
