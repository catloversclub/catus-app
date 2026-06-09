import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { ActivityIndicator, Pressable, Text } from "react-native";

const CONTAINER_VARIANT = {
  primary: "bg-semantic-button-primary-bg",
  secondary: "bg-transparent border border-semantic-border-primary",
  ghost: "bg-transparent",
} as const;

const CONTAINER_SIZE = {
  md: "py-2",
  lg: "py-3",
} as const;

const TEXT_VARIANT = {
  primary: "text-semantic-button-primary-text",
  secondary: "text-semantic-text-primary",
  ghost: "text-semantic-button-ghost-text",
} as const;

const TEXT_SIZE = {
  md: "typo-body3",
  lg: "typo-body1",
} as const;

export type ButtonType = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size: "md" | "lg";
  isPending?: boolean;
};
interface ButtonProps {
  button: ButtonType;
  className?: string;
  textClassName?: string;
}

const Button = ({ button, className, textClassName }: ButtonProps) => {
  const { colors } = useColors();
  const variant = button.variant ?? "primary";
  const isDisabled = button.disabled || button.isPending;

  return (
    <Pressable
      onPress={button.onPress}
      disabled={isDisabled}
      className={cn(
        "rounded items-center justify-center",
        CONTAINER_SIZE[button.size],
        isDisabled
          ? "bg-semantic-button-primary-disabledBg"
          : CONTAINER_VARIANT[variant],
        className,
      )}
    >
      {button.isPending ? (
        <ActivityIndicator size="small" color={colors.button.primary.text} />
      ) : (
        <Text
          className={cn(
            TEXT_SIZE[button.size],
            isDisabled
              ? "text-semantic-button-primary-disabledText"
              : TEXT_VARIANT[variant],
            textClassName,
          )}
        >
          {button.label}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;
