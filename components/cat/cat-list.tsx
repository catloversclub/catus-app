import { useMyCatsQuery } from "@/api/domains/cat/queries";
import CatItem from "@/components/cat/cat-item";
import { dark, light } from "@/styles/semantic-colors";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, ScrollView, useColorScheme, View } from "react-native";

const CatList = () => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  const bgTransparent =
    scheme === "dark" ? "rgba(24, 24, 27, 0)" : "rgba(255, 255, 255, 0)";
  const { data: catData } = useMyCatsQuery();

  if (catData.length === 0) {
    return null;
  }

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-1"
      >
        <View className="w-5" />
        <View className="flex-row gap-2">
          {catData.map((cat) => (
            <Link href={`/cat/${cat.id}`} key={cat.id} asChild>
              <Pressable className="active:opacity-60">
                <CatItem cat={cat} />
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>

      <LinearGradient
        colors={[bgTransparent, colors.bg.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 60,
        }}
        pointerEvents="none"
      />
    </>
  );
};

export default CatList;
