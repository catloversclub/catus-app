import {
  useAppearanceQuery,
  usePersonalityQuery,
} from "@/api/domains/attribute/queries";
import ChipsSelect from "@/components/common/chips-select";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UpdatePersonality = () => {
  const { data: personalityData } = usePersonalityQuery();
  const personalityOptions = personalityData.map((item) => ({
    label: item.label,
    id: item.id,
  }));

  const [selectedPersonality, setSelectedPersonality] = useState<Set<number>>(
    new Set(),
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
    <View className="flex-1 flex-col gap-6 w-full mb-3">
      <View className="flex-1 flex-col gap-1.5 w-full">
        <Text className="typo-body1 text-semantic-text-primary">성격</Text>
        <Text className="typo-label1 text-semantic-text-tertiary">
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
  const [selectedAppearance, setSelectedAppearance] = useState<Set<number>>(
    new Set(),
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
    <View className="flex-1 flex-col gap-6 w-full mb-3">
      <View className="flex-1 flex-col gap-1.5 w-full">
        <Text className="typo-body1 text-semantic-text-primary">외모</Text>
        <Text className="typo-label1 text-semantic-text-tertiary">
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
    <SafeAreaView className="flex-1 bg-semantic-bg-primary px-3">
      <ScrollView className="flex-1 flex-col gap-8">
        <View className="flex-col gap-1.5 w-full mb-3">
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
    </SafeAreaView>
  );
};

export default UpdateTag;
