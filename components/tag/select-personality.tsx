import { usePersonalityQuery } from "@/api/domains/attribute/queries";
import ChipsSelect from "@/components/common/chips-select";
import { Text, View } from "react-native";

interface SelectPersonalityProps {
  selectedPersonality: Set<number>;
  setSelectedPersonality: (value: Set<number>) => void;
}

const SelectPersonality = ({
  selectedPersonality,
  setSelectedPersonality,
}: SelectPersonalityProps) => {
  const { data: personalityData } = usePersonalityQuery();
  const personalityOptions = personalityData.map((item) => ({
    label: item.label,
    id: item.id,
  }));

  const handleSelectPersonality = (id: number) => {
    const next = new Set(selectedPersonality);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedPersonality(next);
  };

  return (
    <View className="flex-col gap-6 w-full">
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

export default SelectPersonality;
