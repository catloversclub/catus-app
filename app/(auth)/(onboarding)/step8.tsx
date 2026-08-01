import BottomActionBar from "@/components/layout/bottom-action-bar";
import { useAuthStore } from "@/store/auth/auth-store";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Step8 = () => {
  const setAuthStatus = useAuthStore((state) => state.setStatus);

  const handleStartPress = () => {
    setAuthStatus("authenticated");
  };

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <ScrollView
        className="py-10 px-5"
        contentContainerStyle={{ flexGrow: 1, gap: 80 }}
      >
        <Text className="typo-title2 text-semantic-text-primary">
          모든 준비가 끝났어요!{"\n"}이제 귀여운 고양이들을 구경해볼까요? 👀
        </Text>
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "시작하기",
            onPress: handleStartPress,
          },
        ]}
      />
    </View>
  );
};

export default Step8;
