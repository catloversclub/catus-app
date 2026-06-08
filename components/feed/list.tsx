import {
  useFollowingFeedQuery,
  useRecommendedFeedQuery,
} from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import { LoadMoreFooter } from "@/components/common/load-more-footer";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import FeedCard, { FeedCardSkeleton } from "@/components/feed/card";
import { useScrollToTop } from "@react-navigation/native";
import { View } from "react-native";
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
  useScrollToTop(listRef);

  const { refreshControl } = useLogoRefreshControl({
    onRefresh: refetch,
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        ref={listRef}
        scrollsToTop={isActive}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedCard post={item} />}
        refreshControl={refreshControl}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <LoadMoreFooter /> : null}
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

const FeedListSkeleton = () => (
  <View style={{ flex: 1, paddingTop: 4 }}>
    <FeedCardSkeleton />
    <FeedCardSkeleton />
  </View>
);

export { FollowingFeedList, FeedListSkeleton, RecommendedFeedList };
