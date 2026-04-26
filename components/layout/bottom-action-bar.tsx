import Button, { ButtonType } from "@/components/common/button";
import { View } from "react-native";

interface BottomActionBarProps {
  buttons: Omit<ButtonType, "size">[];
}

const BottomActionBar = ({ buttons }: BottomActionBarProps) => {
  return (
    <View className="flex-col w-full pt-3 pb-16 border-t border-semantic-border-primary px-3 gap-2">
      {buttons.map((btn) => (
        <Button key={btn.label} button={{ ...btn, size: "lg" }} />
      ))}
    </View>
  );
};

export default BottomActionBar;
