import PermissionModal from "@/components/modal/permission-modal";
import { Linking } from "react-native";

type PermissionRequestHandler = () => void | Promise<unknown>;

interface MediaPermissionModalConfig {
  visible: boolean;
  isDenied: boolean;
  onRequestPermission: PermissionRequestHandler;
  onClose: () => void;
}

interface MediaPermissionModalsProps {
  gallery?: MediaPermissionModalConfig;
  camera?: MediaPermissionModalConfig;
}

const MediaPermissionModals = ({
  gallery,
  camera,
}: MediaPermissionModalsProps) => {
  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  return (
    <>
      {gallery ? (
        <PermissionModal
          visible={gallery.visible}
          type="gallery"
          isDenied={gallery.isDenied}
          onRequestPermission={
            gallery.isDenied ? handleOpenSettings : gallery.onRequestPermission
          }
          onClose={gallery.onClose}
        />
      ) : null}
      {camera ? (
        <PermissionModal
          visible={camera.visible}
          type="camera"
          isDenied={camera.isDenied}
          onRequestPermission={
            camera.isDenied ? handleOpenSettings : camera.onRequestPermission
          }
          onClose={camera.onClose}
        />
      ) : null}
    </>
  );
};

export default MediaPermissionModals;
