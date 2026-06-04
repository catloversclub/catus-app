import AvatarDark from "@/assets/images/avatar/user-dark.png";
import AvatarLight from "@/assets/images/avatar/user-light.png";
import ImageViewerModal from "@/components/common/image-viewer-modal";
import { useColors } from "@/hooks/use-colors";

interface ProfilePreviewModalProps {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const ProfilePreviewModal = ({
  visible,
  imageUrl,
  onClose,
}: ProfilePreviewModalProps) => {
  const { scheme } = useColors();
  const defaultAvatar = scheme === "dark" ? AvatarDark : AvatarLight;

  return (
    <ImageViewerModal
      visible={visible}
      source={imageUrl ? { uri: imageUrl } : defaultAvatar}
      onClose={onClose}
      circular
    />
  );
};

export default ProfilePreviewModal;
