import { catKeys } from "@/api/domains/cat/queries";
import { postKeys } from "@/api/domains/post/queries";
import { userKeys } from "@/api/domains/user/queries";
import SettingsIcon from "@/assets/icons/settings.svg";
import IconButton from "@/components/common/icon-button";
import { RefreshableScrollView } from "@/components/common/logo-refresh-control";
import MyProfileHeaderContent from "@/components/user/mypage/my-profile-header-content";
import MypagePostGrid from "@/components/user/mypage/mypage-post-grid";
import { ProfileHeaderSkeleton } from "@/components/user/profile/profile-header";
import { PostGridSkeleton } from "@/components/post/grid";
import { useColors } from "@/hooks/use-colors";
import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { useLoadMoreScroll } from "@/hooks/use-load-more-scroll";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { Link, Stack } from "expo-router";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useState } from "react";
import { View } from "react-native";

const Mypage = () => {
  const { colors } = useColors();
  const defaultOptions = useDefaultStackScreenOptions();
  const [activeTab, setActiveTab] = useState(0);
  const { handleScroll, loadMoreRef } = useLoadMoreScroll();
  const refreshQueries = useRefreshQueries([
    userKeys.me(),
    postKeys.myPosts(),
    postKeys.myLikedPosts(),
    postKeys.myBookmarkedPosts(),
    catKeys.list(),
  ]);

  return (
    <>
      <Stack.Screen
        options={{
          ...defaultOptions,
          title: "마이페이지",
          headerLeft: undefined,
          headerRight: () => (
            <Link href="/settings" asChild>
              <IconButton className="p-3 active:opacity-60">
                <SettingsIcon
                  width={24}
                  height={24}
                  color={colors.icon.primary}
                />
              </IconButton>
            </Link>
          ),
        }}
      />

      <View className="flex-1 bg-semantic-bg-primary">
        <RefreshableScrollView
          onRefresh={refreshQueries}
          onScroll={handleScroll}
          scrollEventThrottle={100}
        >
          <SuspenseWithDelay fallback={<ProfileHeaderSkeleton />}>
            <MyProfileHeaderContent />
          </SuspenseWithDelay>
          <SuspenseWithDelay fallback={<PostGridSkeleton />}>
            <MypagePostGrid
              activeTab={activeTab}
              onTabChange={setActiveTab}
              loadMoreRef={loadMoreRef}
            />
          </SuspenseWithDelay>
        </RefreshableScrollView>
      </View>
    </>
  );
};

export default Mypage;
