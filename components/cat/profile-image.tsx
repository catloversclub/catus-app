import ProfileImage, {
  type ProfileImageSize,
} from "@/components/common/profile-image";

interface CatProfileImageProps {
  imageUrl: string | null;
  size: ProfileImageSize;
  catId?: string;
  isEditMode?: boolean;
  isPreviewDisabled?: boolean;
  handleImageUriChange?: (uri: string | null) => void;
}

const CatProfileImage = ({ catId, ...props }: CatProfileImageProps) => (
  <ProfileImage
    {...props}
    href={catId ? `/cat/${catId}` : undefined}
    alt={`${catId ?? "Cat"} profile`}
  />
);

export default CatProfileImage;
