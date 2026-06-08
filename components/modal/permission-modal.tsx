import AlbumIcon from "@/assets/icons/album.svg";
import BellIcon from "@/assets/icons/bell.svg";
import CameraIcon from "@/assets/icons/camera.svg";
import Button from "@/components/common/button";
import CenterModal from "@/components/modal/center-modal";
import { useColors } from "@/hooks/use-colors";
import { Text, View } from "react-native";

type PermissionType = "gallery" | "camera" | "notification";

interface PermissionModalProps {
  visible: boolean;
  type: PermissionType;
  isDenied?: boolean;
  onRequestPermission: () => void;
  onClose: () => void;
}

export const PermissionLogo = ({ type }: { type: PermissionType }) => {
  const { colors } = useColors();
  const Icon =
    type === "gallery" ? AlbumIcon : type === "camera" ? CameraIcon : BellIcon;

  return <Icon width={24} height={24} color={colors.icon.success} />;
};

const PERMISSION_LABEL: Record<PermissionType, string> = {
  gallery: "사진",
  camera: "카메라",
  notification: "알림",
};

const REQUEST_DESCRIPTION: Record<PermissionType, string> = {
  gallery: "고양이 사진을 선택하려면 사진 접근 권한이 필요해요",
  camera: "사진을 촬영하려면 카메라 접근 권한이 필요해요",
  notification: "새 소식을 받으려면 알림 권한이 필요해요",
};

const PermissionModal = ({
  visible,
  type,
  isDenied = false,
  onRequestPermission,
  onClose,
}: PermissionModalProps) => {
  const permissionLabel = PERMISSION_LABEL[type];
  const title = isDenied
    ? `${permissionLabel} 접근이 거부되어 있어요`
    : `${permissionLabel} 접근 권한이 필요해요`;
  const description = isDenied
    ? `설정 앱에서 Catus의 ${permissionLabel} 접근을 허용해주세요`
    : REQUEST_DESCRIPTION[type];
  const buttonLabel = isDenied ? "설정으로 이동" : "권한 허용하기";

  return (
    <CenterModal visible={visible} onClose={onClose}>
      <View className="gap-5 rounded-md bg-semantic-bg-primary px-4 pb-4 pt-6">
        <PermissionLogo type={type} />
        <View className="gap-2">
          <Text className="typo-body1 text-center text-semantic-text-primary">
            {title}
          </Text>
          <Text className="typo-body3 text-center text-semantic-text-secondary">
            {description}
          </Text>
        </View>
        <Button
          button={{
            label: buttonLabel,
            onPress: onRequestPermission,
            size: "lg",
          }}
        />
      </View>
    </CenterModal>
  );
};

export default PermissionModal;
