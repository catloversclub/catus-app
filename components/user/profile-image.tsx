import CameraIcon from "@/assets/icons/camera.svg";
import { PROFILE_SIZE } from "@/constants/user";
import { useImagePicker } from "@/hooks/useImagePicker";
import { dark, light } from "@/styles/semantic-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import {
  Pressable,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface ProfileImageProps {
  imageUrl: string | null;
  userId?: string;
  isUserLink?: boolean;
  isEditMode?: boolean;
  size: "sm" | "md" | "lg";
}

const ProfileImage = ({
  imageUrl,
  userId,
  isUserLink = false,
  isEditMode = false,
  size,
}: ProfileImageProps) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  const defaultAvatar =
    scheme === "dark"
      ? require("@/assets/images/avatar/user-dark.png")
      : require("@/assets/images/avatar/user-light.png");
  const imageSource = imageUrl ? { uri: imageUrl } : defaultAvatar;
  const sizeValue = PROFILE_SIZE[size];
  const { handleCameraPress } = useImagePicker();

  const image = (
    <View style={{ width: sizeValue, height: sizeValue }}>
      <Image
        source={imageSource}
        style={{
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue,
        }}
        contentFit="cover"
        alt={`${userId || "User"} profile`}
      />
      {isEditMode && (
        <TouchableOpacity onPress={handleCameraPress}>
          <View
            className="absolute bottom-0 -right-2 size-11 rounded-full items-center justify-center border border-semantic-border-primary bg-semantic-bg-primary"
            style={{ backgroundColor: colors.bg.secondary }}
          >
            <CameraIcon width={20} height={20} color={colors.icon.primary} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isUserLink) {
    return (
      <Link href={`/user/${userId}`} asChild>
        <Pressable className="active:opacity-60">{image}</Pressable>
      </Link>
    );
  }

  return image;
};

export default ProfileImage;
