import AppsIcon from "@/assets/icons/apps.svg";
import BookmarkIcon from "@/assets/icons/bookmark.svg";
import HeartOutlineIcon from "@/assets/icons/heart-outline.svg";
import { useColors } from "@/hooks/use-colors";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";

const TAB_ICONS = [AppsIcon, HeartOutlineIcon, BookmarkIcon] as const;

interface TabIconBarProps {
  activeIndex: number;
  onChange: (i: number) => void;
}

const TabIconBar = ({ activeIndex, onChange }: TabIconBarProps) => {
  const { colors } = useColors();
  const { width } = useWindowDimensions();
  const tabWidth = width / TAB_ICONS.length;

  return (
    <View className="bg-semantic-bg-primary">
      <View style={{ height: 46, flexDirection: "row" }}>
        {TAB_ICONS.map((Icon, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onChange(index)}
            style={{ height: 46, flex: 1 }}
            className="items-center justify-center"
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
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: activeIndex * tabWidth,
            width: tabWidth,
            height: 1,
            backgroundColor: colors.border.accent,
          }}
        />
      </View>
      <View className="h-px bg-semantic-border-primary" />
    </View>
  );
};

export default TabIconBar;
