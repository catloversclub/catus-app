import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import PagerView from "react-native-pager-view";

interface TabPagerProps {
  tabs: string[];
  children: React.ReactNode[];
  className?: string;
  tabBarStyle?: StyleProp<ViewStyle>;
}

const TabPager = ({ tabs, children, className, tabBarStyle }: TabPagerProps) => {
  const pagerRef = useRef<PagerView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    pagerRef.current?.setPage(index);
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
        <View className="h-px bg-semantic-border-primary" />
      </Animated.View>

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
      >
        {children.map((child, index) => (
          <View key={index} style={{ flex: 1 }}>
            {child}
          </View>
        ))}
      </PagerView>
    </View>
  );
};

export default TabPager;
