import Button, { ButtonType } from "@/components/common/button";
import Gradient from "@/components/common/gradient";
import { triggerSelectionHaptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import {
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomActionBarProps {
  buttons: Omit<ButtonType, "size">[];
  containerClassName?: string;
  gradientColorScheme?: "light" | "dark";
}

const BottomActionBar = ({
  buttons,
  containerClassName,
  gradientColorScheme,
}: BottomActionBarProps) => {
  const { bottom } = useSafeAreaInsets();
  const { progress } = useReanimatedKeyboardAnimation();
  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: (1 - progress.value) * bottom + 30,
  }));

  return (
    <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
      <Animated.View
        className={cn(
          "flex-col w-full px-3 gap-2 bg-semantic-bg-primary",
          containerClassName,
        )}
        style={animatedStyle}
      >
        <Gradient
          direction="vertical"
          height={20}
          colorScheme={gradientColorScheme}
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            transform: [{ rotate: "180deg" }],
          }}
        />
        {buttons.map((btn) => (
          <Button
            key={btn.label}
            button={{
              ...btn,
              size: "lg",
              onPress: () => {
                triggerSelectionHaptic();
                btn.onPress();
              },
            }}
          />
        ))}
      </Animated.View>
    </KeyboardStickyView>
  );
};

export default BottomActionBar;
