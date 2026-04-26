import { Pressable, Text } from "react-native";

export type ButtonType = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  size: "md" | "lg";
};

interface ButtonProps {
  button: ButtonType;
}

const Button = ({ button }: ButtonProps) => {
  return (
    <Pressable
      key={button.label}
      onPress={button.onPress}
      disabled={button.disabled}
      className={`rounded items-center flex-1 ${button.size === "lg" ? "py-3" : "py-2"} ${
        button.variant === "secondary"
          ? "bg-transparent border border-semantic-border-primary"
          : button.disabled
            ? "bg-semantic-button-primary-disabledBg"
            : "bg-semantic-button-primary-bg"
      }`}
    >
      <Text
        className={`
            ${button.size === "lg" ? "typo-body1" : "typo-body3"} ${
              button.variant === "secondary"
                ? "text-semantic-text-primary"
                : button.disabled
                  ? "text-semantic-button-primary-disabledText"
                  : "text-semantic-button-primary-text"
            }`}
      >
        {button.label}
      </Text>
    </Pressable>
  );
};

export default Button;
