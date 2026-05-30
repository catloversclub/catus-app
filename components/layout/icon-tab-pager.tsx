import AppsIcon from "@/assets/icons/apps.svg";
import BookmarkIcon from "@/assets/icons/bookmark.svg";
import HeartIcon from "@/assets/icons/heart-outline.svg";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import {
  Animated,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";

const ICONS = [AppsIcon, HeartIcon, BookmarkIcon];

interface IconTabPagerProps {
  children: React.ReactNode[];
  className?: string;
}

const IconTabPager = ({ children, className }: IconTabPagerProps) => {
  const { colors } = useColors();
  const { width } = useWindowDimensions();
  const pagerRef = useRef<PagerView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollPosition = useRef(new Animated.Value(0)).current;
  const tabWidth = width / ICONS.length;

  const indicatorTranslateX = scrollPosition.interpolate({
    inputRange: ICONS.map((_, i) => i),
    outputRange: ICONS.map((_, i) => i * tabWidth),
  });

  return (
    <View className={cn("flex-1", className)}>
      {/* Tab bar */}
      <View style={{ height: 46 }} className="flex-row">
        {ICONS.map((Icon, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => pagerRef.current?.setPage(index)}
            style={{ height: 46 }}
            className="flex-1 items-center justify-center"
          >
            <Icon
              width={24}
              height={24}
              color={
                activeIndex === index
                  ? colors.icon.primary
                  : colors.icon.tertiary
              }
            />
          </TouchableOpacity>
        ))}

        {/* Animated sliding indicator */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            width: tabWidth,
            height: 1,
            backgroundColor: colors.border.accent,
            transform: [{ translateX: indicatorTranslateX }],
          }}
        />
      </View>

      {/* Divider */}
      <View className="h-px bg-semantic-border-primary" />

      {/* Pager */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
        onPageScroll={(e) => {
          const { position, offset } = e.nativeEvent;
          scrollPosition.setValue(position + offset);
        }}
      >
        {children.map((child, index) => (
          <View key={index} style={{ flex: 1 }}>
            {child}
          </View>
        ))}
      </PagerView>
    </View>
  );
}

export default IconTabPager;
