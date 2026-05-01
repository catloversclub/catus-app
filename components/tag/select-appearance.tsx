import { useAppearanceQuery } from "@/api/domains/attribute/queries";
import ChipsSelect from "@/components/common/chips-select";
import { Text, View } from "react-native";

interface SelectAppearanceProps {
  selectedAppearance: Set<number>;
  setSelectedAppearance: (value: Set<number>) => void;
}

const SelectAppearance = ({
  selectedAppearance,
  setSelectedAppearance,
}: SelectAppearanceProps) => {
  const { data: appearanceData } = useAppearanceQuery();
  const appearanceOptions = appearanceData.map((item) => ({
    label: item.label,
    id: item.id,
  }));

  const handleSelectAppearance = (id: number) => {
    const next = new Set(selectedAppearance);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedAppearance(next);
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

export default SelectAppearance;
