import { postKeys, useDailyPopularPostsQuery } from "@/api/domains/post/queries";
import { RefreshableScrollView } from "@/components/common/logo-refresh-control";
import PostGrid, { PostGridSkeleton } from "@/components/post/grid";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { Pressable, Text, View } from "react-native";
import { useAnimatedScrollHandler } from "react-native-reanimated";

interface ExploreDefaultViewProps {
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
}

const DailyPopularGrid = () => {
  const { data: posts } = useDailyPopularPostsQuery();

  if (!posts || posts.length === 0) return null;

  return (
    <PostGrid
      ListHeaderComponent={<></>}
      posts={posts}
      isFetchingNextPage={false}
      emptyComponent={<></>}
      scrollEnabled={false}
    />
  );
};

const ExploreDefaultView = ({ scrollHandler }: ExploreDefaultViewProps) => {
  const refreshQueries = useRefreshQueries([postKeys.dailyPopular()]);
  return (
    <RefreshableScrollView
      onRefresh={refreshQueries}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      className="flex-1"
      contentContainerClassName="gap-6 pb-6"
    >
      <View className="px-3 pt-6 gap-6">
        <Pressable className="px-3 py-4 rounded gap-0.5 border border-[#C2E9FF] bg-[#EBF8FF]">
          <Text className="typo-title3 text-semantic-text-primary">
            천하제일 내 고양이 자랑대회
          </Text>
          <Text className="typo-body4 text-semantic-text-secondary">
            우리 고양이를 더 널리 알려보세요!
          </Text>
        </Pressable>
      </View>

      <View className="gap-3">
        <Text className="typo-title3 text-semantic-text-primary px-3">
          오늘의 인기 게시물
        </Text>
        <SuspenseWithDelay fallback={<PostGridSkeleton />}>
          <DailyPopularGrid />
        </SuspenseWithDelay>
      </View>
    </RefreshableScrollView>
  );
};

export default ExploreDefaultView;
