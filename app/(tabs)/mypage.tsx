import { catKeys } from "@/api/domains/cat/queries";
import { postKeys } from "@/api/domains/post/queries";
import { userKeys } from "@/api/domains/user/queries";
import SettingsIcon from "@/assets/icons/settings.svg";
import IconButton from "@/components/common/icon-button";
import { PostGridSkeleton } from "@/components/post/grid";
import MypagePostGrid from "@/components/user/mypage/mypage-post-grid";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useColors } from "@/hooks/use-colors";
import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { Link, Stack } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";

const Mypage = () => {
  const { colors } = useColors();
  const defaultOptions = useDefaultStackScreenOptions();
  const [refreshing, setRefreshing] = useState(false);
  const refreshQueries = useRefreshQueries([
    userKeys.me(),
    postKeys.myPosts(),
    postKeys.myLikedPosts(),
    postKeys.myBookmarkedPosts(),
    catKeys.list(),
  ]);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refreshQueries();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refreshQueries]);

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
        <SuspenseWithDelay fallback={<PostGridSkeleton />}>
          <MypagePostGrid refreshing={refreshing} onRefresh={onRefresh} />
        </SuspenseWithDelay>
      </View>
    </>
  );
};

export default Mypage;
