import {
  useGetCatImageUploadUrlMutation,
  useUpdateCatMutation,
  useUploadCatImageMutation,
} from "@/api/domains/cat/queries";
import { STORAGE_BASE_URL } from "@/constants/api";

export const useUpdateCat = () => {
  const { mutateAsync: getCatImageUploadUrl, isPending: isGettingUploadUrl } =
    useGetCatImageUploadUrlMutation();

  const { mutateAsync: uploadCatImage, isPending: isUploadingImage } =
    useUploadCatImageMutation();

  const { mutateAsync: updateCat, isPending: isUpdating } =
    useUpdateCatMutation();

  const isPending = isUpdating || isGettingUploadUrl || isUploadingImage;

  const submitProfileImage = async ({
    catId,
    imageUri,
  }: {
    catId: string;
    imageUri: string;
  }): Promise<string> => {
    const { fields } = await getCatImageUploadUrl({ catId });
    await uploadCatImage({ fields, fileUri: imageUri });
    await updateCat({
      catId,
      payload: { profileImageUrl: `${STORAGE_BASE_URL}/${fields.key}` },
    });
    return fields.key;
  };

  return {
    getCatImageUploadUrl,
    uploadCatImage,
    updateCat,
    submitProfileImage,
    isPending,
  };
};
