import BottomActionBar from "@/components/layout/bottom-action-bar";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const DeleteAccount = () => {
  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <ScrollView contentContainerClassName="py-6 px-5 gap-10 flex-col">
        <Text className="typo-title2 text-semantic-text-primary">
          떠나시는 이유를 알려주세요. {"\n"}더욱 노력하는 CatUs가 되겠습니다.
        </Text>
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "탈퇴하기",
            onPress: () => {},
          },
          {
            label: "계정 유지하기",
            onPress: () => router.push("/settings"),
            variant: "secondary",
          },
        ]}
      />
    </View>
  );
};

export default DeleteAccount;
