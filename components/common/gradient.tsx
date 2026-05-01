import { useColors } from "@/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { DimensionValue, ViewStyle } from "react-native";

interface GradientProps {
  direction?: "horizontal" | "vertical";
  width?: DimensionValue;
  height?: DimensionValue;
  style?: ViewStyle;
}

const Gradient = ({
  direction = "horizontal",
  width = 60,
  height = "100%",
  style,
}: GradientProps) => {
  const { colors, scheme } = useColors();
  const bgTransparent =
    scheme === "dark" ? "rgba(24, 24, 27, 0)" : "rgba(255, 255, 255, 0)";

  const isHorizontal = direction === "horizontal";

  return (
    <LinearGradient
      colors={[colors.bg.primary, bgTransparent]}
      start={isHorizontal ? { x: 0, y: 0 } : { x: 0, y: 0 }}
      end={isHorizontal ? { x: 1, y: 0 } : { x: 0, y: 1 }}
      style={[
        {
          width,
          height,
        },
        style,
      ]}
      pointerEvents="none"
    />
  );
};

export default Gradient;
