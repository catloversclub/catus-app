import { useUserDetailQuery } from "@/api/domains/user/queries";
import { useUserPostsQuery } from "@/api/domains/post/queries";
import MoreIcon from "@/assets/icons/more.svg";
import IconButton from "@/components/common/icon-button";
import { UserProfileHeader } from "@/components/user/profile/profile-header";
import ProfilePostGrid, {
  PostGridSkeleton,
} from "@/components/user/profile/profile-post-grid";
import OtherProfileActions from "@/components/user/profile/other-profile-actions";
import { useColors } from "@/hooks/use-colors";
import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { View } from "react-native";

// ─── Profile header ───────────────────────────────────────────

const UserDetailProfileHeader = ({ userId }: { userId: string }) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { data: postsData } = useUserPostsQuery(userId);
  const posts = postsData.pages.flat();

  return (
    <UserProfileHeader
      imageUrl={profile.profileImageUrl}
      name={profile.nickname}
      stats={[
        { label: "게시글", value: posts.length },
        { label: "팔로워", value: profile.followerCount },
        { label: "팔로잉", value: profile.followingCount },
      ]}
      actions={<OtherProfileActions userId={userId} />}
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
        ListHeaderComponent={() => <UserDetailProfileHeader userId={userId} />}
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
