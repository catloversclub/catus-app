import CheckboxFilled from "@/assets/icons/checkbox-filled.svg";
import CheckboxOutline from "@/assets/icons/checkbox-outline.svg";
import { useColors } from "@/hooks/use-colors";
import { Pressable, Text } from "react-native";

interface CheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
  label: string;
}

const Checkbox = ({ isChecked, onToggle, label }: CheckboxProps) => {
  const { colors } = useColors();
  return (
    <Pressable className="flex-row items-center gap-1.5" onPress={onToggle}>
      {isChecked ? (
        <CheckboxFilled width={24} height={24} />
      ) : (
        <CheckboxOutline width={24} height={24} color={colors.icon.secondary} />
      )}
      <Text className="typo-body1 text-semantic-text-primary flex-1">
        {label}
      </Text>
    </Pressable>
  );
};

export default Checkbox;
