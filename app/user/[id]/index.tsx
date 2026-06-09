import { catKeys } from "@/api/domains/cat/queries";
import { postKeys, useUserPostsQuery } from "@/api/domains/post/queries";
import { userKeys, useUserDetailQuery } from "@/api/domains/user/queries";
import MoreIcon from "@/assets/icons/more.svg";
import IconButton from "@/components/common/icon-button";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import PostGrid, { PostGridSkeleton } from "@/components/post/grid";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import OtherProfileActions from "@/components/user/profile/other-profile-actions";
import {
  ProfileHeaderSkeleton,
  UserProfileHeader,
} from "@/components/user/profile/profile-header";
import UserCatListSection from "@/components/user/profile/user-cat-list-section";
import { useColors } from "@/hooks/use-colors";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

interface UserDetailGridProps {
  userId: string;
}

const UserDetailGrid = ({ userId }: UserDetailGridProps) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { colors } = useColors();
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPostsQuery(userId);

  const posts = postsData.pages.flat();

  const refreshQueries = useRefreshQueries([
    userKeys.detail(userId),
    postKeys.userPosts(userId),
    catKeys.userList(userId),
  ]);
  const { refreshControl } = useLogoRefreshControl({
    onRefresh: refreshQueries,
  });

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
      <PostGrid
        posts={posts}
        isFetchingNextPage={isFetchingNextPage}
        emptyComponent={
          <View className="py-12 items-center justify-center">
            <Text className="typo-body1 text-semantic-text-tertiary">
              아직 작성한 게시글이 없어요
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
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
                  href: {
                    pathname: "/user/[id]/follower",
                    params: { id: userId },
                  },
                },
                {
                  label: "팔로잉",
                  value: profile.followingCount,
                  href: {
                    pathname: "/user/[id]/following",
                    params: { id: userId },
                  },
                },
              ]}
              actions={<OtherProfileActions userId={userId} />}
            />
            <UserCatListSection userId={userId} />
          </>
        }
        scrollEnabled
        refreshControl={refreshControl}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      />
    </>
  );
};

const UserDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <SuspenseWithDelay
        fallback={
          <>
            <ProfileHeaderSkeleton />
            <PostGridSkeleton />
          </>
        }
      >
        <UserDetailGrid userId={id} />
      </SuspenseWithDelay>
    </View>
  );
};

export default UserDetailScreen;
