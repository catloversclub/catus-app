import { postKeys, useUserPostsQuery } from "@/api/domains/post/queries";
import { userKeys, useUserDetailQuery } from "@/api/domains/user/queries";
import MoreIcon from "@/assets/icons/more.svg";
import IconButton from "@/components/common/icon-button";
import { RefreshableScrollView } from "@/components/common/logo-refresh-control";
import OtherProfileActions from "@/components/user/profile/other-profile-actions";
import {
  ProfileHeaderSkeleton,
  UserProfileHeader,
} from "@/components/user/profile/profile-header";
import ProfilePostGrid, {
  PostGridSkeleton,
} from "@/components/user/profile/profile-post-grid";
import { useColors } from "@/hooks/use-colors";
import { useLoadMoreScroll } from "@/hooks/use-load-more-scroll";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { type Href, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

// ─── Profile header ───────────────────────────────────────────

const UserDetailProfileHeader = ({ userId }: { userId: string }) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { data: postsData } = useUserPostsQuery(userId);
  const { colors } = useColors();
  const posts = postsData.pages.flat();

  return (
    <>
      <Stack.Screen
        options={{
          title: `${profile.nickname}님의 프로필`,
          headerRight: () => (
            <IconButton className="p-3 active:opacity-60">
              <MoreIcon width={24} height={24} color={colors.icon.primary} />
            </IconButton>
          ),
        }}
      />
      <UserProfileHeader
        imageUrl={profile.profileImageUrl}
        name={profile.nickname}
        stats={[
          {
            label: "게시글",
            value: posts.length,
          },
          {
            label: "팔로워",
            value: profile.followerCount,
            href: `/user/${userId}/follower` as Href,
          },
          {
            label: "팔로잉",
            value: profile.followingCount,
            href: `/user/${userId}/following` as Href,
          },
        ]}
        actions={<OtherProfileActions userId={userId} />}
      />
    </>
  );
};

// ─── Post grid ────────────────────────────────────────────────

interface UserDetailPostGridProps {
  userId: string;
  loadMoreRef: React.RefObject<(() => void) | null>;
}

const UserDetailPostGrid = ({
  userId,
  loadMoreRef,
}: UserDetailPostGridProps) => {
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPostsQuery(userId);
  const posts = postsData.pages.flat();

  return (
    <ProfilePostGrid
      posts={posts}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      emptyMessage="아직 작성한 게시글이 없어요"
      loadMoreRef={loadMoreRef}
    />
  );
};

// ─── Page ─────────────────────────────────────────────────────

const UserDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { handleScroll, loadMoreRef } = useLoadMoreScroll();
  const refreshQueries = useRefreshQueries([
    userKeys.detail(id),
    postKeys.userPosts(id),
  ]);

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <RefreshableScrollView
        onRefresh={refreshQueries}
        onScroll={handleScroll}
        scrollEventThrottle={100}
      >
        <SuspenseWithDelay fallback={<ProfileHeaderSkeleton />}>
          <UserDetailProfileHeader userId={id} />
        </SuspenseWithDelay>
        <SuspenseWithDelay fallback={<PostGridSkeleton />}>
          <UserDetailPostGrid userId={id} loadMoreRef={loadMoreRef} />
        </SuspenseWithDelay>
      </RefreshableScrollView>
    </View>
  );
};

export default UserDetailScreen;
