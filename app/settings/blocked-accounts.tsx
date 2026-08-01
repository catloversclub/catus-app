import {
  useBlockedUsersQuery,
  useUnblockUserMutation,
  userKeys,
} from "@/api/domains/user/queries";
import type { BlockedUser } from "@/api/domains/user/types";
import Button from "@/components/common/button";
import CenterModal from "@/components/modal/center-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import UserProfileImage from "@/components/user/profile-image";
import { useColors } from "@/hooks/use-colors";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const BlockedAccountsSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index) => (
      <View key={index} className="flex-row items-center gap-3 px-4 py-3">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="h-4 w-[120px] rounded" />
        <View className="flex-1" />
        <Skeleton className="h-[34px] w-[68px]" />
      </View>
    ))}
  </>
);

interface UnblockModalProps {
  user: BlockedUser | null;
  onClose: () => void;
}

const UnblockModal = ({ user, onClose }: UnblockModalProps) => {
  const { mutate: unblock, isPending } = useUnblockUserMutation();

  const handleConfirm = () => {
    if (!user) return;
    unblock(user.id, { onSuccess: onClose });
  };

  return (
    <CenterModal visible={user !== null} onClose={onClose}>
      <View className="rounded-lg bg-semantic-bg-primary p-4">
        <Text className="typo-body1 mb-1.5 text-semantic-text-secondary">
          차단을 해제할까요?
        </Text>
        <Text className="typo-body4 mb-5 text-semantic-text-tertiary">
          {user?.nickname}님의 차단을 해제하면 서로의 게시물과 프로필을 다시
          확인할 수 있어요.
        </Text>
        <View className="flex-row gap-1.5">
          <View className="flex-1">
            <Button
              button={{
                label: "취소",
                onPress: onClose,
                variant: "secondary",
                size: "lg",
                disabled: isPending,
              }}
            />
          </View>
          <View className="flex-1">
            <Button
              button={{
                label: "차단 해제",
                onPress: handleConfirm,
                size: "lg",
                isPending,
              }}
            />
          </View>
        </View>
      </View>
    </CenterModal>
  );
};

const BlockedAccountsList = () => {
  const { colors } = useColors();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBlockedUsersQuery();
  const { onRefresh, refreshing } = useRefreshQueries([userKeys.blocks()]);
  const [selectedUser, setSelectedUser] = useState<BlockedUser | null>(null);
  const blockedUsers = data.pages.flat();

  const renderItem = useCallback(
    ({ item }: { item: BlockedUser }) => (
      <View className="flex-row items-center gap-3 px-4 py-3">
        <UserProfileImage imageUrl={item.profileImageUrl} size="sm" />
        <Text
          className="typo-body3 flex-1 text-semantic-text-primary"
          numberOfLines={1}
        >
          {item.nickname}
        </Text>
        <Button
          button={{
            label: "차단 해제",
            onPress: () => setSelectedUser(item),
            variant: "secondary",
            size: "md",
          }}
          className="h-[34px] w-[68px] rounded-[4px] py-0"
          textClassName="typo-body4"
        />
      </View>
    ),
    [],
  );

  return (
    <View className="flex-1">
      <FlatList
        className="flex-1"
        style={{ backgroundColor: colors.bg.primary }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={blockedUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="typo-body1 text-semantic-text-tertiary">
              차단한 계정이 없어요
            </Text>
          </View>
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" className="my-3" />
          ) : null
        }
      />
      <UnblockModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </View>
  );
};

const BlockedAccountsScreen = () => (
  <View className="flex-1 bg-semantic-bg-primary">
    <SuspenseWithDelay fallback={<BlockedAccountsSkeleton />}>
      <BlockedAccountsList />
    </SuspenseWithDelay>
  </View>
);

export default BlockedAccountsScreen;
