import AppsIcon from "@/assets/icons/apps.svg";
import BookmarkIcon from "@/assets/icons/bookmark.svg";
import HeartIcon from "@/assets/icons/heart-outline.svg";
import { ViewType } from "@/constants/tab";
import { dark, light } from "@/styles/semantic-colors";
import { TouchableOpacity, useColorScheme, View } from "react-native";

const TABS: { Icon: React.ElementType; value: ViewType }[] = [
  { Icon: AppsIcon, value: "all" },
  { Icon: HeartIcon, value: "liked" },
  { Icon: BookmarkIcon, value: "bookmarked" },
];

interface TabButtonProps {
  Icon: React.ElementType;
  value: ViewType;
  isActive: boolean;
  onPress: (value: ViewType) => void;
}

const TabButton = ({ Icon, value, isActive, onPress }: TabButtonProps) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  return (
    <TouchableOpacity
      className={`flex-1 items-center py-3 ${isActive ? "border-0 border-b-[1px] border-semantic-border-accent" : ""}`}
      onPress={() => onPress(value)}
    >
      <Icon
        height={24}
        width={24}
        color={isActive ? colors.icon.primary : colors.icon.tertiary}
      />
    </TouchableOpacity>
  );
};

interface IconHeaderProps {
  activeTab: ViewType;
  onTabChange: (tab: ViewType) => void;
}

const IconHeader = ({ activeTab, onTabChange }: IconHeaderProps) => {
  return (
    <View className="flex-row w-full">
      {TABS.map((tab) => (
        <TabButton
          key={tab.value}
          Icon={tab.Icon}
          value={tab.value}
          isActive={activeTab === tab.value}
          onPress={onTabChange}
        />
      ))}
    </View>
  );
};

export default IconHeader;
