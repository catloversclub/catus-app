import { useColors } from "@/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { DimensionValue, useWindowDimensions, ViewStyle } from "react-native";

interface GradientProps {
  direction?: "horizontal" | "vertical";
  height?: DimensionValue;
  colorScheme?: "light" | "dark";
  style?: ViewStyle;
}

// cos(πt/2) — sine-ease-in: slow start, accelerates toward transparent
const EASED_OPACITIES = [1, 0.966, 0.866, 0.707, 0.5, 0.259, 0];

const Gradient = ({
  direction = "horizontal",
  height = "100%",
  colorScheme,
  style,
}: GradientProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const { scheme } = useColors();
  const resolvedScheme = colorScheme ?? scheme;
  const rgb = resolvedScheme === "dark" ? "24, 24, 27" : "255, 255, 255";
  const gradientColors = EASED_OPACITIES.map((a) => `rgba(${rgb}, ${a})`) as [
    string,
    string,
    ...string[],
  ];

  const isHorizontal = direction === "horizontal";

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={isHorizontal ? { x: 1, y: 0 } : { x: 0, y: 1 }}
      style={[{ width: screenWidth, height }, style]}
      pointerEvents="none"
    />
  );
};

export default Gradient;
