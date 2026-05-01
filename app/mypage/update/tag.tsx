import { useUserProfileQuery } from "@/api/domains/user/queries";
import SelectAppearance from "@/components/tag/select-appearance";
import SelectPersonality from "@/components/tag/select-personality";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const UpdateTag = () => {
  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <ScrollView
        className="py-6 px-3"
        contentContainerStyle={{ alignItems: "center", gap: 32 }}
      >
        <View className="flex-col gap-1.5 w-full">
          <Text className="typo-title2 text-semantic-text-primary">
            내 관심사를 선택해보세요!
          </Text>
          <Text className="typo-body4 text-semantic-text-tertiary">
            {
              "선택한 태그는 프로필에 공개되지 않고\n게시물 추천을 위해서만 활용돼요."
            }
          </Text>
        </View>
        <View className="flex-col gap-10">
          <UpdatePersonality />
          <UpdateAppearance />
        </View>
      </ScrollView>
      <View className="pt-3 pb-16 border border-semantic-border-primary px-3">
        <Pressable className="bg-semantic-button-primary-disabledBg py-3 rounded items-center">
          <Text className="typo-body1 text-semantic-button-primary-disabledText">
            저장
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const UpdatePersonality = () => {
  const { data: userData } = useUserProfileQuery();
  const selectedPersonalityIds = userData.favoritePersonalities.map(
    (p) => p.id,
  );

  const [selectedPersonality, setSelectedPersonality] = useState<Set<number>>(
    new Set(selectedPersonalityIds),
  );

  return (
    <SelectPersonality
      selectedPersonality={selectedPersonality}
      setSelectedPersonality={setSelectedPersonality}
    />
  );
};

const UpdateAppearance = () => {
  const { data: userData } = useUserProfileQuery();
  const selectedAppearanceIds = userData.favoriteAppearances.map((a) => a.id);

  const [selectedAppearance, setSelectedAppearance] = useState<Set<number>>(
    new Set(selectedAppearanceIds),
  );

  return (
    <SelectAppearance
      selectedAppearance={selectedAppearance}
      setSelectedAppearance={setSelectedAppearance}
    />
  );
};

export default UpdateTag;
