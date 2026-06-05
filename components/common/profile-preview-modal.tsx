import AvatarDark from "@/assets/images/avatar/user-dark.png";
import AvatarLight from "@/assets/images/avatar/user-light.png";
import ImageViewerModal from "@/components/common/image-viewer-modal";
import { useColors } from "@/hooks/use-colors";
import { ImageSource } from "expo-image";

interface Origin {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ProfilePreviewModalProps {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
  origin?: Origin;
}

const ProfilePreviewModal = ({
  visible,
  imageUrl,
  onClose,
  origin,
}: ProfilePreviewModalProps) => {
  const { scheme } = useColors();
  const defaultAvatar = scheme === "dark" ? AvatarDark : AvatarLight;

  return (
    <ImageViewerModal
      visible={visible}
      source={(imageUrl ? { uri: imageUrl } : defaultAvatar) as ImageSource}
      onClose={onClose}
      circular
      origin={origin}
    />
  );
};

export default ProfilePreviewModal;
