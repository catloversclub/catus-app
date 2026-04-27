import XLogo from "@/assets/icons/x-circle.svg";
import { cn } from "@/lib/utils";
import { dark, light } from "@/styles/semantic-colors";
import { Pressable, TextInput, useColorScheme, View } from "react-native";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  placeholder?: string;
  isError?: boolean;
}

const Input = ({
  value,
  onChangeText,
  maxLength = 50,
  placeholder,
  isError = false,
}: InputProps) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;

  return (
    <View
      className={cn(
        "bg-semantic-bg-secondary rounded px-3 py-[13px] flex-row items-center",
        isError && "border border-semantic-border-error",
      )}
    >
      <TextInput
        editable
        numberOfLines={1}
        maxLength={maxLength}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        placeholderClassName="flex-1 text-semantic-text-tertiary typo-body4 h-5"
        className="flex-1 text-semantic-text-primary typo-body h-5"
        style={{ lineHeight: undefined }}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} className="ml-3">
          <XLogo width={20} height={20} color={colors.icon.tertiary} />
        </Pressable>
      )}
    </View>
  );
};

export default Input;
