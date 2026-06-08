import {
  FeedListSkeleton,
  FollowingFeedList,
  RecommendedFeedList,
} from "@/components/feed/list";
import TabPager from "@/components/layout/tab-pager";
import { useColors } from "@/hooks/use-colors";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { commonStyles } from "@/styles/common-styles";
import { Image } from "expo-image";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useState } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const { scrollHandler, logoContainerStyle, tabBarStyle } = useScrollHeader();

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
        <SuspenseWithDelay fallback={<FeedListSkeleton />}>
          <FollowingFeedList
            scrollHandler={scrollHandler}
            isActive={activeTab === 0}
          />
        </SuspenseWithDelay>
        <SuspenseWithDelay fallback={<FeedListSkeleton />}>
          <RecommendedFeedList
            scrollHandler={scrollHandler}
            isActive={activeTab === 1}
          />
        </SuspenseWithDelay>
      </TabPager>
    </SafeAreaView>
  );
};

export default HomeScreen;
