import Button from "@/components/common/button";
import { cn } from "@/lib/utils";
import { Text, View } from "react-native";

interface EmptyActionStateProps {
  title: string;
  description: string;
  onButtonPress: () => void;
  buttonLabel: string;
  className?: string;
}

const EmptyActionState = ({
  title,
  description,
  onButtonPress,
  buttonLabel,
  className,
}: EmptyActionStateProps) => (
  <View
    className={cn(
      "flex-1 items-center justify-center bg-semantic-bg-primary py-20",
      className,
    )}
  >
    <View className="w-full items-center gap-6">
      <View className="w-full items-center">
        <Text className="typo-body2 text-center text-semantic-text-primary">
          {title}
        </Text>
        <Text className="typo-body4 text-center text-semantic-text-tertiary">
          {description}
        </Text>
      </View>
      <Button
        button={{ label: buttonLabel, onPress: onButtonPress, size: "md" }}
        className="px-6"
        textClassName="typo-body1"
      />
    </View>
  </View>
);

export default EmptyActionState;
