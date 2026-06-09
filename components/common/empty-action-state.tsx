import Button from "@/components/common/button";
import { cn } from "@/lib/utils";
import { Text, View } from "react-native";

interface EmptyActionStateProps {
  title: string;
  description: string;
  onButtonPress: () => void;
  buttonLabel?: string;
  className?: string;
}

const EmptyActionState = ({
  title,
  description,
  onButtonPress,
  buttonLabel = "사진 업로드하기",
  className,
}: EmptyActionStateProps) => (
  <View
    className={cn(
      "flex-1 items-center justify-center bg-semantic-bg-primary px-3 py-20",
      className,
    )}
  >
    <View className="w-full items-center gap-10">
      <View className="w-full items-center gap-1.5">
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
