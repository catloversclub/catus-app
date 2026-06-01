import {
  useFollowingFeedQuery,
  useRecommendedFeedQuery,
} from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import FeedCard from "@/components/feed/FeedCard";
import { useScrollToTop } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

type FeedListProps = {
  data: { pages: Post[][] };
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => Promise<unknown>;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  isActive: boolean;
};

const FeedList = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  scrollHandler,
  isActive,
}: FeedListProps) => {
  const posts = data.pages.flat();

  const listRef = useAnimatedRef<Animated.FlatList<Post>>();
  useScrollToTop(listRef as React.RefObject<FlatList<Post>>);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <Animated.FlatList
      ref={listRef}
      scrollsToTop={isActive}
      style={{ flex: 1 }}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedCard post={item} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        hasNextPage ? (
          <View
            style={{
              height: 56,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isFetchingNextPage && <ActivityIndicator size="small" />}
          </View>
        ) : null
      }
    />
  );
};

export const FollowingFeedList = ({
  scrollHandler,
  isActive,
}: Pick<FeedListProps, "scrollHandler" | "isActive">) => {
  const result = useFollowingFeedQuery();
  return (
    <FeedList {...result} scrollHandler={scrollHandler} isActive={isActive} />
  );
};

export const RecommendedFeedList = ({
  scrollHandler,
  isActive,
}: Pick<FeedListProps, "scrollHandler" | "isActive">) => {
  const result = useRecommendedFeedQuery();
  return (
    <FeedList {...result} scrollHandler={scrollHandler} isActive={isActive} />
  );
};
