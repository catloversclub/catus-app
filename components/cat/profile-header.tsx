import { Gender } from "@/api/domains/cat/types";
import GenderIcon from "@/components/cat/gender";
import CatProfileImage from "@/components/cat/profile-image";
import { Chip } from "@/components/common/chip";
import { ProfileIdentity } from "@/components/common/profile-identity";
import { Text, View } from "react-native";

interface CatProfileHeaderProps {
  imageUrl?: string | null;
  name: string;
  subtitle?: string | null;
  gender?: Gender | null;
  tags?: string[];
}

const CatProfileHeader = ({
  imageUrl,
  name,
  subtitle,
  gender,
  tags,
}: CatProfileHeaderProps) => {
  const hasTags = !!tags?.length;
  const showGender = gender && gender !== "UNKNOWN";

  return (
    <View className="py-6">
      <View className="flex-col items-center">
        <CatProfileImage imageUrl={imageUrl ?? null} size="lg" />
        <ProfileIdentity name={name} />
        {(subtitle || showGender) && (
          <View className="flex-row items-center gap-1.5 mb-3">
            {subtitle && (
              <Text className="typo-body4 text-semantic-text-tertiary">
                {subtitle}
              </Text>
            )}
            {subtitle && showGender && (
              <Text className="typo-body4 text-semantic-text-tertiary">·</Text>
            )}
            {showGender && <GenderIcon gender={gender!} />}
          </View>
        )}
        {hasTags && (
          <View className="flex-row flex-wrap justify-center gap-3 px-5">
            {tags!.map((tag) => (
              <Chip key={tag} label={tag} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export { CatProfileHeader };
