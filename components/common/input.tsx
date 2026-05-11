import XLogo from "@/assets/icons/x-circle.svg";
import IconButton from "@/components/common/icon-button";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { useRef } from "react";
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
  const inputRef = useRef<TextInput>(null);

  // 컨테이너 어디를 탭해도 TextInput에 focus가 가도록
  const handlePressContainer = () => {
    inputRef.current?.focus();
  };

  return (
    <Pressable
      onPress={handlePressContainer}
      style={{ backgroundColor: colors.bg.secondary }}
      className={cn(
        "rounded px-3 py-[13px] flex-row items-center",
        isError && "border border-semantic-border-error",
      )}
    >
      <TextInput
        ref={inputRef}
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
        <IconButton onPress={() => onChangeText("")} className="ml-3">
          <XLogo width={20} height={20} color={colors.icon.tertiary} />
        </IconButton>
      )}
      {suffix && <View className="ml-3">{suffix}</View>}
    </Pressable>
  );
};

export default Input;
