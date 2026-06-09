import { catKeys } from "@/api/domains/cat/queries";
import {
  postKeys,
  useMyBookmarkedPostsQuery,
  useMyLikedPostsQuery,
  useMyPostsQuery,
} from "@/api/domains/post/queries";
import { userKeys } from "@/api/domains/user/queries";
import SettingsIcon from "@/assets/icons/settings.svg";
import EmptyActionState from "@/components/common/empty-action-state";
import IconButton from "@/components/common/icon-button";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import TabIconBar from "@/components/layout/tab-icon-bar";
import PostGrid, { PostGridSkeleton } from "@/components/post/grid";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import MyProfileHeaderContent from "@/components/user/mypage/my-profile-header-content";
import { ProfileHeaderSkeleton } from "@/components/user/profile/profile-header";
import { useColors } from "@/hooks/use-colors";
import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { Link, Stack, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

const MypageGrid = () => {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  const emptyComponents = [
    <EmptyActionState
      key="my-posts"
      title="아직 작성한 게시글이 없어요!"
      description="지금 바로 우리집 고양이를 자랑해볼까요?"
      buttonLabel="사진 업로드하기"
      onButtonPress={() => router.push("/post/gallery")}
    />,
    <EmptyActionState
      key="liked-posts"
      title="좋아요한 게시글이 없어요"
      description="마음에 드는 게시글에 좋아요를 눌러보세요"
      buttonLabel="게시글 둘러보기"
      onButtonPress={() => router.push("/(tabs)/explore")}
    />,
    <EmptyActionState
      key="bookmarked-posts"
      title="저장한 게시글이 없어요"
      description="게시글을 저장하면 여기에 모여요"
      buttonLabel="게시글 둘러보기"
      onButtonPress={() => router.push("/(tabs)/explore")}
    />,
  ];

  const refreshQueries = useRefreshQueries([
    userKeys.me(),
    postKeys.myPosts(),
    postKeys.myLikedPosts(),
    postKeys.myBookmarkedPosts(),
    catKeys.list(),
  ]);
  const { refreshControl } = useLogoRefreshControl({
    onRefresh: refreshQueries,
  });

  const myPostsQuery = useMyPostsQuery();
  const likedQuery = useMyLikedPostsQuery();
  const bookmarkedQuery = useMyBookmarkedPostsQuery();

  const queries = [myPostsQuery, likedQuery, bookmarkedQuery];
  const activeQuery = queries[activeTab];
  const posts = activeQuery.data.pages.flat();

  return (
    <PostGrid
      posts={posts}
      isFetchingNextPage={activeQuery.isFetchingNextPage}
      emptyComponent={emptyComponents[activeTab]}
      ListHeaderComponent={
        <>
          <MyProfileHeaderContent />
          <View className="px-5">
            <TabIconBar activeIndex={activeTab} onChange={setActiveTab} />
          </View>
        </>
      }
      scrollEnabled
      refreshControl={refreshControl}
      onEndReached={() => {
        if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
          activeQuery.fetchNextPage();
        }
      }}
    />
  );
};

const Mypage = () => {
  const { colors } = useColors();
  const defaultOptions = useDefaultStackScreenOptions();

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
        <SuspenseWithDelay
          fallback={
            <>
              <ProfileHeaderSkeleton />
              <PostGridSkeleton />
            </>
          }
        >
          <MypageGrid />
        </SuspenseWithDelay>
      </View>
    </>
  );
};

export default Mypage;
