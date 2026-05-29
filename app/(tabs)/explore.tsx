import AlertIcon from "@/assets/icons/alert.svg";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import IconButton from "@/components/common/icon-button";
import SearchInput from "@/components/common/search-input";
import ExploreDefaultView from "@/components/explore/explore-default-view";
import ExploreIdleView, {
  ViewedCat,
} from "@/components/explore/explore-idle-view";
import ExploreResultsView from "@/components/explore/explore-results-view";
import ExploreTypingView from "@/components/explore/explore-typing-view";
import { PopularCat } from "@/components/explore/popular-cat-card";
import { useColors } from "@/hooks/use-colors";
import { Stack } from "expo-router";
import { useState } from "react";
import { Keyboard, Text, View } from "react-native";

type ExploreMode = "default" | "idle" | "typing" | "results";

// mock data — 추후 API 연동
const POPULAR_CATS: PopularCat[] = [
  {
    id: "1",
    name: "갸우뚱깜냥이",
    tags: ["애교쟁이 💕", "소심 ☔", "장난꾸러기 😜", "올블랙 🖤"],
    photos: ["https://placekitten.com/400/400"],
  },
  {
    id: "2",
    name: "치즈왕김치즈",
    breed: "골든브리티쉬숏헤어",
    tags: ["순둥이 🧸", "단모", "치즈 🧀"],
    photos: ["https://placekitten.com/401/400"],
  },
  {
    id: "3",
    name: "김요모",
    breed: "스코티쉬스트레이트",
    tags: ["겁쟁이 🥺", "장모"],
    photos: ["https://placekitten.com/402/400"],
  },
];

const MOCK_RECENT_SEARCHES = [
  "아메리칸 쇼트헤어",
  "김치즈",
  "봄비",
  "김요모",
  "스핑크스 고양이",
];

const MOCK_VIEWED_CATS: ViewedCat[] = [
  { id: "1", name: "여름에태어난여름이", breed: "랙돌 먼치킨", imageUrl: null },
  { id: "2", name: "에메랄드냥냥이", breed: "스핑크스", imageUrl: null },
  { id: "3", name: "후추를후추추추", breed: "시나몬 랙돌", imageUrl: null },
];

export default function ExploreScreen() {
  const { colors } = useColors();

  const [mode, setMode] = useState<ExploreMode>("default");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showMoreHistory, setShowMoreHistory] = useState(false);
  const [showMoreCats, setShowMoreCats] = useState(false);
  const [showEmptyToast, setShowEmptyToast] = useState(false);
  const [recentSearches, setRecentSearches] = useState(MOCK_RECENT_SEARCHES);
  const [viewedCats, setViewedCats] = useState(MOCK_VIEWED_CATS);

  const isSearchMode = mode !== "default";

  const handleFocus = () => {
    if (mode === "default") setMode("idle");
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
    setMode(text.length > 0 ? "typing" : "idle");
  };

  const handleSubmit = () => {
    if (!query.trim()) {
      setShowEmptyToast(true);
      setTimeout(() => setShowEmptyToast(false), 2000);
      return;
    }
    setSubmittedQuery(query);
    setMode("results");
    Keyboard.dismiss();
  };

  const handleCancel = () => {
    setQuery("");
    setSubmittedQuery("");
    setMode("default");
    setShowMoreHistory(false);
    setShowMoreCats(false);
    Keyboard.dismiss();
  };

  const handleSuggestionPress = (text: string) => {
    setQuery(text);
    setSubmittedQuery(text);
    setMode("results");
    Keyboard.dismiss();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "탐색",
          headerTintColor: colors.text.primary,
          headerStyle: { backgroundColor: colors.bg.primary },
          headerLeft: isSearchMode
            ? () => (
                <IconButton onPress={handleCancel} className="p-2 pl-3">
                  <ArrowLeftIcon
                    width={20}
                    height={20}
                    color={colors.icon.primary}
                  />
                </IconButton>
              )
            : undefined,
        }}
      />

      <View className="flex-1 bg-semantic-bg-primary">
        <View className="px-3 mt-3">
          <SearchInput
            value={query}
            onValueChange={handleQueryChange}
            onFocus={handleFocus}
            onSubmitEditing={handleSubmit}
            placeholder="어떤 고양이를 좋아하세요?"
          />
        </View>

        {mode === "default" && (
          <ExploreDefaultView popularCats={POPULAR_CATS} />
        )}

        {mode === "idle" && (
          <ExploreIdleView
            recentSearches={recentSearches}
            onDeleteSearch={(idx) =>
              setRecentSearches((prev) => prev.filter((_, i) => i !== idx))
            }
            onClearAll={() => setRecentSearches([])}
            onSearchPress={handleSuggestionPress}
            showMoreHistory={showMoreHistory}
            onToggleMoreHistory={() => setShowMoreHistory((v) => !v)}
            viewedCats={viewedCats}
            onDeleteCat={(id) =>
              setViewedCats((prev) => prev.filter((c) => c.id !== id))
            }
            showMoreCats={showMoreCats}
            onToggleMoreCats={() => setShowMoreCats((v) => !v)}
          />
        )}

        {mode === "typing" && (
          <ExploreTypingView query={query} onPress={handleSuggestionPress} />
        )}

        {mode === "results" && <ExploreResultsView query={submittedQuery} />}

        {showEmptyToast && (
          <View className="absolute bottom-4 left-3 right-3 flex-row items-center gap-1.5 px-2.5 py-3 rounded bg-semantic-bg-secondary border border-semantic-border-primary">
            <AlertIcon width={16} height={16} color={colors.icon.error} />
            <Text
              className="typo-body4 text-semantic-text-primary flex-1"
              numberOfLines={1}
            >
              검색어를 입력해주세요
            </Text>
          </View>
        )}
      </View>
    </>
  );
}
