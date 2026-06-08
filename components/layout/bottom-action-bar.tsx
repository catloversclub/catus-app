import Button, { ButtonType } from "@/components/common/button";
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
}

const BottomActionBar = ({
  buttons,
  containerClassName,
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
          "flex-col w-full pt-3 px-3 gap-2 bg-semantic-bg-primary",
          containerClassName,
        )}
        style={animatedStyle}
      >
        {buttons.map((btn) => (
          <Button key={btn.label} button={{ ...btn, size: "lg" }} />
        ))}
      </Animated.View>
    </KeyboardStickyView>
  );
};

export default BottomActionBar;
