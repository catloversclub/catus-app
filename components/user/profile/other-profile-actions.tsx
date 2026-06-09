import { useUserDetailQuery } from "@/api/domains/user/queries";
import SelectCatSheet from "@/components/bottom-sheet/select-cat-sheet";
import { ButtonType } from "@/components/common/button";
import ProfileActionButtons from "@/components/user/profile/profile-action-buttons";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useUserFollowToggle } from "@/hooks/user/use-user-follow-toggle";
import { shareUser } from "@/lib/share";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";

interface OtherProfileActionsProps {
  userId: string;
}

const OtherProfileActions = ({ userId }: OtherProfileActionsProps) => {
  const { data: profile } = useUserDetailQuery(userId);
  const selectCatSheetRef = useRef<BottomSheetModal>(null);
  const { followWithCats, toggleFollow, isPending } = useUserFollowToggle({
    userId,
    isFollowing: profile.isFollowing,
    onFollowStart: () => selectCatSheetRef.current?.present(),
  });

  const handleShare = () => shareUser(userId, profile.nickname);

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
          onConfirm={followWithCats}
        />
      </SuspenseWithDelay>
    </>
  );
};

export default OtherProfileActions;
