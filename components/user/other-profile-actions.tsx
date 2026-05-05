import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

const ProfileActions = () => {
  return (
    <View className="flex-row w-full mb-[26px] px-3">
      <Link href={`/mypage/update`} asChild>
        <Pressable className="active:opacity-60">
          <View className="flex-1 justify-center items-center border border-semantic-border-primary py-2 rounded-sm">
            <Text className="text-semantic-text-primary typo-body3">
              팔로우
            </Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
};

export default ProfileActions;
