import DeleteIcon from "@/assets/icons/delete.svg";
import SearchIcon from "@/assets/icons/search.svg";
import IconButton from "@/components/common/icon-button";
import { useColors } from "@/hooks/use-colors";
import { useSearchHistoryStore } from "@/store/explore/search-history-store";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ViewedCatItem from "./viewed-cat-item";

interface ExploreIdleViewProps {
  onSearchPress: (text: string) => void;
}

const ExploreIdleView = ({ onSearchPress }: ExploreIdleViewProps) => {
  const { colors } = useColors();
  const {
    recentSearches,
    viewedCats,
    removeSearch,
    clearSearches,
    removeViewedCat,
  } = useSearchHistoryStore();

  const [showMoreHistory, setShowMoreHistory] = useState(false);
  const [showMoreCats, setShowMoreCats] = useState(false);

  const visibleHistory = showMoreHistory
    ? recentSearches
    : recentSearches.slice(0, 5);
  const visibleCats = showMoreCats ? viewedCats : viewedCats.slice(0, 3);

  const hasSearches = recentSearches.length > 0;
  const hasCats = viewedCats.length > 0;

  if (!hasSearches && !hasCats) return null;

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-3 pt-6 pb-8 gap-6"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {hasSearches && (
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="typo-title3 text-semantic-text-primary">
              최근 검색어
            </Text>
            <TouchableOpacity onPress={clearSearches} className="px-2.5 py-1">
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
                  <SearchIcon
                    width={16}
                    height={16}
                    color={colors.icon.tertiary}
                  />
                </View>
                <Text
                  className="typo-body4 text-semantic-text-secondary flex-1"
                  numberOfLines={1}
                >
                  {item}
                </Text>
                <IconButton
                  onPress={() => removeSearch(index)}
                  className="p-3"
                >
                  <DeleteIcon
                    width={16}
                    height={16}
                    color={colors.icon.tertiary}
                  />
                </IconButton>
              </TouchableOpacity>
            ))}
          </View>
          {recentSearches.length > 5 && (
            <TouchableOpacity
              onPress={() => setShowMoreHistory((v) => !v)}
              className="border border-semantic-border-primary rounded py-2.5 px-6 items-center"
            >
              <Text className="typo-body4 text-semantic-text-secondary">
                {showMoreHistory ? "접기" : "더보기"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {hasCats && (
        <View className="gap-3">
          <Text className="typo-title3 text-semantic-text-primary">
            내가 찾아본 고양이들
          </Text>
          <View>
            {visibleCats.map((cat) => (
              <ViewedCatItem
                key={cat.id}
                cat={cat}
                onDelete={removeViewedCat}
              />
            ))}
          </View>
          {viewedCats.length > 3 && (
            <TouchableOpacity
              onPress={() => setShowMoreCats((v) => !v)}
              className="border border-semantic-border-primary rounded py-2.5 px-6 items-center"
            >
              <Text className="typo-body4 text-semantic-text-secondary">
                {showMoreCats ? "접기" : "더보기"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default ExploreIdleView;
