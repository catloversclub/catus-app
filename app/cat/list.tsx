import { catKeys, useMyCatsQuery } from "@/api/domains/cat/queries";
import PlusIcon from "@/assets/icons/plus.svg";
import CatCard from "@/components/cat/cat-card";
import ActionPressable from "@/components/common/action-pressable";
import { RefreshableScrollView } from "@/components/common/logo-refresh-control";
import { useColors } from "@/hooks/use-colors";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { Text, View } from "react-native";

const CatList = () => {
  const { colors } = useColors();
  const { data: catData } = useMyCatsQuery();
  const refreshQueries = useRefreshQueries([catKeys.list()]);
  return (
    <View className="flex-1">
      <RefreshableScrollView
        onRefresh={refreshQueries}
        className="flex-1 bg-semantic-bg-primary py-6 px-5"
      >
        <View className="flex-col gap-1.5">
          {catData.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </View>
        <ActionPressable href="/cat/register">
          <View className="py-3 flex-row items-center gap-1.5">
            <PlusIcon width={16} height={16} fill={colors.icon.tertiary} />
            <Text className="text-semantic-button-ghost-text typo-body4">
              더 추가하기
            </Text>
          </View>
        </ActionPressable>
      </RefreshableScrollView>
    </View>
  );
};

export default CatList;
