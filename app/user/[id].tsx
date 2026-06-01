import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useUserDetailQuery,
} from "@/api/domains/user/queries";
import { useUserPostsQuery } from "@/api/domains/post/queries";
import MoreIcon from "@/assets/icons/more.svg";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import ProfileHeader from "@/components/user/profile-header";
import ProfilePostGrid, {
  PostGridSkeleton,
} from "@/components/user/profile-post-grid";
import { useColors } from "@/hooks/use-colors";
import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { View } from "react-native";

// ─── Profile header ───────────────────────────────────────────

const UserProfileHeader = ({ userId }: { userId: string }) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { data: postsData } = useUserPostsQuery(userId);
  const posts = postsData.pages.flat();

  const { mutate: followUser, isPending: isFollowPending } =
    useFollowUserMutation();
  const { mutate: unfollowUser, isPending: isUnfollowPending } =
    useUnfollowUserMutation();

  const isFollowing = profile.isFollowing;
  const isPending = isFollowPending || isUnfollowPending;

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  return (
    <ProfileHeader
      imageUrl={profile.profileImageUrl}
      name={profile.nickname}
      stats={[
        { label: "게시글", value: posts.length },
        { label: "팔로워", value: profile.followerCount },
        { label: "팔로잉", value: profile.followingCount },
      ]}
      actions={
        <View className="flex-row gap-1.5 w-full mb-[26px] px-5">
          <View className="flex-1">
            <Button
              button={{
                label: isFollowing ? "팔로잉" : "팔로우",
                onPress: handleFollowToggle,
                variant: isFollowing ? "secondary" : "primary",
                size: "md",
                isPending,
              }}
            />
          </View>
        </View>
      }
    />
  );
};

// ─── Page content ─────────────────────────────────────────────

const UserDetailContent = ({ userId }: { userId: string }) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { colors } = useColors();
  const { data: postsData, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserPostsQuery(userId);
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
      <ProfilePostGrid
        ListHeaderComponent={() => <UserProfileHeader userId={userId} />}
        posts={posts}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        emptyMessage="아직 작성한 게시글이 없어요"
      />
    </>
  );
};

// ─── Page ─────────────────────────────────────────────────────

const UserDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <Suspense fallback={<PostGridSkeleton />}>
        <UserDetailContent userId={id} />
      </Suspense>
    </View>
  );
};

export default UserDetailScreen;
