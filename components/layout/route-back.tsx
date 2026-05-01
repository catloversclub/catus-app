import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const ICON_SIZE = 24;

const RouteBack = () => {
  const { colors } = useColors();
  return (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <ArrowLeftIcon
        width={ICON_SIZE}
        height={ICON_SIZE}
        color={colors.icon.primary}
      />
    </TouchableOpacity>
  );
};

export default RouteBack;
