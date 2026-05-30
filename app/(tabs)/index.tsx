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

const LogoHeader = ({ onLayout }: { onLayout: (e: LayoutChangeEvent) => void }) => {
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
  const headerHeight = useSharedValue(0);
  const headerHeightAnim = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const targetHeight = useSharedValue(0);

  const onHeaderLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (headerHeight.value === 0) {
      headerHeight.value = h;
      headerHeightAnim.value = h;
      targetHeight.value = h;
    }
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      const diff = y - lastScrollY.value;

      if (y <= 0 && targetHeight.value !== headerHeight.value) {
        targetHeight.value = headerHeight.value;
        headerHeightAnim.value = withTiming(headerHeight.value, { duration: 250 });
      } else if (diff > 0 && targetHeight.value !== 0) {
        targetHeight.value = 0;
        headerHeightAnim.value = withTiming(0, { duration: 250 });
      } else if (diff < 0 && targetHeight.value !== headerHeight.value) {
        targetHeight.value = headerHeight.value;
        headerHeightAnim.value = withTiming(headerHeight.value, { duration: 250 });
      }

      lastScrollY.value = y;
    },
  });

  const headerContainerStyle = useAnimatedStyle(() => ({
    height: headerHeightAnim.value,
    overflow: "hidden",
  }));

  return (
    <SafeAreaView
      style={commonStyles.container}
      className="bg-semantic-bg-primary"
      edges={["top", "left", "right"]}
    >
      <Animated.View style={headerContainerStyle}>
        <LogoHeader onLayout={onHeaderLayout} />
      </Animated.View>
      <TabPager tabs={["팔로잉", "추천"]}>
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
