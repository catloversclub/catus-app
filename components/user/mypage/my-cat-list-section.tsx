import { useMyCatsQuery } from "@/api/domains/cat/queries";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import CatList from "@/components/cat/cat-list";
import CatRegistration from "@/components/cat/cat-registration";
import IconButton from "@/components/common/icon-button";
import { useColors } from "@/hooks/use-colors";
import { Link } from "expo-router";
import { Text, View } from "react-native";

const MyCatListSection = () => {
  const { colors } = useColors();
  const { data: catData } = useMyCatsQuery();
  const hasCats = catData.length > 0;

  return (
    <>
      <View className="w-full flex-row justify-between items-center px-5 mb-3">
        <Text className="text-semantic-text-secondary typo-body3">
          함께 사는 고양이
        </Text>
        <Link href="/cat/list" asChild>
          <IconButton className="active:opacity-60">
            <ChevronRightIcon
              width={16}
              height={16}
              color={colors.icon.secondary}
            />
          </IconButton>
        </Link>
      </View>
      {hasCats ? (
        <View className="flex-row items-center pr-5">
          <View className="flex-1">
            <CatList />
          </View>
          <CatRegistration />
        </View>
      ) : (
        <View className="pl-5">
          <CatRegistration />
        </View>
      )}
    </>
  );
};

export default MyCatListSection;
