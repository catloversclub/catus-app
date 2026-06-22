import { useUserCatsQuery } from "@/api/domains/cat/queries";
import { useUserDetailQuery } from "@/api/domains/user/queries";
import SelectCatSheet from "@/components/bottom-sheet/select-cat-sheet";
import { ButtonType } from "@/components/common/button";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import ProfileActionButtons from "@/components/user/profile/profile-action-buttons";
import { useUserFollowToggle } from "@/hooks/user/use-user-follow-toggle";
import { presentBottomSheet } from "@/lib/bottom-sheet";
import { shareUser } from "@/lib/share";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";

interface OtherProfileActionsProps {
  userId: string;
}

const OtherProfileActions = ({ userId }: OtherProfileActionsProps) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { data: cats } = useUserCatsQuery(userId);
  const selectCatSheetRef = useRef<BottomSheetModal>(null);
  const followedCatIds = useMemo(
    () => cats.filter((cat) => cat.isFollowedByMe).map((cat) => cat.id),
    [cats],
  );
  const { unfollowWithCats, toggleFollow, isPending } = useUserFollowToggle({
    userId,
    isFollowing: profile.isFollowing,
    onUnfollowStart: () => presentBottomSheet(selectCatSheetRef),
  });

  const handleShare = () => shareUser(userId);
  const handleConfirmUnfollow = (selectedCatIds: string[]) => {
    const selectedCatIdSet = new Set(selectedCatIds);
    const unfollowCatIds = followedCatIds.filter(
      (catId) => !selectedCatIdSet.has(catId),
    );
    if (unfollowCatIds.length > 0) unfollowWithCats(unfollowCatIds);
  };

  const buttons: ButtonType[] = [
    {
      label: profile.isFollowing ? "팔로잉" : "팔로우",
      onPress: toggleFollow,
      variant: profile.isFollowing ? "secondary" : "primary",
      size: "md",
      isPending,
    },
    {
      label: "공유",
      onPress: handleShare,
      variant: "secondary",
      size: "md",
    },
  ];

  return (
    <>
      <ProfileActionButtons buttons={buttons} />
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

export default OtherProfileActions;
