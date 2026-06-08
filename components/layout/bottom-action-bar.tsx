import Button, { ButtonType } from "@/components/common/button";
import {
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomActionBarProps {
  buttons: Omit<ButtonType, "size">[];
}

const BottomActionBar = ({ buttons }: BottomActionBarProps) => {
  const { bottom } = useSafeAreaInsets();
  const { progress } = useReanimatedKeyboardAnimation();
  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: (1 - progress.value) * bottom,
  }));

  return (
    <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
      <Animated.View
        className="flex-col w-full pt-3 border-t border-semantic-border-primary px-3 gap-2"
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
