import { catKeys } from "@/api/domains/cat/queries";
import { postKeys, useUserPostsQuery } from "@/api/domains/post/queries";
import {
  userKeys,
  useUserDetailQuery,
  useUserProfileQuery,
} from "@/api/domains/user/queries";
import MoreIcon from "@/assets/icons/more.svg";
import ProfileMoreSheet from "@/components/bottom-sheet/profile-more-sheet";
import IconButton from "@/components/common/icon-button";
import PostGrid, { PostGridSkeleton } from "@/components/post/grid";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import OtherProfileActions from "@/components/user/profile/other-profile-actions";
import {
  ProfileHeaderSkeleton,
  UserProfileHeader,
} from "@/components/user/profile/profile-header";
import UserCatListSection from "@/components/user/profile/user-cat-list-section";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { useColors } from "@/hooks/use-colors";
import { presentBottomSheet } from "@/lib/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { Text, View } from "react-native";

interface UserDetailGridProps {
  userId: string;
}

const UserDetailGrid = ({ userId }: UserDetailGridProps) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { data: me } = useUserProfileQuery();
  const { colors } = useColors();
  const profileMoreSheetRef = useRef<BottomSheetModal>(null);
  const isMe = me.id === userId;
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPostsQuery(userId);

  const posts = postsData.pages.flat();

  const { onRefresh, refreshing } = useRefreshQueries([
    userKeys.me(),
    userKeys.detail(userId),
    postKeys.userPosts(userId),
    catKeys.userList(userId),
  ]);

  return (
    <>
      <Stack.Screen
        options={{
          title: `${profile.nickname}님의 프로필`,
          headerRight: isMe
            ? undefined
            : () => (
                <IconButton
                  onPress={() => presentBottomSheet(profileMoreSheetRef)}
                  className="p-2"
                >
                  <MoreIcon width={20} height={20} color={colors.icon.primary} />
                </IconButton>
              ),
        }}
      />
      {!isMe && (
        <ProfileMoreSheet
          bottomSheetRef={profileMoreSheetRef}
          userId={userId}
        />
      )}
      <PostGrid
        posts={posts}
        isFetchingNextPage={isFetchingNextPage}
        emptyComponent={
          <View className="py-20 items-center justify-center">
            <Text className="typo-body1 text-semantic-text-tertiary">
              아직 작성한 게시글이 없어요
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            <UserProfileHeader
              userId={userId}
              imageUrl={profile.profileImageUrl}
              name={profile.nickname}
              postsCount={posts.length}
              followerCount={profile.followerCount}
              followingCount={profile.followingCount}
              actions={isMe ? null : <OtherProfileActions userId={userId} />}
            />
            <UserCatListSection userId={userId} />
          </>
        }
        scrollEnabled
        onRefresh={onRefresh}
        refreshing={refreshing}
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
