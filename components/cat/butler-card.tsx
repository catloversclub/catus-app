import { useUserCatsQuery } from "@/api/domains/cat/queries";
import { useUserDetailQuery } from "@/api/domains/user/queries";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import SelectCatSheet from "@/components/bottom-sheet/select-cat-sheet";
import ActionPressable from "@/components/common/action-pressable";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import FollowButton from "@/components/user/follow-button";
import UserProfileImage from "@/components/user/profile-image";
import { useColors } from "@/hooks/use-colors";
import { useUserFollowToggle } from "@/hooks/user/use-user-follow-toggle";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Text, View } from "react-native";

interface CatButlerCardProps {
  userId: string;
}

const CatButlerCard = ({ userId }: CatButlerCardProps) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { data: cats } = useUserCatsQuery(userId);
  const { colors } = useColors();
  const selectCatSheetRef = useRef<BottomSheetModal>(null);
  const followedCatIds = useMemo(
    () => cats.filter((cat) => cat.isFollowedByMe).map((cat) => cat.id),
    [cats],
  );
  const { unfollowWithCats } = useUserFollowToggle({
    userId,
    isFollowing: profile.isFollowing,
  });
  const handleConfirmUnfollow = (selectedCatIds: string[]) => {
    const selectedCatIdSet = new Set(selectedCatIds);
    const unfollowCatIds = followedCatIds.filter(
      (catId) => !selectedCatIdSet.has(catId),
    );
    if (unfollowCatIds.length > 0) unfollowWithCats(unfollowCatIds);
  };

  return (
    <>
      <View className="mx-3 flex-row items-center rounded-[10px] bg-semantic-bg-secondary px-6 py-2">
        <ActionPressable
          href={{ pathname: "/user/[id]", params: { id: userId } }}
          className="flex-1 flex-row items-center gap-3"
        >
          <UserProfileImage
            imageUrl={profile.profileImageUrl ?? null}
            size="base"
            isPreviewDisabled
          />
          <View className="flex-1">
            <Text className="typo-label1 text-semantic-text-secondary">
              집사
            </Text>
            <Text
              className="typo-body3 text-semantic-text-secondary"
              numberOfLines={1}
            >
              {profile.nickname}
            </Text>
          </View>
        </ActionPressable>
        <View className="ml-3">
          <FollowButton
            userId={userId}
            isFollowing={profile.isFollowing}
            size="md"
            onUnfollowStart={() => selectCatSheetRef.current?.present()}
          />
        </View>
        <ActionPressable
          href={{ pathname: "/user/[id]", params: { id: userId } }}
          className="pl-3"
          accessibilityLabel={`${profile.nickname} 집사 프로필로 이동`}
        >
          <ChevronRightIcon
            width={16}
            height={16}
            color={colors.icon.tertiary}
          />
        </ActionPressable>
      </View>
      <SuspenseWithDelay fallback={null} delay={0}>
        <SelectCatSheet
          bottomSheetRef={selectCatSheetRef}
          userId={userId}
          initialSelectedCatIds={followedCatIds}
          onConfirm={handleConfirmUnfollow}
        />
      </SuspenseWithDelay>
    </>
  );
};

export default CatButlerCard;
