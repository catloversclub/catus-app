import {
  useFollowingFeedQuery,
  useRecommendedFeedQuery,
} from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import { FeedCard } from "@/components/feed/FeedCard";
import { FeedListSkeleton } from "@/components/feed/FeedListSkeleton";
import TabPager from "@/components/layout/tab-pager";
import { commonStyles } from "@/styles/common-styles";
import { Image } from "expo-image";
import { Suspense, useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
  RefreshControl,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// 버벅임 방지: iOS 바운스 구간의 미세 진동을 무시하는 임계값
const SCROLL_THRESHOLD = 4;
// 탭바(46px 버튼 + 1px 디바이더)
const TAB_BAR_HEIGHT = 47;

type FeedListProps = {
  data: { pages: Post[][] };
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => Promise<unknown>;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
};

const FeedList = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  scrollHandler,
}: FeedListProps) => {
  const posts = data.pages.flat();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <AnimatedFlatList
      style={{ flex: 1 }}
      data={posts}
      keyExtractor={(item) => (item as Post).id}
      renderItem={({ item }) => <FeedCard post={item as Post} />}
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
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginVertical: 20 }} />
        ) : null
      }
    />
  );
};

const FollowingFeedList = ({
  scrollHandler,
}: Pick<FeedListProps, "scrollHandler">) => {
  const result = useFollowingFeedQuery();
  return <FeedList {...result} scrollHandler={scrollHandler} />;
};

const RecommendedFeedList = ({
  scrollHandler,
}: Pick<FeedListProps, "scrollHandler">) => {
  const result = useRecommendedFeedQuery();
  return <FeedList {...result} scrollHandler={scrollHandler} />;
};

const LogoHeader = ({
  onLayout,
}: {
  onLayout: (e: LayoutChangeEvent) => void;
}) => {
  const scheme = useColorScheme();
  return (
    <View className="px-3 pt-1 pb-3" onLayout={onLayout}>
      <Image
        style={{ width: 82, height: 26 }}
        source={
          scheme === "dark"
            ? require("@/assets/images/logo/row-dark.png")
            : require("@/assets/images/logo/row-light.png")
        }
        contentFit="cover"
      />
    </View>
  );
};

const HomeScreen = () => {
  const logoHeight = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  // 0 = 완전히 숨김, 1 = 완전히 표시 — 로고·탭바 모두 이 값으로 제어
  const headerProgress = useSharedValue(1);
  const targetVisible = useSharedValue(1);

  const onHeaderLayout = useCallback((e: LayoutChangeEvent) => {
    if (logoHeight.value === 0) {
      logoHeight.value = e.nativeEvent.layout.height;
    }
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      const diff = y - lastScrollY.value;

      if (y <= 0 && targetVisible.value !== 1) {
        targetVisible.value = 1;
        headerProgress.value = withTiming(1, { duration: 200 });
      } else if (diff > SCROLL_THRESHOLD && targetVisible.value !== 0) {
        targetVisible.value = 0;
        headerProgress.value = withTiming(0, { duration: 200 });
      } else if (diff < -SCROLL_THRESHOLD && targetVisible.value !== 1) {
        targetVisible.value = 1;
        headerProgress.value = withTiming(1, { duration: 200 });
      }

      lastScrollY.value = y;
    },
  });

  const logoContainerStyle = useAnimatedStyle(() => ({
    height: headerProgress.value * logoHeight.value,
    overflow: "hidden",
  }));

  const tabBarStyle = useAnimatedStyle(() => ({
    height: headerProgress.value * TAB_BAR_HEIGHT,
  }));

  return (
    <SafeAreaView
      style={commonStyles.container}
      className="bg-semantic-bg-primary"
      edges={["top", "left", "right"]}
    >
      <Animated.View style={logoContainerStyle}>
        <LogoHeader onLayout={onHeaderLayout} />
      </Animated.View>
      <TabPager tabs={["팔로잉", "추천"]} tabBarStyle={tabBarStyle}>
        <Suspense fallback={<FeedListSkeleton />}>
          <FollowingFeedList scrollHandler={scrollHandler} />
        </Suspense>
        <Suspense fallback={<FeedListSkeleton />}>
          <RecommendedFeedList scrollHandler={scrollHandler} />
        </Suspense>
      </TabPager>
    </SafeAreaView>
  );
};

export default HomeScreen;
