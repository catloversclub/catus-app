import { useUserCatsQuery } from "@/api/domains/cat/queries";
import CatList from "@/components/cat/cat-list";
import { Text, View } from "react-native";

interface UserCatListSectionProps {
  userId: string;
}

const UserCatListSection = ({ userId }: UserCatListSectionProps) => {
  const { data: cats } = useUserCatsQuery(userId);

  if (cats.length === 0) {
    return null;
  }

  return (
    <View className="w-full mb-3">
      <Text className="text-semantic-text-secondary typo-body3 px-5 mb-3">
        함께 사는 고양이
      </Text>
      <View className="flex-row items-center">
        <View className="flex-1">
          <CatList cats={cats} />
        </View>
      </View>
    </View>
  );
};

export default UserCatListSection;
