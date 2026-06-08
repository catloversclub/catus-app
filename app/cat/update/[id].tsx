import { useCatByIdQuery } from "@/api/domains/cat/queries";
import CatEditForm from "@/components/cat/form/edit-form";
import { CatProfile } from "@/api/domains/cat/types";
import { useUpdateCat } from "@/hooks/cat/use-update-cat";
import { useCatStore } from "@/store/cat/cat-store";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

const CatUpdatePage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: cat } = useCatByIdQuery(id);
  const { imageUri, setImageUri } = useCatStore();

  const { updateCat, submitProfileImage, isPending } = useUpdateCat();

  const handleOnSubmit = async (data: CatProfile) => {
    await updateCat({ catId: id, payload: data });

    if (imageUri && imageUri !== cat.profileImageUrl) {
      await submitProfileImage({ catId: id, imageUri });
    }

    router.back();
  };

  useEffect(() => {
    setImageUri(cat.profileImageUrl);
  }, [cat.profileImageUrl, setImageUri]);

  return (
    <CatEditForm
      initialData={cat}
      onSubmit={handleOnSubmit}
      isPending={isPending}
    />
  );
};

export default CatUpdatePage;
