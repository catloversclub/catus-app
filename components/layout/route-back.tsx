import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import IconButton from "@/components/common/icon-button";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import React from "react";

const ICON_SIZE = 24;

const RouteBack = () => {
  const { colors } = useColors();
  return (
    <IconButton onPress={() => router.back()} className="p-2">
      <ArrowLeftIcon
        width={ICON_SIZE}
        height={ICON_SIZE}
        color={colors.icon.primary}
      />
    </IconButton>
  );
};

export default RouteBack;
