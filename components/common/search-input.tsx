import SearchIcon from "@/assets/icons/search.svg";
import IconButton from "@/components/common/icon-button";
import Input from "@/components/common/input";
import { useColors } from "@/hooks/use-colors";

interface SearchInputProps {
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  maxLength?: number;
}

const SearchInput = ({
  value,
  onValueChange,
  placeholder,
  onFocus,
  onBlur,
  onSubmitEditing,
  maxLength,
}: SearchInputProps) => {
  const { colors } = useColors();
  return (
    <Input
      value={value || ""}
      onChangeText={onValueChange}
      maxLength={maxLength}
      onFocus={onFocus}
      onBlur={onBlur}
      onSubmitEditing={onSubmitEditing}
      returnKeyType="search"
      placeholder={placeholder}
      suffix={
        <IconButton onPress={onSubmitEditing ?? onFocus}>
          <SearchIcon width={20} height={20} color={colors.icon.tertiary} />
        </IconButton>
      }
    />
  );
};

export default SearchInput;
