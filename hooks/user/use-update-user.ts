// hooks/use-update-user.ts
import {
  useGetProfileImageUploadUrlMutation,
  useUpdateUserMutation,
  useUploadProfileImageMutation,
} from "@/api/domains/user/queries";
import { STORAGE_BASE_URL } from "@/constants/api";

export const useUpdateUser = () => {
  const {
    mutateAsync: getProfileImageUploadUrl,
    isPending: isGettingUploadUrl,
  } = useGetProfileImageUploadUrlMutation();

  const { mutateAsync: uploadProfileImage, isPending: isUploadingImage } =
    useUploadProfileImageMutation();

  const { mutateAsync: updateUser, isPending: isUpdating } =
    useUpdateUserMutation();

  const isPending = isUpdating || isGettingUploadUrl || isUploadingImage;

  const submitProfileImage = async (imageUri: string): Promise<string> => {
    const { fields } = await getProfileImageUploadUrl(undefined);
    await uploadProfileImage({ fields, fileUri: imageUri });
    await updateUser({ profileImageUrl: `${STORAGE_BASE_URL}/${fields.key}` });
    return fields.key;
  };
  return {
    getProfileImageUploadUrl,
    uploadProfileImage,
    updateUser,
    submitProfileImage,
    isPending,
  };
};
