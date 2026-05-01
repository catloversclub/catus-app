import {
  useGetProfileImageUploadUrlMutation,
  useUploadProfileImageMutation,
} from "@/api/domains/user/queries";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import ProfileImage from "@/components/user/profile-image";
import { ROUTES } from "@/constants/route";
import { useOnboardingStore } from "@/store/onboarding-store";
import { router } from "expo-router";

import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Step2 = () => {
  const { setUser } = useOnboardingStore();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const {
    mutate: getProfileImageUploadUrl,
    isPending: isGetProfileImageUploadUrlPending,
  } = useGetProfileImageUploadUrlMutation();
  const { mutate: uploadProfileImage, isPending: isUploadProfileImagePending } =
    useUploadProfileImageMutation();

  const handlePressNext = async () => {
    if (!imageUri) {
      return;
    }

    getProfileImageUploadUrl(undefined, {
      onSuccess: ({ fields }) => {
        uploadProfileImage(
          { fields, fileUri: imageUri },
          {
            onSuccess: () => {
              setUser({ profileImageUrl: fields.key });
              router.push(ROUTES.AUTH.ONBOARDING.STEP3);
            },
          },
        );
      },
      onError: (error) => {
        console.error(error);
      },
    });
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
            isPending:
              isGetProfileImageUploadUrlPending || isUploadProfileImagePending,
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
