import { useUserCatsQuery } from "@/api/domains/cat/queries";
import {
  useUserFollowersQuery,
  useUserFollowingsQuery,
  useUserProfileQuery,
  userKeys,
} from "@/api/domains/user/queries";
import SelectCatSheet from "@/components/bottom-sheet/select-cat-sheet";
import ActionPressable from "@/components/common/action-pressable";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import FollowButton from "@/components/user/follow-button";
import UserProfileImage from "@/components/user/profile-image";
import { Skeleton } from "@/components/ui/skeleton";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useColors } from "@/hooks/use-colors";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { useUserFollowToggle } from "@/hooks/user/use-user-follow-toggle";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

// ─── Skeleton ────────────────────────────────────────────────

const FollowListSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((i) => (
      <View
        key={i}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Skeleton className="rounded-full" style={{ width: 48, height: 48 }} />
        <Skeleton className="rounded" style={{ width: 120, height: 16 }} />
        <View style={{ flex: 1 }} />
        <Skeleton style={{ width: 72, height: 32 }} />
      </View>
    ))}
  </>
);

// ─── Follow item ─────────────────────────────────────────────

interface FollowItemProps {
  id: string;
  nickname: string;
  profileImageUrl?: string | null;
  isFollowedByMe: boolean;
  currentUserId: string;
  onUnfollowStart: (userId: string) => void;
}

const FollowItem = ({
  id,
  nickname,
  profileImageUrl,
  isFollowedByMe,
  currentUserId,
  onUnfollowStart,
}: FollowItemProps) => {
  const isMe = id === currentUserId;

  return (
    <View className="flex-row items-center gap-3 px-4 py-3">
      <UserProfileImage imageUrl={profileImageUrl ?? null} userId={id} size="sm" />
      <ActionPressable href={`/user/${id}`} className="flex-1">
        <Text
          className="typo-body3 text-semantic-text-primary"
          numberOfLines={1}
        >
          {nickname}
        </Text>
      </ActionPressable>
      {!isMe && (
        <FollowButton
          userId={id}
          isFollowing={isFollowedByMe}
          onUnfollowStart={() => onUnfollowStart(id)}
        />
      )}
    </View>
  );
};

interface FollowListUnfollowSheetProps {
  bottomSheetRef: RefObject<BottomSheetModal | null>;
  userId: string;
}

const FollowListUnfollowSheet = ({
  bottomSheetRef,
  userId,
}: FollowListUnfollowSheetProps) => {
  const { data: cats } = useUserCatsQuery(userId);
  const followedCatIds = useMemo(
    () => cats.filter((cat) => cat.isFollowedByMe).map((cat) => cat.id),
    [cats],
  );
  const { unfollowWithCats } = useUserFollowToggle({
    userId,
    isFollowing: true,
  });

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, [bottomSheetRef, userId]);

  const handleConfirmUnfollow = useCallback(
    (selectedCatIds: string[]) => {
      const selectedCatIdSet = new Set(selectedCatIds);
      const unfollowCatIds = followedCatIds.filter(
        (catId) => !selectedCatIdSet.has(catId),
      );
      if (unfollowCatIds.length > 0) unfollowWithCats(unfollowCatIds);
    },
    [followedCatIds, unfollowWithCats],
  );

  return (
    <SelectCatSheet
      bottomSheetRef={bottomSheetRef}
      userId={userId}
      initialSelectedCatIds={followedCatIds}
      onConfirm={handleConfirmUnfollow}
    />
  );
};

const useFollowListUnfollowSheet = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [unfollowUserId, setUnfollowUserId] = useState<string | null>(null);

  const handleUnfollowStart = useCallback((userId: string) => {
    setUnfollowUserId((prevUserId) => {
      if (prevUserId === userId) bottomSheetRef.current?.present();
      return userId;
    });
  }, []);

  const sheet = unfollowUserId ? (
    <SuspenseWithDelay fallback={null} delay={0}>
      <FollowListUnfollowSheet
        bottomSheetRef={bottomSheetRef}
        userId={unfollowUserId}
      />
    </SuspenseWithDelay>
  ) : null;

  return { handleUnfollowStart, sheet };
};

// ─── Follower list ───────────────────────────────────────────

const FollowerList = ({ userId }: { userId: string }) => {
  const { data: currentUser } = useUserProfileQuery();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserFollowersQuery(userId);
  const { colors } = useColors();
  const { handleUnfollowStart, sheet } = useFollowListUnfollowSheet();
  const refreshQueries = useRefreshQueries([
    userKeys.me(),
    userKeys.followers(userId),
  ]);
  const { refreshControl } = useLogoRefreshControl({
    onRefresh: refreshQueries,
  });
  const followers = data.pages.flat();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1, backgroundColor: colors.bg.primary }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={followers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FollowItem
            id={item.id}
            nickname={item.nickname}
            profileImageUrl={item.profileImageUrl}
            isFollowedByMe={item.isFollowedByMe}
            currentUserId={currentUser.id}
            onUnfollowStart={handleUnfollowStart}
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="typo-body1 text-semantic-text-tertiary">
              아직 팔로워가 없어요
            </Text>
          </View>
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
          ) : null
        }
      />
      {sheet}
    </View>
  );
};

// ─── Following list ──────────────────────────────────────────

const FollowingList = ({ userId }: { userId: string }) => {
  const { data: currentUser } = useUserProfileQuery();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserFollowingsQuery(userId);
  const { colors } = useColors();
  const { handleUnfollowStart, sheet } = useFollowListUnfollowSheet();
  const refreshQueries = useRefreshQueries([
    userKeys.me(),
    userKeys.followings(userId),
  ]);
  const { refreshControl } = useLogoRefreshControl({
    onRefresh: refreshQueries,
  });
  const followings = data.pages.flat();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1, backgroundColor: colors.bg.primary }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={followings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FollowItem
            id={item.id}
            nickname={item.nickname}
            profileImageUrl={item.profileImageUrl}
            isFollowedByMe={item.isFollowedByMe}
            currentUserId={currentUser.id}
            onUnfollowStart={handleUnfollowStart}
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="typo-body1 text-semantic-text-tertiary">
              아직 팔로잉하는 유저가 없어요
            </Text>
          </View>
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
          ) : null
        }
      />
      {sheet}
    </View>
  );
};

export { FollowListSkeleton, FollowerList, FollowingList };
