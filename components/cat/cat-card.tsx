import { Cat } from "@/api/domains/cat/types";
import UpdateIcon from "@/assets/icons/update.svg";
import GenderIcon from "@/components/cat/gender";
import ActionPressable from "@/components/common/action-pressable";
import IconButton from "@/components/common/icon-button";
import CatProfileImage from "@/components/cat/profile-image";
import { ROUTES } from "@/constants/route";
import { useColors } from "@/hooks/use-colors";
import { formatDate } from "@/lib/utils";
import { router } from "expo-router";
import { Text, View } from "react-native";

interface CatCardProps {
  cat: Cat;
  routeToDetail?: boolean;
}

const CatCard = ({ cat, routeToDetail = true }: CatCardProps) => {
  const { colors } = useColors();
  const details = [
    ...(cat.birthDate ? [formatDate(cat.birthDate)] : []),
    cat.breed,
  ]
    .filter(Boolean)
    .join(" · ");

  const handleRouteToUpdate = () => {
    router.push(ROUTES.CAT.UPDATE(cat.id));
  };

  const handleRouteToDetail = () => {
    if (!routeToDetail) return;
    router.push({
      pathname: `/cat/[id]`,
      params: { id: cat.id },
    });
  };

  return (
    <ActionPressable onPress={handleRouteToDetail}>
      <View className="p-6 bg-semantic-bg-secondary rounded-md">
        <IconButton
          onPress={handleRouteToUpdate}
          className="flex-row justify-end w-full"
        >
          <UpdateIcon height={20} width={20} color={colors.icon.primary} />
        </IconButton>

        <View className="flex-col items-center">
          <CatProfileImage imageUrl={cat.profileImageUrl} size="md" />
          <View className="h-3" />
          <Text className="typo-body3 text-semantic-text-primary">
            {cat.name}
          </Text>
          <View className="h-1.5" />
          <View className="flex-row items-center gap-1.5">
            {details.length > 0 && (
              <Text className="typo-body4 text-semantic-text-tertiary">
                {details}
              </Text>
            )}
            {details.length > 0 && cat.gender !== "UNKNOWN" && (
              <Text className="typo-body4 text-semantic-text-tertiary">
                ·
              </Text>
            )}
            {cat.gender !== "UNKNOWN" && <GenderIcon gender={cat.gender} />}
          </View>
        </View>
      </View>
    </ActionPressable>
  );
};

export default CatCard;
