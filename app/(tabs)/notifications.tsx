import { notificationKeys } from "@/api/domains/notification/queries";
import { RefreshableScrollView } from "@/components/common/logo-refresh-control";
import {
  NotificationList,
  NotificationListSkeleton,
} from "@/components/notifications/notification-list";
import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { useLoadMoreScroll } from "@/hooks/use-load-more-scroll";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useScrollToTop } from "@react-navigation/native";
import { Stack } from "expo-router";
import { View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

const NotificationsScreen = () => {
  const defaultOptions = useDefaultStackScreenOptions();
  const { handleScroll, loadMoreRef } = useLoadMoreScroll();
  const refreshQueries = useRefreshQueries([notificationKeys.list()]);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  useScrollToTop(scrollRef);

  return (
    <>
      <Stack.Screen
        options={{ ...defaultOptions, title: "알림", headerLeft: undefined }}
      />
      <View className="flex-1 bg-semantic-bg-primary px-3">
        <RefreshableScrollView
          ref={scrollRef}
          onRefresh={refreshQueries}
          onScroll={handleScroll}
          scrollEventThrottle={100}
        >
          <SuspenseWithDelay fallback={<NotificationListSkeleton />}>
            <NotificationList loadMoreRef={loadMoreRef} />
          </SuspenseWithDelay>
        </RefreshableScrollView>
      </View>
    </>
  );
};

export default NotificationsScreen;
