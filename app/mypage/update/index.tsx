import { useUserProfileQuery } from "@/api/domains/user/queries";
import UserEditForm, {
  UserEditFormData,
} from "@/components/user/form/edit-form";
import { useUpdateUser } from "@/hooks/user/use-update-user";
import { router } from "expo-router";

const UpdateProfile = () => {
  const { data: userData } = useUserProfileQuery();
  const { updateUser, submitProfileImage, isPending } = useUpdateUser();

  const handleOnSubmit = async (data: UserEditFormData) => {
    await updateUser({
      nickname: data.nickname,
      isLivingWithCat: data.isLivingWithCat,
    });

    if (
      data.profileImageUrl &&
      data.profileImageUrl !== userData.profileImageUrl
    ) {
      await submitProfileImage(data.profileImageUrl);
    }

    router.back();
  };

  return (
    <UserEditForm
      initialData={userData}
      onSubmit={handleOnSubmit}
      isPending={isPending}
    />
  );
};

export default UpdateProfile;
