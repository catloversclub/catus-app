import { Pressable, Text, View } from "react-native";

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
      {options.map((option) => {
        const isChipSelected = selected.has(option.id);
        return (
          <Pressable
            key={option.id}
            onPress={() => onChangeSelected(option.id)}
            className={`items-center rounded py-1 px-2.5 ${
              isChipSelected
                ? "bg-semantic-chips-primary-selectedBg"
                : "bg-semantic-chips-primary-bg"
            }`}
          >
            <Text
              className={`typo-label1 ${
                isChipSelected
                  ? "text-semantic-chips-primary-selectedText"
                  : "text-semantic-chips-primary-text"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default ChipsSelect;
