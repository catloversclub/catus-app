import { dark, light } from "@/styles/semantic-colors";
import { useColorScheme } from "react-native";

export const useColors = () => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  return { scheme, colors };
};
