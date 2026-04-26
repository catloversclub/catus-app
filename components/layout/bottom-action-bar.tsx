import { Pressable, Text, View } from "react-native";

type ActionButton = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

interface BottomActionBarProps {
  buttons: ActionButton[];
}

const BottomActionBar = ({ buttons }: BottomActionBarProps) => {
  return (
    <View className="pt-3 pb-16 border-t border-semantic-border-primary px-3 gap-2">
      {buttons.map((btn) => (
        <Pressable
          key={btn.label}
          onPress={btn.onPress}
          disabled={btn.disabled}
          className={`py-3 rounded items-center ${
            btn.variant === "secondary"
              ? "bg-transparent border border-semantic-border-primary"
              : btn.disabled
                ? "bg-semantic-button-primary-disabledBg"
                : "bg-semantic-button-primary-bg"
          }`}
        >
          <Text
            className={`typo-body1 ${
              btn.variant === "secondary"
                ? "text-semantic-text-primary"
                : btn.disabled
                  ? "text-semantic-button-primary-disabledText"
                  : "text-semantic-button-primary-text"
            }`}
          >
            {btn.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default BottomActionBar;
