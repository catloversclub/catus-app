import {
  useFollowingFeedQuery,
  useRecommendedFeedQuery,
} from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import { LoadMoreFooter } from "@/components/common/load-more-footer";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import FeedCard, { FeedCardSkeleton } from "@/components/feed/card";
import { useScrollToTop } from "@react-navigation/native";
import { Text, View } from "react-native";
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
    <View className="flex-1">
      <Animated.FlatList
        ref={listRef}
        scrollsToTop={isActive}
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedCard post={item} />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center bg-semantic-bg-primary">
            <Text className="typo-body2 text-semantic-text-primary text-center">
              아직 팔로우 중인 계정이 없어요.{"\n"}계정을 둘러보고 팔로우해
              보세요 👀
            </Text>
          </View>
        }
        refreshControl={refreshControl}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        alwaysBounceVertical
        onEndReached={() => {
          if (posts.length > 0 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
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

export { FeedListSkeleton, FollowingFeedList, RecommendedFeedList };
