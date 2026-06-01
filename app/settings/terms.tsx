import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Follower = () => {
  return (
    <SafeAreaView className="flex-1 bg-semantic-bg-primary">
      <View className="flex-1 items-center justify-center">
        <Text className="typo-label1 text-semantic-text-secondary">
          팔로워 목록이 표시되는 화면입니다.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Follower;
