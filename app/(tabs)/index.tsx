import {
  FollowingFeedList,
  RecommendedFeedList,
} from "@/components/feed/FeedList";
import { FeedListSkeleton } from "@/components/feed/FeedListSkeleton";
import TabPager from "@/components/layout/tab-pager";
import { commonStyles } from "@/styles/common-styles";
import { useColors } from "@/hooks/use-colors";
import { Image } from "expo-image";
import { Suspense, useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const SCROLL_THRESHOLD = 4;
const TAB_BAR_HEIGHT = 47;
const LOGO_HEADER_HEIGHT = 42;

const LogoHeader = () => {
  const { scheme } = useColors();
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
  const [activeTab, setActiveTab] = useState(0);

  const lastScrollY = useSharedValue(0);
  const headerProgress = useSharedValue(1);
  const targetVisible = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      const maxY = event.contentSize.height - event.layoutMeasurement.height;
      const diff = y - lastScrollY.value;

      if (y <= 0) {
        lastScrollY.value = 0;
        if (targetVisible.value !== 1) {
          targetVisible.value = 1;
          headerProgress.value = withTiming(1, { duration: 200 });
        }
        return;
      }

      if (maxY > 0 && y > maxY) {
        return;
      }

      lastScrollY.value = y;

      if (diff > SCROLL_THRESHOLD && targetVisible.value !== 0) {
        targetVisible.value = 0;
        headerProgress.value = withTiming(0, { duration: 200 });
      } else if (diff < -SCROLL_THRESHOLD && targetVisible.value !== 1) {
        targetVisible.value = 1;
        headerProgress.value = withTiming(1, { duration: 200 });
      }
    },
  });

  const logoContainerStyle = useAnimatedStyle(() => ({
    height: headerProgress.value * LOGO_HEADER_HEIGHT,
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
        <LogoHeader />
      </Animated.View>
      <TabPager
        tabs={["팔로잉", "추천"]}
        tabBarStyle={tabBarStyle}
        onTabChange={setActiveTab}
      >
        <Suspense fallback={<FeedListSkeleton />}>
          <FollowingFeedList scrollHandler={scrollHandler} isActive={activeTab === 0} />
        </Suspense>
        <Suspense fallback={<FeedListSkeleton />}>
          <RecommendedFeedList scrollHandler={scrollHandler} isActive={activeTab === 1} />
        </Suspense>
      </TabPager>
    </SafeAreaView>
  );
};

export default HomeScreen;
