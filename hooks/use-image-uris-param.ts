import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

const useImageUrisParam = (): string[] => {
  const { imageUris } = useLocalSearchParams<{ imageUris: string }>();
  return useMemo(() => {
    if (!imageUris) return [];
    try {
      return JSON.parse(imageUris) as string[];
    } catch {
      return [];
    }
  }, [imageUris]);
};

export { useImageUrisParam };
