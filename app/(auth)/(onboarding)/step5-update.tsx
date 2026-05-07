import { useCatByIdQuery } from "@/api/domains/cat/queries";
import CatTagForm, { CatTagFormData } from "@/components/cat/form/tag-form";
import { ROUTES } from "@/constants/route";
import { useUpdateCat } from "@/hooks/cat/use-update-cat";
import { router, useLocalSearchParams } from "expo-router";

const Step5 = () => {
  const { catId } = useLocalSearchParams<{ catId: string }>();
  const { data: cat } = useCatByIdQuery(catId);

  const { updateCat, isPending } = useUpdateCat();

  const handleComplete = () => {
    router.push({
      pathname: ROUTES.AUTH.ONBOARDING.STEP6,
      params: { catId },
    });
  };

  const handlePressNext = async (data: CatTagFormData) => {
    await updateCat({
      catId,
      payload: {
        personalities: data.personalities,
        appearances: data.appearances,
      },
    });
    handleComplete();
  };

  return (
    <CatTagForm
      stepNumber={5}
      name={cat.name}
      initialData={cat}
      onSubmit={handlePressNext}
      onSkip={handleComplete}
      isPending={isPending}
    />
  );
};

export default Step5;
