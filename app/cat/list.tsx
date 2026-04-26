import { useMyCatsQuery } from "@/api/domains/cat/queries";
import PlusIcon from "@/assets/icons/plus.svg";
import CatCard from "@/components/cat/cat-card";
import { dark, light } from "@/styles/semantic-colors";
import { Link } from "expo-router";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const CatList = () => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  const { data: catData } = useMyCatsQuery();
  return (
    <ScrollView className="flex-1 bg-semantic-bg-primary py-6 px-5">
      <View className="flex-col gap-1.5">
        {catData.map((cat) => (
          <CatCard key={cat.id} cat={cat} />
        ))}
      </View>
      <Link href={`/cat/register`} asChild>
        <Pressable className="active:opacity-60">
          <View className="py-3 flex-row items-center gap-1.5">
            <PlusIcon width={16} height={16} fill={colors.icon.tertiary} />
            <Text className="text-semantic-button-ghost-text typo-body4">
              더 추가하기
            </Text>
          </View>
        </Pressable>
      </Link>
    </ScrollView>
  );
};

export default CatList;
