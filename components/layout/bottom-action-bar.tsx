import Button, { ButtonType } from "@/components/common/button";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

interface BottomActionBarProps {
  buttons: Omit<ButtonType, "size">[];
}

const BottomActionBar = ({ buttons }: BottomActionBarProps) => {
  const { progress } = useReanimatedKeyboardAnimation();
  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: (1 - progress.value) * 64,
  }));
  return (
    <Animated.View
      className="flex-col w-full pt-3 border-t border-semantic-border-primary px-3 gap-2"
      style={animatedStyle}
    >
      {buttons.map((btn) => (
        <Button key={btn.label} button={{ ...btn, size: "lg" }} />
      ))}
    </Animated.View>
  );
};

export default BottomActionBar;
