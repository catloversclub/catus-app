import {
  useFollowingFeedQuery,
  useRecommendedFeedQuery,
} from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import FeedCard from "@/components/feed/feed-card";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import { useScrollToTop } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
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

  const { onScrollEndDrag, logoOverlay } = useLogoRefreshControl({ onRefresh: refetch });

  return (
    <View style={{ flex: 1 }}>
      {logoOverlay}
      <Animated.FlatList
        ref={listRef}
        scrollsToTop={isActive}
        style={{ flex: 1 }}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedCard post={item} />}
        onScrollEndDrag={onScrollEndDrag}
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
    </View>
  );
};

const FollowingFeedList = ({
  scrollHandler,
  isActive,
}: Pick<FeedListProps, "scrollHandler" | "isActive">) => {
  const result = useFollowingFeedQuery();
  return (
    <FeedList {...result} scrollHandler={scrollHandler} isActive={isActive} />
  );
};

const RecommendedFeedList = ({
  scrollHandler,
  isActive,
}: Pick<FeedListProps, "scrollHandler" | "isActive">) => {
  const result = useRecommendedFeedQuery();
  return (
    <FeedList {...result} scrollHandler={scrollHandler} isActive={isActive} />
  );
};

export { FollowingFeedList, RecommendedFeedList };
