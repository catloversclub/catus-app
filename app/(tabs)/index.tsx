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
  RefreshControl,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FeedListProps = {
  data: { pages: Post[][] };
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => Promise<unknown>;
};

const FeedList = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
}: FeedListProps) => {
  const posts = data.pages.flat();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <FlatList
      style={{ flex: 1 }}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedCard post={item} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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

const FollowingFeedList = () => {
  const result = useFollowingFeedQuery();
  return <FeedList {...result} />;
};

const RecommendedFeedList = () => {
  const result = useRecommendedFeedQuery();
  return <FeedList {...result} />;
};

const LogoHeader = () => {
  const scheme = useColorScheme();
  return (
    <View className="px-3 pt-1 pb-3">
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
  return (
    <SafeAreaView
      style={commonStyles.container}
      className="bg-semantic-bg-primary"
      edges={["top", "left", "right"]}
    >
      <LogoHeader />
      <TabPager tabs={["팔로잉", "추천"]}>
        <Suspense fallback={<FeedListSkeleton />}>
          <FollowingFeedList />
        </Suspense>
        <Suspense fallback={<FeedListSkeleton />}>
          <RecommendedFeedList />
        </Suspense>
      </TabPager>
    </SafeAreaView>
  );
};

export default HomeScreen;
