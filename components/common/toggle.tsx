import { useColors } from "@/hooks/use-colors";
import { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const Toggle = ({ value, onValueChange }: ToggleProps) => {
  const { colors } = useColors();

  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [anim, value]);

  const toggle = () => {
    onValueChange(!value);
  };

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 17],
  });

  return (
    <Pressable
      onPress={toggle}
      style={{
        width: 33,
        height: 18,
        borderRadius: 18,
        backgroundColor: value
          ? colors.button.primary.bg
          : colors.button.primary.disabledBg,
      }}
    >
      <Animated.View
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: "white",
          position: "absolute",
          top: 2,
          transform: [{ translateX }],
        }}
      />
    </Pressable>
  );
};

export default Toggle;
