import AvatarUserDark from "@/assets/images/avatar/user-dark.png";
import AvatarUserLight from "@/assets/images/avatar/user-light.png";
import ProfileImage, {
  type ProfileImageSize,
} from "@/components/common/profile-image";
import { useColors } from "@/hooks/use-colors";
import { Image } from "react-native";

interface UserProfileImageProps {
  imageUrl: string | null;
  size: ProfileImageSize;
  userId?: string;
  isEditMode?: boolean;
  isPreviewDisabled?: boolean;
  handleImageUriChange?: (uri: string | null) => void;
}

const UserProfileImage = ({ userId, ...props }: UserProfileImageProps) => (
  <UserProfileImageContent userId={userId} {...props} />
);

const UserProfileImageContent = ({
  userId,
  imageUrl,
  ...props
}: UserProfileImageProps) => {
  const { scheme } = useColors();
  const defaultAvatar = scheme === "dark" ? AvatarUserDark : AvatarUserLight;

  return (
    <ProfileImage
      {...props}
      imageUrl={imageUrl ?? Image.resolveAssetSource(defaultAvatar).uri}
      hasCustomImage={!!imageUrl}
      href={userId ? `/user/${userId}` : undefined}
      alt={`${userId ?? "User"} profile`}
    />
  );
};

export default UserProfileImage;
