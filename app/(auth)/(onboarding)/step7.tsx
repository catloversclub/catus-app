import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import SelectAppearance from "@/components/tag/select-appearance";
import SelectPersonality from "@/components/tag/select-personality";
import { ROUTES } from "@/constants/route";
import { useOnboardingStore } from "@/store/onboarding-store";
import { router } from "expo-router";

import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Step7 = () => {
  const handlePressNext = async () => {
    router.push(ROUTES.AUTH.ONBOARDING.STEP8);
  };

  const handlePressSkip = () => {
    router.push(ROUTES.AUTH.ONBOARDING.STEP8);
  };
  return (
    <View className="flex-1 bg-semantic-bg-primary pt-6">
      <ProgressBar progress={7} />
      <ScrollView className="px-5" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="h-10" />
        <Text className="typo-title2 text-semantic-text-primary">
          마음이 가는 키워드를 골라주시면{"\n"}맞춤 콘텐츠를 추천해 드릴게요!
        </Text>
        <View className="h-6" />
        <CreatePersonality />
        <View className="h-10" />
        <CreateAppearance />
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "다음으로",
            onPress: handlePressNext,
          },
          {
            label: "건너뛰기",
            variant: "ghost",
            onPress: handlePressSkip,
          },
        ]}
      />
    </View>
  );
};

const CreatePersonality = () => {
  const { setUser } = useOnboardingStore();
  const [selectedPersonality, setSelectedPersonality] = useState<Set<number>>(
    new Set(),
  );

  const handleSelectedPersonalityChange = (value: Set<number>) => {
    setSelectedPersonality(value);
    setUser({ favoritePersonalities: Array.from(value) });
  };

  return (
    <SelectPersonality
      selectedPersonality={selectedPersonality}
      setSelectedPersonality={handleSelectedPersonalityChange}
    />
  );
};

const CreateAppearance = () => {
  const { setUser } = useOnboardingStore();
  const [selectedAppearance, setSelectedAppearance] = useState<Set<number>>(
    new Set(),
  );

  const handleSelectedAppearanceChange = (value: Set<number>) => {
    setSelectedAppearance(value);
    setUser({ favoriteAppearances: Array.from(value) });
  };

  return (
    <SelectAppearance
      selectedAppearance={selectedAppearance}
      setSelectedAppearance={handleSelectedAppearanceChange}
    />
  );
};

export default Step7;
