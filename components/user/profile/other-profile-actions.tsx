import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useUserDetailQuery,
} from "@/api/domains/user/queries";
import { ButtonType } from "@/components/common/button";
import ProfileActionButtons from "@/components/user/profile/profile-action-buttons";

import { Share } from "react-native";

interface OtherProfileActionsProps {
  userId: string;
}

const OtherProfileActions = ({ userId }: OtherProfileActionsProps) => {
  const { data: profile } = useUserDetailQuery(userId);
  const { mutate: followUser, isPending: isFollowPending } =
    useFollowUserMutation();
  const { mutate: unfollowUser, isPending: isUnfollowPending } =
    useUnfollowUserMutation();

  const isFollowing = profile.isFollowing;
  const isPending = isFollowPending || isUnfollowPending;

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  const handleShare = async () => {
    await Share.share({
      message: "이 프로필을 확인해보세요!",
      url: `catus://user/${userId}`,
    });
  };

  const buttons: ButtonType[] = [
    {
      label: isFollowing ? "팔로잉" : "팔로우",
      onPress: handleFollowToggle,
      variant: isFollowing ? "secondary" : "primary",
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
