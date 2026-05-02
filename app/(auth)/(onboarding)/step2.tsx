import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import ProfileImage from "@/components/user/profile-image";
import { ROUTES } from "@/constants/route";
import { useUpdateUser } from "@/hooks/user/use-update-user";
import { router } from "expo-router";

import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Step2 = () => {
  const { submitProfileImage, isPending } = useUpdateUser();

  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePressNext = async () => {
    if (!imageUri) return;
    await submitProfileImage(imageUri);
    router.push(ROUTES.AUTH.ONBOARDING.STEP3);
  };

  const handlePressSkip = () => {
    router.push(ROUTES.AUTH.ONBOARDING.STEP3);
  };

  return (
    <View className="flex-1 bg-semantic-bg-primary pt-6">
      <ProgressBar progress={2} />
      <ScrollView className="px-5" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="h-10" />
        <Text className="typo-title2 text-semantic-text-primary">
          프로필 사진을 추가해주세요
        </Text>
        <View className="h-6" />
        <View className="items-center">
          <ProfileImage
            imageUrl={imageUri}
            size="lg"
            isEditMode
            handleImageUriChange={setImageUri}
          />
        </View>
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "다음으로",
            onPress: handlePressNext,
            disabled: imageUri === null,
            isPending: isPending,
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

export default Step2;
