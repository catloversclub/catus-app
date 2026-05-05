import SearchInput from "@/components/common/search-input";
import { Breed, BREEDS } from "@/constants/cat";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const ITEM_HEIGHT = 46;
const MAX_VISIBLE_ITEMS = 4;

interface SelectBreedProps {
  breed: Breed | null;
  onChangeBreed: (value: Breed | null) => void;
  onBreedOpen?: () => void;
}

// SelectBreed.tsx
const SelectBreed = ({
  breed,
  onChangeBreed,
  onBreedOpen,
}: SelectBreedProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const filtered = [...BREEDS].sort().filter((b) => b.includes(query));

  const handleSelect = (value: Breed | null) => {
    onChangeBreed(value);
    setQuery(value || "");
    setIsFocused(false);
  };

  const handleOpen = () => {
    setIsFocused(true);
    onBreedOpen?.();
  };

  return (
    <View className="flex-col gap-1.5">
      <SearchInput
        value={query}
        placeholder="품종 선택"
        onValueChange={(text) => {
          setQuery(text);
          if (!isFocused) handleOpen();
        }}
        onFocus={handleOpen}
        onBlur={() => setIsFocused(false)} // 포커스 잃으면 닫힘
      />
      {isFocused && (
        <View
          className="bg-semantic-bg-secondary rounded overflow-hidden"
          style={{
            maxHeight: MAX_VISIBLE_ITEMS * ITEM_HEIGHT,
          }}
        >
          <ScrollView
            scrollEnabled={filtered.length > MAX_VISIBLE_ITEMS}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            {filtered.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => handleSelect(item)}
                style={{ height: ITEM_HEIGHT }}
                className="justify-center"
              >
                <Text className="text-semantic-text-primary typo-body4 px-3">
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default SelectBreed;
