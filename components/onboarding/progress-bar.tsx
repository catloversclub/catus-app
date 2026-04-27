import { dark, light } from "@/styles/semantic-colors";
import { useColorScheme, View } from "react-native";

const ProgressBar = ({ progress }: { progress: number }) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;

  const TOTAL_STEPS = 7;
  return (
    <View className="w-full flex-row gap-1.5">
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
  );
};

export default ProgressBar;
