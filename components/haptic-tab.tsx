import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { triggerSelectionHaptic } from "@/lib/haptics";

export function HapticTab(props: BottomTabBarButtonProps) {
  const isSelected = props.accessibilityState?.selected;

  return (
    <PlatformPressable
      {...props}
      onPress={(ev) => {
        if (!isSelected) {
          triggerSelectionHaptic();
        }
        props.onPress?.(ev);
      }}
    />
  );
}
