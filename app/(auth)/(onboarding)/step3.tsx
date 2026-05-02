import Select from "@/components/common/select";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import { ROUTES } from "@/constants/route";
import { useUpdateUser } from "@/hooks/user/use-update-user";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Step3 = () => {
  const { updateUser, isPending } = useUpdateUser();
  const [isLivingWithCat, setIsLivingWithCat] = useState(
    null as null | boolean,
  );

  const handlePressNext = async () => {
    if (isLivingWithCat) {
      await updateUser({ isLivingWithCat });
      router.push(ROUTES.AUTH.ONBOARDING.STEP4);
    } else {
      router.push(ROUTES.AUTH.ONBOARDING.STEP7);
    }
  };

  return (
    <View className="flex-1 bg-semantic-bg-primary pt-6">
      <ProgressBar progress={3} />
      <ScrollView className="px-5" contentContainerStyle={{ flexGrow: 1 }}>
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
            onPress: handlePressNext,
            disabled: isLivingWithCat === null,
            isPending: isPending,
          },
        ]}
      />
    </View>
  );
};

export default Step3;
