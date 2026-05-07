import UserTagForm, { UserTagFormData } from "@/components/user/form/tag-form";
import { ROUTES } from "@/constants/route";
import { useUpdateUser } from "@/hooks/user/use-update-user";
import { router } from "expo-router";

const Step7 = () => {
  const { updateUser, isPending } = useUpdateUser();

  const handleComplete = () => {
    router.push({
      pathname: ROUTES.AUTH.ONBOARDING.STEP8,
    });
  };

  const handlePressNext = async (data: UserTagFormData) => {
    await updateUser({
      favoritePersonalities: data.favoritePersonalities,
      favoriteAppearances: data.favoriteAppearances,
    });
    handleComplete();
  };

  return (
    <UserTagForm
      stepNumber={7}
      onSubmit={handlePressNext}
      onSkip={handleComplete}
      isPending={isPending}
    />
  );
};

export default Step7;
