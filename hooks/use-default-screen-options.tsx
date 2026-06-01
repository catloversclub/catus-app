import RouteBack from "@/components/layout/route-back";
import { useColors } from "@/hooks/use-colors";

const useDefaultStackScreenOptions = () => {
  const { colors } = useColors();
  return {
    headerShown: true,
    title: "",
    headerShadowVisible: false,
    headerTintColor: colors.text.primary,
    headerStyle: {
      backgroundColor: colors.bg.primary,
    },
    headerLeft: () => <RouteBack />,
  };
};

export { useDefaultStackScreenOptions };
