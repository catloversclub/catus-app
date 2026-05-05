import { Pressable, Text, View } from "react-native";

// components/common/chips-select.tsx
interface SelectProps<T> {
  options: { label: string; value: T }[];
  value: T | undefined;
  onChange: (value: T) => void;
}

const Select = <T,>({ options, value, onChange }: SelectProps<T>) => {
  return (
    <View className="flex-row gap-1.5">
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            className={`flex-1 items-center rounded py-3 ${
              isSelected
                ? "bg-semantic-chips-primary-selectedBg"
                : "bg-semantic-chips-primary-bg"
            }`}
          >
            <Text
              className={`typo-body3 ${
                isSelected
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

export default Select;
