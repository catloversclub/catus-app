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
}

const CarouselDots = ({ count, current }: CarouselDotsProps) => (
  <View className="w-full flex-row justify-center gap-1.5">
    {Array.from({ length: count }).map((_, index) => (
      <View
        key={index}
        className={`h-1.5 w-1.5 rounded-full ${
          index === current ? "bg-semantic-icon-accent" : "bg-semantic-icon-minor"
        }`}
      />
    ))}
  </View>
);

export { CarouselCounter, CarouselDots };
