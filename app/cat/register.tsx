import { CatProfile } from "@/api/domains/cat/types";
import CatEditForm from "@/components/cat/form/edit-form";
import { useCreateCat } from "@/hooks/cat/use-create-cat";
import { useUpdateCat } from "@/hooks/cat/use-update-cat";
import { useCatStore } from "@/store/cat/cat-store";
import { router } from "expo-router";
import { useEffect } from "react";

const CatRegisterPage = () => {
  const { imageUri, resetImageUri } = useCatStore();

  const { submit: createCat, isPending: isCreating } = useCreateCat();
  const { submitProfileImage, isPending: isUploadingImage } = useUpdateCat();

  const isPending = isCreating || isUploadingImage;

  const handleOnSubmit = async (data: CatProfile) => {
    if (!data.name) return;

    const { id: catId } = await createCat(data);

    if (imageUri) {
      await submitProfileImage({ catId, imageUri });
    }

    router.back();
  };

  useEffect(() => {
    resetImageUri();

    return resetImageUri;
  }, [resetImageUri]);

  return <CatEditForm onSubmit={handleOnSubmit} isPending={isPending} />;
};

export default CatRegisterPage;
