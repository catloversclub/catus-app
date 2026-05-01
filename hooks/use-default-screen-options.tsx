import RouteBack from "@/components/layout/route-back";
import { useColors } from "@/hooks/use-colors";

export const useDefaultStackScreenOptions = () => {
  const { colors } = useColors();
  return {
    headerShown: true,
    title: "",
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: colors.bg.primary,
    },
    headerLeft: () => <RouteBack />,
  };
};
