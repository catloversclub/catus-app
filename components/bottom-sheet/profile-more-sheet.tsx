import { useUserCatsQuery } from "@/api/domains/cat/queries";
import {
  useBlockUserMutation,
  useUserDetailQuery,
} from "@/api/domains/user/queries";
import BanIcon from "@/assets/icons/ban.svg";
import BlockIcon from "@/assets/icons/block.svg";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import SelectCatSheet from "@/components/bottom-sheet/select-cat-sheet";
import ActionPressable from "@/components/common/action-pressable";
import Button from "@/components/common/button";
import CenterModal from "@/components/modal/center-modal";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useUserFollowToggle } from "@/hooks/user/use-user-follow-toggle";
import { presentBottomSheet } from "@/lib/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

interface ProfileMoreSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  userId: string;
}

const ProfileMoreSheet = ({
  bottomSheetRef,
  userId,
}: ProfileMoreSheetProps) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { data: cats } = useUserCatsQuery(userId);
  const { mutate: blockUser, isPending: isBlockPending } =
    useBlockUserMutation();
  const selectCatSheetRef = useRef<BottomSheetModal>(null);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const followedCatIds = useMemo(
    () => cats.filter((cat) => cat.isFollowedByMe).map((cat) => cat.id),
    [cats],
  );
  const { followWithCats, unfollowWithCats, isPending: isFollowPending } =
    useUserFollowToggle({ userId, isFollowing: profile.isFollowing });

  const handleBlockPress = () => {
    bottomSheetRef.current?.dismiss();
    setIsBlockModalVisible(true);
  };

  const handleHideCatsPress = () => {
    bottomSheetRef.current?.dismiss();
    presentBottomSheet(selectCatSheetRef);
  };

  const handleConfirmCats = (selectedCatIds: string[]) => {
    const currentIds = new Set(followedCatIds);
    const selectedIds = new Set(selectedCatIds);
    const followCatIds = selectedCatIds.filter((catId) => !currentIds.has(catId));
    const unfollowCatIds = followedCatIds.filter(
      (catId) => !selectedIds.has(catId),
    );

    if (followCatIds.length > 0) followWithCats(followCatIds);
    if (unfollowCatIds.length > 0) unfollowWithCats(unfollowCatIds);
  };

  const handleConfirmBlock = () => {
    blockUser(userId, {
      onSuccess: () => {
        setIsBlockModalVisible(false);
        Toast.show({
          type: "success",
          text1: `${profile.nickname}님을 차단했어요`,
        });
        router.back();
      },
      onError: () => {
        Toast.show({ type: "error", text1: "다시 시도해주세요" });
      },
    });
  };

  return (
    <>
      <BaseBottomSheet BaseBottomSheetModalRef={bottomSheetRef}>
        <View className="w-full pb-16 pt-6">
          <ActionPressable
            onPress={handleBlockPress}
            className="flex-row items-center justify-center gap-1.5 py-[14px]"
          >
            <BlockIcon width={20} height={20} />
            <Text className="typo-body1 text-semantic-text-primary">
              차단하기
            </Text>
          </ActionPressable>
          <ActionPressable
            onPress={handleHideCatsPress}
            disabled={isFollowPending}
            className="flex-row items-center justify-center gap-1.5 py-[14px] disabled:opacity-50"
          >
            <BanIcon width={20} height={20} />
            <Text className="typo-body1 text-semantic-text-primary">
              고양이 숨기기
            </Text>
          </ActionPressable>
        </View>
      </BaseBottomSheet>

      <SuspenseWithDelay fallback={null} delay={0}>
        <SelectCatSheet
          bottomSheetRef={selectCatSheetRef}
          userId={userId}
          initialSelectedCatIds={followedCatIds}
          onConfirm={handleConfirmCats}
        />
      </SuspenseWithDelay>

      <CenterModal
        visible={isBlockModalVisible}
        onClose={() => setIsBlockModalVisible(false)}
      >
        <View className="rounded-lg bg-semantic-bg-primary p-4">
          <Text className="typo-body1 mb-1.5 text-semantic-text-secondary">
            {profile.nickname}님을 차단할까요?
          </Text>
          <Text className="typo-body4 mb-5 text-semantic-text-tertiary">
            해당 사용자의 게시물과 댓글이 더 이상 보이지 않아요
          </Text>
          <View className="flex-row gap-1.5">
            <View className="flex-1">
              <Button
                button={{
                  label: "취소",
                  onPress: () => setIsBlockModalVisible(false),
                  variant: "secondary",
                  size: "lg",
                  disabled: isBlockPending,
                }}
              />
            </View>
            <View className="flex-1">
              <Button
                button={{
                  label: "차단하기",
                  onPress: handleConfirmBlock,
                  size: "lg",
                  isPending: isBlockPending,
                }}
              />
            </View>
          </View>
        </View>
      </CenterModal>
    </>
  );
};

export default ProfileMoreSheet;
