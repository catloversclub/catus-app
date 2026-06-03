import ProfileImage from "@/components/common/profile-image";

interface UserProfileImageProps {
  imageUrl: string | null;
  size: "sm" | "md" | "lg";
  userId?: string;
  isEditMode?: boolean;
  handleImageUriChange?: (uri: string | null) => void;
}

const UserProfileImage = ({ userId, ...props }: UserProfileImageProps) => (
  <ProfileImage
    {...props}
    href={userId ? `/user/${userId}` : undefined}
    alt={`${userId ?? "User"} profile`}
  />
);

export default UserProfileImage;
