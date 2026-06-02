import { useUserProfileQuery } from "@/api/domains/user/queries";
import { ButtonType } from "@/components/common/button";
import ProfileActionButtons from "@/components/user/profile/profile-action-buttons";

import { router } from "expo-router";
import { Share } from "react-native";

const ProfileActions = () => {
  const { data: userData } = useUserProfileQuery();

  const handleShare = async () => {
    await Share.share({
      message: "내 프로필을 확인해보세요!",
      url: `catus://user/${userData.id}`,
    });
  };

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
