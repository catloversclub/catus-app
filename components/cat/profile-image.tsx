import AvatarCatDark from "@/assets/images/avatar/cat-dark.png";
import AvatarCatLight from "@/assets/images/avatar/cat-light.png";
import ProfileImage, {
  type ProfileImageSize,
} from "@/components/common/profile-image";
import { useColors } from "@/hooks/use-colors";
import { Image } from "react-native";

interface CatProfileImageProps {
  imageUrl: string | null;
  size: ProfileImageSize;
  catId?: string;
  isEditMode?: boolean;
  isPreviewDisabled?: boolean;
  handleImageUriChange?: (uri: string | null) => void;
}

const CatProfileImage = ({
  catId,
  imageUrl,
  ...props
}: CatProfileImageProps) => {
  const { scheme } = useColors();
  const defaultAvatar = scheme === "dark" ? AvatarCatDark : AvatarCatLight;

  return (
    <ProfileImage
      {...props}
      imageUrl={imageUrl ?? Image.resolveAssetSource(defaultAvatar).uri}
      hasCustomImage={!!imageUrl}
      href={catId ? `/cat/${catId}` : undefined}
      alt={`${catId ?? "Cat"} profile`}
    />
  );
};
export default CatProfileImage;
