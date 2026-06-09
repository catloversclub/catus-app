import { useUserProfileQuery } from "@/api/domains/user/queries";
import { ButtonType } from "@/components/common/button";
import ProfileActionButtons from "@/components/user/profile/profile-action-buttons";

import { shareUser } from "@/lib/share";
import { router } from "expo-router";

const ProfileActions = () => {
  const { data: userData } = useUserProfileQuery();

  const handleShare = () => shareUser(userData.id, userData.nickname);

  const buttons: ButtonType[] = [
    {
      label: "프로필 수정",
      onPress: () => router.push(`/mypage/update`),
      variant: "secondary",
      size: "md",
    },
    {
      label: "프로필 공유",
      onPress: handleShare,
      variant: "secondary",
      size: "md",
    },
  ];

  return <ProfileActionButtons buttons={buttons} />;
};

export default ProfileActions;
