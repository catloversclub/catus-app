import { Pressable, Text, View } from "react-native";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

const Chip = ({ label, selected = false, onPress }: ChipProps) => {
  const bgClass = selected
    ? "bg-semantic-chips-primary-selectedBg"
    : "bg-semantic-chips-primary-bg";
  const textClass = selected
    ? "text-semantic-chips-primary-selectedText"
    : "text-semantic-chips-primary-text";

  if (!onPress) {
    return (
      <View className={`items-center rounded py-1 px-2.5 ${bgClass}`}>
        <Text className={`typo-body4 ${textClass}`}>{label}</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className={`items-center rounded py-1 px-2.5 ${bgClass}`}
    >
      <Text className={`typo-body4 ${textClass}`}>{label}</Text>
    </Pressable>
  );
};

export { Chip };
