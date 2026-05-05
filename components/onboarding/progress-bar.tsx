import Gradient from "@/components/common/gradient";
import { useColors } from "@/hooks/use-colors";
import { View } from "react-native";
const TOTAL_STEPS = 7;

const ProgressBar = ({ progress }: { progress: number }) => {
  const { colors } = useColors();

  return (
    <View className="relative">
      <View className="px-5 flex-row gap-1.5">
        {[...Array(TOTAL_STEPS)].map((_, index) => (
          <View
            key={index}
            className="h-2 rounded-sm flex-1"
            style={{
              backgroundColor:
                index < progress ? colors.icon.accent : colors.bg.secondary,
            }}
          />
        ))}
      </View>
      <Gradient
        direction="vertical"
        width="100%"
        height={20}
        style={{ position: "absolute", bottom: -20, left: 0, zIndex: 10 }}
      />
    </View>
  );
};
export default ProgressBar;
