import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import {
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

interface TabPagerProps {
  tabs: string[];
  children: React.ReactNode[];
  className?: string;
  tabBarStyle?: StyleProp<ViewStyle>;
  onTabChange?: (index: number) => void;
}

const TabPager = ({
  tabs,
  children,
  className,
  tabBarStyle,
  onTabChange,
}: TabPagerProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    onTabChange?.(index);
  };

  const handleMomentumScrollEnd = (
    e: Parameters<NonNullable<ScrollView["props"]["onMomentumScrollEnd"]>>[0],
  ) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
      onTabChange?.(index);
    }
  };

  return (
    <View className={cn("flex-1", className)}>
      <Animated.View style={[{ overflow: "hidden" }, tabBarStyle]}>
        <View className="flex-row h-[46px]">
          {tabs.map((label, index) => (
            <TouchableOpacity
              key={label}
              onPress={() => handleTabPress(index)}
              className="flex-1 items-center justify-end pb-2"
            >
              <Text
                className={cn(
                  "typo-title3",
                  activeIndex === index
                    ? "text-semantic-text-success"
                    : "text-semantic-text-tertiary",
                )}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={{ flex: 1 }}
      >
        {children.map((child, index) => (
          <View key={index} style={{ width, flex: 1 }}>
            {child}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TabPager;
