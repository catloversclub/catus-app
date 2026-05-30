import {
  useFollowingFeedQuery,
  useRecommendedFeedQuery,
} from "@/api/domains/post/queries";
import { FeedCard } from "@/components/feed/FeedCard";
import TabPager from "@/components/layout/tab-pager";
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
import { commonStyles } from "@/styles/common-styles";

function FollowingFeedList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useFollowingFeedQuery();
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
}

function RecommendedFeedList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useRecommendedFeedQuery();
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
}

function LogoHeader() {
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
}

const HomeScreen = () => {
  return (
    <SafeAreaView
      style={commonStyles.container}
      className="bg-semantic-bg-primary"
      edges={["top", "left", "right"]}
    >
      <LogoHeader />
      <TabPager tabs={["팔로잉", "추천"]}>
        <Suspense
          fallback={
            <ActivityIndicator size="large" style={{ marginTop: 50 }} />
          }
        >
          <FollowingFeedList />
        </Suspense>
        <Suspense
          fallback={
            <ActivityIndicator size="large" style={{ marginTop: 50 }} />
          }
        >
          <RecommendedFeedList />
        </Suspense>
      </TabPager>
    </SafeAreaView>
  );
}

export default HomeScreen;
