import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";

const ITEM_HEIGHT = 38;

interface WheelPickerProps {
  items: number[];
  selected: number;
  onChange: (v: number) => void;
  suffix: string;
}

const WheelPicker = ({
  items,
  selected,
  onChange,
  suffix,
}: WheelPickerProps) => {
  const flatListRef = useRef<FlatList>(null);
  const selectedRef = useRef(selected); // re-render 없이 현재값 추적

  useEffect(() => {
    const index = items.indexOf(selectedRef.current);
    flatListRef.current?.scrollToIndex({ index, animated: false });
  }, [items]);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
      const value = items[index];

      if (value === undefined || value === selectedRef.current) return;

      selectedRef.current = value;
      onChange(value);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [items, onChange],
  );

  return (
    <FlatList
      ref={flatListRef}
      data={items}
      keyExtractor={(item) => String(item)}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={handleScrollEnd}
      onScrollEndDrag={handleScrollEnd}
      style={{ height: ITEM_HEIGHT * 5, flex: 1 }}
      contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      renderItem={({ item }) => (
        <View
          style={{ height: ITEM_HEIGHT }}
          className="items-center justify-center"
        >
          <Text
            className={cn(
              item === selected
                ? "typo-body1 text-semantic-text-primary"
                : "typo-body4 text-semantic-text-tertiary",
            )}
          >
            {String(item).padStart(2, "0")}
            {suffix}
          </Text>
        </View>
      )}
    />
  );
};

export default WheelPicker;
