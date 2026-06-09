import ActionPressable from "@/components/common/action-pressable";
import { Text, View } from "react-native";

interface CarouselCounterProps {
  current: number;
  total: number;
}

const CarouselCounter = ({ current, total }: CarouselCounterProps) => (
  <View
    className="absolute right-1.5 top-1.5 z-10 rounded bg-semantic-dimmed-primary px-2 py-1.5"
    pointerEvents="none"
  >
    <Text className="typo-label2 text-gray-0">
      {current + 1} / {total}
    </Text>
  </View>
);

interface CarouselDotsProps {
  count: number;
  current: number;
  onDotPress?: (index: number) => void;
}

const CarouselDots = ({ count, current, onDotPress }: CarouselDotsProps) => (
  <View className="w-full flex-row justify-center gap-1.5">
    {Array.from({ length: count }).map((_, index) => (
      <ActionPressable
        key={index}
        disabled={!onDotPress}
        hitSlop={8}
        className={`h-1.5 w-1.5 rounded-full ${
          index === current ? "bg-semantic-icon-accent" : "bg-semantic-icon-minor"
        }`}
        onPress={() => onDotPress?.(index)}
      />
    ))}
  </View>
);

export { CarouselCounter, CarouselDots };
