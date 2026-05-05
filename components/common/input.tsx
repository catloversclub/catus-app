import XLogo from "@/assets/icons/x-circle.svg";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { Pressable, TextInput, View } from "react-native";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  placeholder?: string;
  isError?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  suffix?: React.ReactNode;
}

const Input = ({
  value,
  onChangeText,
  maxLength = 50,
  placeholder,
  isError = false,
  onFocus,
  suffix,
  onBlur,
}: InputProps) => {
  const { colors } = useColors();

  return (
    <View
      style={{ backgroundColor: colors.bg.secondary }} // className 대신 style로
      className={cn(
        "rounded px-3 py-[13px] flex-row items-center ",
        isError && "border border-semantic-border-error",
      )}
    >
      <TextInput
        editable
        numberOfLines={1}
        maxLength={maxLength}
        onChangeText={onChangeText}
        value={value}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        style={{
          flex: 1,
          color: colors.text.primary,
          fontSize: 14,
          lineHeight: undefined,
        }}
        onBlur={onBlur}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} className="ml-3">
          <XLogo width={20} height={20} color={colors.icon.tertiary} />
        </Pressable>
      )}
      {suffix && <View className="ml-3">{suffix}</View>}
    </View>
  );
};

export default Input;
