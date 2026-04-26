import {
  useAppearanceQuery,
  usePersonalityQuery,
} from "@/api/domains/attribute/queries";
import { useUserProfileQuery } from "@/api/domains/user/queries";
import ChipsSelect from "@/components/common/chips-select";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const UpdatePersonality = () => {
  const { data: personalityData } = usePersonalityQuery();
  const personalityOptions = personalityData.map((item) => ({
    label: item.label,
    id: item.id,
  }));

  const { data: userData } = useUserProfileQuery();
  const selectedPersonalityIds = userData.favoritePersonalities.map(
    (p) => p.id,
  );

  const [selectedPersonality, setSelectedPersonality] = useState<Set<number>>(
    new Set(selectedPersonalityIds),
  );

  const handleSelectPersonality = (id: number) => {
    setSelectedPersonality((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id); // 이미 선택된 거면 제거
      } else {
        next.add(id); // 없으면 추가
      }
      return next;
    });
  };

  return (
    <View className="flex-col gap-6 w-full ">
      <View className="flex-col gap-1.5 w-full">
        <Text className="typo-body1 text-semantic-text-primary">성격</Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          최대 2개까지 선택 가능해요
        </Text>
      </View>
      <ChipsSelect
        options={personalityOptions}
        selected={selectedPersonality}
        onChangeSelected={handleSelectPersonality}
      />
    </View>
  );
};
const UpdateAppearance = () => {
  const { data: appearanceData } = useAppearanceQuery();
  const appearanceOptions = appearanceData.map((item) => ({
    label: item.label,
    id: item.id,
  }));

  const { data: userData } = useUserProfileQuery();
  const selectedAppearanceIds = userData.favoriteAppearances.map((a) => a.id);

  const [selectedAppearance, setSelectedAppearance] = useState<Set<number>>(
    new Set(selectedAppearanceIds),
  );

  const handleSelectAppearance = (id: number) => {
    setSelectedAppearance((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id); // 이미 선택된 거면 제거
      } else {
        next.add(id); // 없으면 추가
      }
      return next;
    });
  };

  return (
    <View className="flex-col gap-6 w-full mb-3">
      <View className="flex-col gap-1.5 w-full">
        <Text className="typo-body1 text-semantic-text-primary">외모</Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          최대 2개까지 선택 가능해요
        </Text>
      </View>
      <ChipsSelect
        options={appearanceOptions}
        selected={selectedAppearance}
        onChangeSelected={handleSelectAppearance}
      />
    </View>
  );
};

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

export default UpdateTag;
