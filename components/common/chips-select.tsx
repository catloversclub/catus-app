import { Chip } from "@/components/common/chip";
import { View } from "react-native";

interface ChipsSelectProps {
  options: { label: string; id: number }[];
  selected: Set<number>;
  onChangeSelected: (id: number) => void;
}

const ChipsSelect = ({
  options,
  selected,
  onChangeSelected,
}: ChipsSelectProps) => {
  return (
    <View className="flex-row flex-wrap gap-3">
      {options.map((option) => (
        <Chip
          key={option.id}
          label={option.label}
          selected={selected.has(option.id)}
          onPress={() => onChangeSelected(option.id)}
        />
      ))}
    </View>
  );
};

export default ChipsSelect;
