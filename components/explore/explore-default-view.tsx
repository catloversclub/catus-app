import { Pressable, ScrollView, Text, View } from "react-native";

const ExploreDefaultView = () => (
  <ScrollView
    className="flex-1"
    contentContainerClassName="gap-6 pb-6"
    showsVerticalScrollIndicator={false}
  >
    <View className="px-3 pt-6 gap-6">
      <Pressable className="px-3 py-4 rounded gap-0.5 border border-[#C2E9FF] bg-[#EBF8FF]">
        <Text className="typo-title3 text-semantic-text-primary">
          천하제일 내 고양이 자랑대회
        </Text>
        <Text className="typo-body4 text-semantic-text-secondary">
          우리 고양이를 더 널리 알려보세요!
        </Text>
      </Pressable>
    </View>
  </ScrollView>
);

export default ExploreDefaultView;
