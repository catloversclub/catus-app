import {
  useSearchPostsQuery,
  useSearchProfilesQuery,
} from "@/api/domains/search/queries";
import { SearchCatItem } from "@/api/domains/search/types";
import { Post } from "@/api/domains/post/types";
import TabPager from "@/components/layout/tab-pager";
import { Image } from "expo-image";
import { Link } from "expo-router";
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

// ─── Post grid ───────────────────────────────────────────────

function PostGrid({ post }: { post: Post }) {
  const { width } = useWindowDimensions();
  const size = (width - 24 - 4) / 3; // 12px padding each side + 2 gaps of 2px

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

function SearchPostsTab({ query }: { query: string }) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSearchPostsQuery(query);

  const posts =
    data?.pages.flatMap((page) =>
      page.type === "post" ? page.posts : [],
    ) ?? [];

  if (isLoading) {
    return (
      <ActivityIndicator size="large" style={{ marginTop: 50 }} />
    );
  }

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

function SearchCatCard({ cat }: { cat: SearchCatItem }) {
  return (
    <Link href={`/cat/${cat.id}`} asChild>
      <Pressable className="flex-row items-center gap-3 px-4 py-3 active:opacity-70">
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

function SearchCatsTab({ query }: { query: string }) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSearchProfilesQuery(query);

  const cats =
    data?.pages.flatMap((page) =>
      page.type === "profile" ? page.cats : [],
    ) ?? [];

  if (isLoading) {
    return (
      <ActivityIndicator size="large" style={{ marginTop: 50 }} />
    );
  }

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

// ─── Results view ─────────────────────────────────────────────

const ExploreResultsView = ({ query }: ExploreResultsViewProps) => {
  return (
    <TabPager tabs={["게시글", "고양이"]}>
      <SearchPostsTab query={query} />
      <SearchCatsTab query={query} />
    </TabPager>
  );
};

export default ExploreResultsView;
