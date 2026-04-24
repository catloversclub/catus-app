import { dark, light } from "@/styles/semantic-colors";
import { useRef } from "react";
import { Animated, Pressable, useColorScheme } from "react-native";

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const Toggle = ({ value, onValueChange }: ToggleProps) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;

  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const toggle = () => {
    Animated.spring(anim, {
      toValue: value ? 0 : 1,
      useNativeDriver: false,
    }).start();
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
