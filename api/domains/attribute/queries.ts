import { useSuspenseQuery } from "@tanstack/react-query";

import { getAppearance, getPersonality } from "./api";

export const attributeKeys = {
  all: ["attribute"] as const,
  appearance: () => [...attributeKeys.all, "appearance"] as const,
  personality: () => [...attributeKeys.all, "personality"] as const,
};

export const useAppearanceQuery = () => {
  return useSuspenseQuery({
    queryKey: attributeKeys.appearance(),
    queryFn: getAppearance,
  });
};

export const usePersonalityQuery = () => {
  return useSuspenseQuery({
    queryKey: attributeKeys.personality(),
    queryFn: getPersonality,
  });
};
