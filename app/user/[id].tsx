import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useUserDetailQuery,
} from "@/api/domains/user/queries";
import { useUserPostsQuery } from "@/api/domains/post/queries";
import MoreIcon from "@/assets/icons/more.svg";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import ProfileImage from "@/components/common/profile-image";
import ProfilePostGrid, {
  PostGridSkeleton,
} from "@/components/user/profile-post-grid";
import { useColors } from "@/hooks/use-colors";
import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { Text, View } from "react-native";

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
    <View className="pt-6">
      <View className="flex-col items-center">
        <ProfileImage imageUrl={profile.profileImageUrl} size="lg" />
        <Text className="typo-title3 mb-1 text-semantic-text-primary mt-3">
          {profile.nickname}
        </Text>
        <View className="flex-row mb-6">
          <View className="flex-row gap-1 px-3 py-1.5">
            <Text className="typo-body4 text-semantic-text-tertiary">게시글</Text>
            <Text className="typo-body3 text-semantic-text-secondary">
              {posts.length}
            </Text>
          </View>
          <View className="flex-row gap-1 px-3 py-1.5">
            <Text className="typo-body4 text-semantic-text-tertiary">팔로워</Text>
            <Text className="typo-body3 text-semantic-text-secondary">
              {profile.followerCount}
            </Text>
          </View>
          <View className="flex-row gap-1 px-3 py-1.5">
            <Text className="typo-body4 text-semantic-text-tertiary">팔로잉</Text>
            <Text className="typo-body3 text-semantic-text-secondary">
              {profile.followingCount}
            </Text>
          </View>
        </View>
      </View>
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
    </View>
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
          headerTintColor: colors.text.primary,
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
  const { colors } = useColors();

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <Stack.Screen
        options={{
          headerTintColor: colors.text.primary,
          headerStyle: { backgroundColor: colors.bg.primary },
        }}
      />
      <Suspense fallback={<PostGridSkeleton />}>
        <UserDetailContent userId={id} />
      </Suspense>
    </View>
  );
};

export default UserDetailScreen;
