import DeleteIcon from "@/assets/icons/delete.svg";
import SearchIcon from "@/assets/icons/search.svg";
import IconButton from "@/components/common/icon-button";
import { useColors } from "@/hooks/use-colors";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ViewedCatItem from "./viewed-cat-item";

export interface ViewedCat {
  id: string;
  name: string;
  breed?: string;
  imageUrl: string | null;
}

interface ExploreIdleViewProps {
  recentSearches: string[];
  onDeleteSearch: (index: number) => void;
  onClearAll: () => void;
  onSearchPress: (text: string) => void;
  showMoreHistory: boolean;
  onToggleMoreHistory: () => void;
  viewedCats: ViewedCat[];
  onDeleteCat: (id: string) => void;
  showMoreCats: boolean;
  onToggleMoreCats: () => void;
}

const ExploreIdleView = ({
  recentSearches,
  onDeleteSearch,
  onClearAll,
  onSearchPress,
  showMoreHistory,
  onToggleMoreHistory,
  viewedCats,
  onDeleteCat,
  showMoreCats,
  onToggleMoreCats,
}: ExploreIdleViewProps) => {
  const { colors } = useColors();

  const visibleHistory = showMoreHistory
    ? recentSearches
    : recentSearches.slice(0, 5);
  const visibleCats = showMoreCats ? viewedCats : viewedCats.slice(0, 3);

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-3 pt-6 pb-8 gap-6"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* 최근 검색어 */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="typo-title3 text-semantic-text-primary">최근 검색어</Text>
          <TouchableOpacity onPress={onClearAll} className="px-2.5 py-1">
            <Text className="typo-body4 text-semantic-text-tertiary underline">
              전체 삭제
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          {visibleHistory.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSearchPress(item)}
              className="flex-row items-center gap-3 h-[46px] pl-1.5 pr-3 py-1.5 rounded"
            >
              <View className="p-2 rounded-full bg-semantic-bg-secondary">
                <SearchIcon width={16} height={16} color={colors.icon.tertiary} />
              </View>
              <Text
                className="typo-body4 text-semantic-text-secondary flex-1"
                numberOfLines={1}
              >
                {item}
              </Text>
              <IconButton
                onPress={() => onDeleteSearch(index)}
                className="p-3"
              >
                <DeleteIcon width={16} height={16} color={colors.icon.tertiary} />
              </IconButton>
            </TouchableOpacity>
          ))}
        </View>
        {recentSearches.length > 5 && (
          <TouchableOpacity
            onPress={onToggleMoreHistory}
            className="border border-semantic-border-primary rounded py-2.5 px-6 items-center"
          >
            <Text className="typo-body4 text-semantic-text-secondary">
              {showMoreHistory ? "접기" : "더보기"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 내가 찾아본 고양이들 */}
      <View className="gap-3">
        <Text className="typo-title3 text-semantic-text-primary">
          내가 찾아본 고양이들
        </Text>
        <View>
          {visibleCats.map((cat) => (
            <ViewedCatItem key={cat.id} cat={cat} onDelete={onDeleteCat} />
          ))}
        </View>
        {viewedCats.length > 3 && (
          <TouchableOpacity
            onPress={onToggleMoreCats}
            className="border border-semantic-border-primary rounded py-2.5 px-6 items-center"
          >
            <Text className="typo-body4 text-semantic-text-secondary">
              {showMoreCats ? "접기" : "더보기"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default ExploreIdleView;
