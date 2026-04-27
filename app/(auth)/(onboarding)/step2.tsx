import Select from "@/components/common/select";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Step2() {
  const [isLivingWithCat, setIsLivingWithCat] = useState(
    null as null | boolean,
  );

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <ScrollView
        className="py-10 px-5"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ProgressBar progress={2} />
        <View className="h-10" />
        <Text className="typo-title2 text-semantic-text-primary">
          지금 고양이와 살고 있나요?
        </Text>
        <View className="h-6" />
        <Select
          options={[
            { label: "네", value: true },
            { label: "아니오", value: false },
          ]}
          value={isLivingWithCat}
          onChange={setIsLivingWithCat}
        />
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "다음으로",
            onPress: () => router.push("/(auth)/(onboarding)/step3"),
            disabled: isLivingWithCat === null,
          },
        ]}
      />
    </View>
  );
}
