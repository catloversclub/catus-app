import SearchIcon from "@/assets/icons/search.svg";
import Input from "@/components/common/input";
import { useColors } from "@/hooks/use-colors";
import { Pressable } from "react-native-gesture-handler";

// SearchInput.tsx
interface SearchInputProps {
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void; // 추가
}

const SearchInput = ({
  value,
  onValueChange,
  placeholder,
  onFocus,
  onBlur,
}: SearchInputProps) => {
  const { colors } = useColors();
  return (
    <Input
      value={value || ""}
      onChangeText={onValueChange}
      maxLength={16}
      onFocus={onFocus}
      onBlur={onBlur} // 추가
      placeholder={placeholder}
      suffix={
        <Pressable onPress={onFocus}>
          <SearchIcon width={20} height={20} color={colors.icon.tertiary} />
        </Pressable>
      }
    />
  );
};

export default SearchInput;
