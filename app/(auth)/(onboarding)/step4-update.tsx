import { useCatByIdQuery } from "@/api/domains/cat/queries";
import CatProfileForm, {
  CatProfileFormData,
} from "@/components/cat/form/profile-form";
import { ROUTES } from "@/constants/route";
import { useUpdateCat } from "@/hooks/cat/use-update-cat";
import { useCatStore } from "@/store/cat/cat-store";
import { router, useLocalSearchParams } from "expo-router";

const Step4 = () => {
  const { catId } = useLocalSearchParams<{ catId: string }>();
  const { data: cat } = useCatByIdQuery(catId);
  const { imageUri } = useCatStore();

  const { updateCat, submitProfileImage, isPending } = useUpdateCat();

  const handleOnSubmit = async (data: CatProfileFormData) => {
    await updateCat({
      catId,
      payload: data,
    });

    if (imageUri) {
      await submitProfileImage({ catId, imageUri });
    }

    router.push({
      pathname: ROUTES.AUTH.ONBOARDING.STEP5_UPDATE,
      params: { catId },
    });
  };

  return (
    <CatProfileForm
      stepNumber={4}
      initialData={cat}
      onSubmit={handleOnSubmit}
      onSkip={() => {
        router.push(ROUTES.AUTH.ONBOARDING.STEP7);
      }}
      isPending={isPending}
    />
  );
};

export default Step4;
