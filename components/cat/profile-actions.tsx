import { ButtonType } from "@/components/common/button";
import ProfileActionButtons from "@/components/user/profile/profile-action-buttons";
import { ROUTES } from "@/constants/route";
import { shareCat } from "@/lib/share";
import { useRouter } from "expo-router";
import { View } from "react-native";

interface CatProfileActionsProps {
  catId: string;
}

const CatProfileActions = ({ catId }: CatProfileActionsProps) => {
  const router = useRouter();

  const buttons: ButtonType[] = [
    {
      label: "프로필 수정",
      onPress: () => router.push(ROUTES.CAT.UPDATE(catId)),
      variant: "primary",
      size: "md",
    },
    {
      label: "프로필 공유",
      onPress: () => shareCat(catId),
      variant: "secondary",
      size: "md",
    },
  ];

  return (
    <View className="mt-8">
      <ProfileActionButtons buttons={buttons} />
    </View>
  );
};

export default CatProfileActions;
