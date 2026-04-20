import { Link } from "expo-router";
import { Pressable, Share, Text, View } from "react-native";

const ProfileActions = () => {
  const handleShare = async () => {
    await Share.share({
      message: "내 프로필을 확인해보세요!",
      // url: `https://catus.app/user/${userId}` // userId가 있다면 추가
    });
  };

  return (
    <View className="flex-row gap-1.5 w-full mb-[26px] px-3">
      <Link href={`/mypage/update`} asChild>
        <Pressable className="active:opacity-60 flex-1">
          <View className="justify-center items-center border border-semantic-border-primary py-2 rounded-sm">
            <Text className="text-semantic-text-primary typo-body3">
              프로필 수정
            </Text>
          </View>
        </Pressable>
      </Link>
      <Pressable
        onPress={handleShare}
        className="active:opacity-60 flex-1 justify-center items-center border border-semantic-border-primary py-2 rounded-sm"
      >
        <Text className="text-semantic-text-primary typo-body3">
          프로필 공유
        </Text>
      </Pressable>
    </View>
  );
};

export default ProfileActions;
