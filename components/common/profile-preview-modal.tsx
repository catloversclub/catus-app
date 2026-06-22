import ImageViewerModal from "@/components/common/image-viewer-modal";

interface Origin {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ProfilePreviewModalProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
  origin?: Origin;
}

const ProfilePreviewModal = ({
  visible,
  imageUrl,
  onClose,
  origin,
}: ProfilePreviewModalProps) => {
  return (
    <ImageViewerModal
      visible={visible}
      source={{ uri: imageUrl }}
      onClose={onClose}
      circular
      origin={origin}
    />
  );
};

export default ProfilePreviewModal;
