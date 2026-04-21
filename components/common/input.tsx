import XLogo from "@/assets/icons/x-circle.svg";
import { dark, light } from "@/styles/semantic-colors";
import { Pressable, TextInput, useColorScheme, View } from "react-native";

// components/common/text-input.tsx
interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  placeholder?: string;
}

const Input = ({
  value,
  onChangeText,
  maxLength = 50,
  placeholder,
}: InputProps) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;

  return (
    <View className="bg-semantic-bg-secondary rounded px-3 py-[13px] flex-row items-center">
      <TextInput
        editable
        numberOfLines={1}
        maxLength={maxLength}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        className="flex-1 text-semantic-text-primary typo-body3"
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
