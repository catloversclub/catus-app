import CatProfileForm, {
  CatProfileFormData,
} from "@/components/cat/form/profile-form";
import { ROUTES } from "@/constants/route";
import { useCreateCat } from "@/hooks/cat/use-create-cat";
import { useUpdateCat } from "@/hooks/cat/use-update-cat";
import { useCatStore } from "@/store/cat/cat-store";
import { router } from "expo-router";

const Step4 = () => {
  const { imageUri } = useCatStore();

  const { submit: createCat, isPending: isCreating } = useCreateCat();
  const { submitProfileImage, isPending: isUploadingImage } = useUpdateCat();

  const isPending = isCreating || isUploadingImage;

  const handleOnSubmit = async (data: CatProfileFormData) => {
    const { id: catId } = await createCat(data);

    if (imageUri) {
      await submitProfileImage({ catId, imageUri });
    }

    router.push({
      pathname: ROUTES.AUTH.ONBOARDING.STEP5_CREATE,
      params: { catId },
    });
  };

  return (
    <CatProfileForm
      stepNumber={4}
      onSubmit={handleOnSubmit}
      onSkip={() => {
        router.push(ROUTES.AUTH.ONBOARDING.STEP7);
      }}
      isPending={isPending}
    />
  );
};

export default Step4;
