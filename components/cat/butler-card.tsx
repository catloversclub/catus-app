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
import { useRef } from "react";
import { Text, View } from "react-native";

interface CatButlerCardProps {
  userId: string;
}

const CatButlerCard = ({ userId }: CatButlerCardProps) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { colors } = useColors();
  const selectCatSheetRef = useRef<BottomSheetModal>(null);
  const { followWithCats } = useUserFollowToggle({
    userId,
    isFollowing: profile.isFollowing,
  });

  return (
    <>
      <View className="mx-5 mt-8 flex-row items-center rounded-[8px] bg-semantic-bg-secondary px-5 py-4">
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
            <Text className="typo-body4 text-semantic-text-secondary">
              집사
            </Text>
            <Text
              className="typo-title4 text-semantic-text-primary"
              numberOfLines={1}
            >
              {profile.nickname}
            </Text>
          </View>
        </ActionPressable>
        <View className="ml-3 w-[86px]">
          <FollowButton
            userId={userId}
            isFollowing={profile.isFollowing}
            size="md"
            onFollowStart={() => selectCatSheetRef.current?.present()}
          />
        </View>
        <ActionPressable
          href={{ pathname: "/user/[id]", params: { id: userId } }}
          className="ml-4 p-1"
          accessibilityLabel={`${profile.nickname} 집사 프로필로 이동`}
        >
          <ChevronRightIcon
            width={24}
            height={24}
            color={colors.icon.tertiary}
          />
        </ActionPressable>
      </View>
      <SuspenseWithDelay fallback={null} delay={0}>
        <SelectCatSheet
          bottomSheetRef={selectCatSheetRef}
          userId={userId}
          onConfirm={followWithCats}
        />
      </SuspenseWithDelay>
    </>
  );
};

export default CatButlerCard;
