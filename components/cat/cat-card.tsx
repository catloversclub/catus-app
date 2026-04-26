import { Cat } from "@/api/domains/cat/types";
import UpdateIcon from "@/assets/icons/update.svg";
import { dark, light } from "@/styles/semantic-colors";
import { Link } from "expo-router";
import { Pressable, Text, useColorScheme, View } from "react-native";

interface CatCardProps {
  cat: Cat;
}

const CatCard = ({ cat }: CatCardProps) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  return (
    <Link href={`/cat/update/${cat.id}`} key={cat.id} asChild>
      <Pressable className="active:opacity-60">
        <View className="px-3 pb-6 pt-1 bg-semantic-bg-secondary rounded-md">
          <UpdateIcon height={44} width={44} color={colors.icon.primary} />
          <Text>{cat.name}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default CatCard;
