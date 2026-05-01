import { useMyCatsQuery } from "@/api/domains/cat/queries";
import PlusIcon from "@/assets/icons/plus.svg";
import CatCard from "@/components/cat/cat-card";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import { ROUTES } from "@/constants/route";
import { useOnboardingStore } from "@/store/onboarding-store";
import { router } from "expo-router";

import { useColors } from "@/hooks/use-colors";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Step6 = () => {
  const { colors } = useColors();
  const { cat } = useOnboardingStore();
  const { data: catData } = useMyCatsQuery();
  const handlePressAddMore = () => {
    router.push(ROUTES.AUTH.ONBOARDING.STEP5);
  };
  return (
    <View className="flex-1 bg-semantic-bg-primary pt-6">
      <ProgressBar progress={6} />
      <ScrollView className="px-5" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="h-10" />
        <Text className="typo-title2 text-semantic-text-primary">
          {cat.name}의 프로필이 완성되었어요!
        </Text>
        <View className="h-6" />
        <View className="flex-col gap-1.5">
          {catData.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </View>
        <TouchableOpacity
          onPress={handlePressAddMore}
          className="py-3 flex-row items-center gap-1.5"
        >
          <PlusIcon width={16} height={16} fill={colors.icon.tertiary} />
          <Text className="text-semantic-button-ghost-text typo-body4">
            더 추가하기
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "다음으로",
            onPress: () => router.push(ROUTES.AUTH.ONBOARDING.STEP7),
          },
        ]}
      />
    </View>
  );
};

export default Step6;
