import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useUserFollowersQuery,
  useUserFollowingsQuery,
  userKeys,
} from "@/api/domains/user/queries";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import UserProfileImage from "@/components/user/profile-image";
import { Skeleton } from "@/components/ui/skeleton";
import { useColors } from "@/hooks/use-colors";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

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
}

const FollowItem = ({
  id,
  nickname,
  profileImageUrl,
  isFollowedByMe,
}: FollowItemProps) => {
  const { colors } = useColors();
  const { mutate: follow } = useFollowUserMutation();
  const { mutate: unfollow } = useUnfollowUserMutation();

  return (
    <View className="flex-row items-center gap-3 px-4 py-3">
      <Link href={`/user/${id}`} asChild>
        <Pressable className="active:opacity-70">
          <UserProfileImage imageUrl={profileImageUrl ?? null} size="sm" />
        </Pressable>
      </Link>
      <Link href={`/user/${id}`} asChild>
        <Pressable className="flex-1 active:opacity-70">
          <Text
            className="typo-body3 text-semantic-text-primary"
            numberOfLines={1}
          >
            {nickname}
          </Text>
        </Pressable>
      </Link>
      <Pressable
        onPress={() => (isFollowedByMe ? unfollow(id) : follow(id))}
        className="px-4 py-1.5 rounded-md border active:opacity-70"
        style={{
          borderColor: isFollowedByMe
            ? colors.border.primary
            : colors.border.accent,
          backgroundColor: isFollowedByMe
            ? "transparent"
            : colors.button.primary.bg,
        }}
      >
        <Text
          className="typo-body4"
          style={{
            color: isFollowedByMe
              ? colors.text.secondary
              : colors.button.primary.text,
          }}
        >
          {isFollowedByMe ? "팔로잉" : "팔로우"}
        </Text>
      </Pressable>
    </View>
  );
};

// ─── Follower list ───────────────────────────────────────────

const FollowerList = ({ userId }: { userId: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserFollowersQuery(userId);
  const { colors } = useColors();
  const refreshQueries = useRefreshQueries([userKeys.followers(userId)]);
  const { onScrollEndDrag, logoOverlay } = useLogoRefreshControl({
    onRefresh: refreshQueries,
  });
  const followers = data.pages.flat();

  return (
    <View style={{ flex: 1 }}>
      {logoOverlay}
      <FlatList
        style={{ flex: 1, backgroundColor: colors.bg.primary }}
        data={followers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FollowItem
            id={item.id}
            nickname={item.nickname}
            profileImageUrl={item.profileImageUrl}
            isFollowedByMe={item.isFollowedByMe}
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
        onScrollEndDrag={onScrollEndDrag}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
          ) : null
        }
      />
    </View>
  );
};

// ─── Following list ──────────────────────────────────────────

const FollowingList = ({ userId }: { userId: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserFollowingsQuery(userId);
  const { colors } = useColors();
  const refreshQueries = useRefreshQueries([userKeys.followings(userId)]);
  const { onScrollEndDrag, logoOverlay } = useLogoRefreshControl({
    onRefresh: refreshQueries,
  });
  const followings = data.pages.flat();

  return (
    <View style={{ flex: 1 }}>
      {logoOverlay}
      <FlatList
        style={{ flex: 1, backgroundColor: colors.bg.primary }}
        data={followings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FollowItem
            id={item.id}
            nickname={item.nickname}
            profileImageUrl={item.profileImageUrl}
            isFollowedByMe={item.isFollowedByMe}
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
        onScrollEndDrag={onScrollEndDrag}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
          ) : null
        }
      />
    </View>
  );
};

export { FollowListSkeleton, FollowerList, FollowingList };
