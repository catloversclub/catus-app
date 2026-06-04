import CatProfileImage from "@/components/cat/profile-image";
import { ProfileIdentity } from "@/components/common/profile-identity";
import { Text, View } from "react-native";

interface CatProfileHeaderProps {
  imageUrl?: string | null;
  name: string;
  subtitle?: string | null;
  tags?: string[];
}

const CatProfileHeader = ({
  imageUrl,
  name,
  subtitle,
  tags,
}: CatProfileHeaderProps) => {
  const hasTags = !!tags?.length;

  return (
    <View className="pt-6">
      <View className="flex-col items-center">
        <CatProfileImage imageUrl={imageUrl ?? null} size="lg" />
        <ProfileIdentity name={name} subtitle={subtitle} />
        {hasTags ? (
          <View className="flex-row flex-wrap justify-center gap-1.5 px-5 mb-6">
            {tags!.map((tag) => (
              <View
                key={tag}
                className="px-3 py-1 rounded-full bg-semantic-bg-secondary"
              >
                <Text className="typo-body4 text-semantic-text-secondary">
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="mb-6" />
        )}
      </View>
    </View>
  );
};

export { CatProfileHeader };
