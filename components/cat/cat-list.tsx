// CatList.tsx
import { useMyCatsQuery } from "@/api/domains/cat/queries";
import {
  default as ChevronRightIcon,
  default as PlusIcon,
} from "@/assets/icons/chevron-right.svg";
import CatItem from "@/components/cat/cat-item";
import { dark, light } from "@/styles/semantic-colors";
import { ScrollView, Text, useColorScheme, View } from "react-native";

interface CatListProps {
  isCatAdditionMode?: boolean; // 고양이 추가 모드 여부
}

const CatList = ({ isCatAdditionMode = false }: CatListProps) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  const { data: catData } = useMyCatsQuery();

  if (catData.length === 0) {
    return null;
  }

  return (
    <View className="flex-col gap-3 px-3">
      <View className="w-full flex-row justify-between items-center">
        <Text className="text-semantic-text-secondary typo-body3">
          함께 사는 고양이
        </Text>
        <ChevronRightIcon
          width={16}
          height={16}
          color={colors.icon.secondary}
        />
      </View>

      <View className="flex-row items-center">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-1"
        >
          <View className="flex-row py-1">
            {catData?.map((cat) => (
              <CatItem key={cat.id} cat={cat} />
            ))}
          </View>
        </ScrollView>

        {/* 항상 오른쪽에 고정 */}
        {isCatAdditionMode && (
          <View className="border-l border-semantic-border-primary pl-3 ml-1 items-center gap-1.5">
            <View className="w-16 h-16 rounded-full bg-semantic-bg-secondary items-center justify-center">
              <PlusIcon width={24} height={24} color={colors.icon.secondary} />
            </View>
            <Text className="text-semantic-text-secondary typo-body4">
              고양이 추가
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CatList;
