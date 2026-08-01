import { useUserDetailQuery } from "@/api/domains/user/queries";
import { ButtonType } from "@/components/common/button";
import ProfileActionButtons from "@/components/user/profile/profile-action-buttons";
import { useUserFollowToggle } from "@/hooks/user/use-user-follow-toggle";
import { shareUser } from "@/lib/share";

interface OtherProfileActionsProps {
  userId: string;
}

const OtherProfileActions = ({ userId }: OtherProfileActionsProps) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { toggleFollow, isPending } = useUserFollowToggle({
    userId,
    isFollowing: profile.isFollowing,
  });

  const handleShare = () => shareUser(userId);

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

  return <ProfileActionButtons buttons={buttons} />;
};

export default OtherProfileActions;
