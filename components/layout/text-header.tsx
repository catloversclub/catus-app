import { FeedType } from "@/constants/tab";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

const TABS: { label: string; value: FeedType }[] = [
  { label: "팔로잉", value: "following" },
  { label: "추천", value: "recommended" },
];

interface TabButtonProps {
  label: string;
  value: FeedType;
  isActive: boolean;
  onPress: (value: FeedType) => void;
}

function TabButton({ label, value, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      className={"flex-1 rounded-lg py-3"}
      onPress={() => onPress(value)}
    >
      <Text
        className={`typo-title3 text-center ${isActive ? "text-semantic-text-success" : "text-gray-600"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface HeaderProps {
  activeTab: FeedType;
  onTabChange: (tab: FeedType) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <View className="px-3 pb-3 pt-1">
      {/* 로고 */}
      <LogoText />

      {/* 탭 */}
      <View className="mt-2 flex-row gap-2">
        {TABS.map((tab) => (
          <TabButton
            key={tab.value}
            label={tab.label}
            value={tab.value}
            isActive={activeTab === tab.value}
            onPress={onTabChange}
          />
        ))}
      </View>
    </View>
  );
}

function LogoText() {
  let colorScheme = useColorScheme();
  return (
    <Image
      style={{ width: 82, height: 26 }}
      source={
        colorScheme === "dark"
          ? require("@/assets/images/logo/row-dark.png")
          : require("@/assets/images/logo/row-light.png")
      }
      contentFit="cover"
    />
  );
}
