import { testNotification } from "@/api/domains/notification/api";
import Button from "@/components/common/button";

import { router } from "expo-router";
import { Share, View } from "react-native";

const ProfileActions = () => {
  const handleShare = async () => {
    await Share.share({
      message: "내 프로필을 확인해보세요!",
      // url: `https://catus.app/user/${userId}` // userId가 있다면 추가
    });
  };

  const handleNotificationTest = async () => {
    await testNotification();
  };
  return (
    <View className="flex-row gap-1.5 w-full mb-[26px] px-5">
      <View className="flex-1">
        <Button
          button={{
            label: "프로필 수정",
            onPress: () => router.push(`/mypage/update`),
            variant: "secondary",
            size: "md",
          }}
        />
      </View>
      <View className="flex-1">
        <Button
          button={{
            label: "프로필 공유",
            onPress: handleShare,
            variant: "secondary",
            size: "md",
          }}
        />
      </View>
      <View className="flex-1">
        {" "}
        <Button
          button={{
            label: "푸시 알림 테스트",
            onPress: handleNotificationTest,
            variant: "secondary",
            size: "md",
          }}
        />
      </View>
    </View>
  );
};

export default ProfileActions;
