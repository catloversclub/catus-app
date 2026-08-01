import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

function Skeleton({
  className,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  const opacity = useSharedValue(0.45);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);

    return () => cancelAnimation(opacity);
  }, [opacity]);

  return (
    <Animated.View
      {...props}
      className={cn("rounded-md bg-semantic-bg-secondary", className)}
      style={[props.style, animatedStyle]}
    />
  );
}

export { Skeleton };
