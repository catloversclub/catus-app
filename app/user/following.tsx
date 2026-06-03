import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useUserFollowingsQuery,
  useUserProfileQuery,
} from "@/api/domains/user/queries";
import UserProfileImage from "@/components/user/profile-image";
import { useColors } from "@/hooks/use-colors";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "expo-router";
import { Suspense } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

// ─── Skeleton ────────────────────────────────────────────────

const FollowListSkeleton = () => {
  return (
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
}

// ─── Content ─────────────────────────────────────────────────

const FollowingListContent = () => {
  const { data: me } = useUserProfileQuery();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserFollowingsQuery(me.id);
  const followings = data.pages.flat();

  const { mutate: follow } = useFollowUserMutation();
  const { mutate: unfollow } = useUnfollowUserMutation();

  const { colors } = useColors();

  if (followings.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="typo-body1 text-semantic-text-tertiary">
          아직 팔로잉하는 유저가 없어요
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1 }}
      data={followings}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Link href={`/user/${item.id}`} asChild>
            <Pressable className="active:opacity-70">
              <UserProfileImage imageUrl={item.profileImageUrl} size="sm" />
            </Pressable>
          </Link>
          <Link href={`/user/${item.id}`} asChild>
            <Pressable className="flex-1 active:opacity-70">
              <Text
                className="typo-body3 text-semantic-text-primary"
                numberOfLines={1}
              >
                {item.nickname}
              </Text>
            </Pressable>
          </Link>
          <Pressable
            onPress={() =>
              item.isFollowedByMe ? unfollow(item.id) : follow(item.id)
            }
            className="px-4 py-1.5 rounded-md border active:opacity-70"
            style={{
              borderColor: item.isFollowedByMe
                ? colors.border.primary
                : colors.border.accent,
              backgroundColor: item.isFollowedByMe
                ? "transparent"
                : colors.button.primary.bg,
            }}
          >
            <Text
              className="typo-body4"
              style={{
                color: item.isFollowedByMe
                  ? colors.text.secondary
                  : colors.button.primary.text,
              }}
            >
              {item.isFollowedByMe ? "팔로잉" : "팔로우"}
            </Text>
          </Pressable>
        </View>
      )}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
        ) : null
      }
    />
  );
}

// ─── Page ────────────────────────────────────────────────────

const Following = () => {
  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <Suspense fallback={<FollowListSkeleton />}>
        <FollowingListContent />
      </Suspense>
    </View>
  );
}

export default Following;
