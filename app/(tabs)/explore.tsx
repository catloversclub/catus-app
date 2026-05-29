import AlertIcon from "@/assets/icons/alert.svg";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import IconButton from "@/components/common/icon-button";
import SearchInput from "@/components/common/search-input";
import ExploreDefaultView from "@/components/explore/explore-default-view";
import ExploreIdleView from "@/components/explore/explore-idle-view";
import ExploreResultsView from "@/components/explore/explore-results-view";
import ExploreTypingView from "@/components/explore/explore-typing-view";
import { useSearchHistoryStore } from "@/store/explore/search-history-store";
import { useColors } from "@/hooks/use-colors";
import { Stack } from "expo-router";
import { useState } from "react";
import { Keyboard, Text, View } from "react-native";

type ExploreMode = "default" | "idle" | "typing" | "results";

export default function ExploreScreen() {
  const { colors } = useColors();
  const addSearch = useSearchHistoryStore((s) => s.addSearch);

  const [mode, setMode] = useState<ExploreMode>("default");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showEmptyToast, setShowEmptyToast] = useState(false);

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
    addSearch(query.trim());
    setSubmittedQuery(query);
    setMode("results");
    Keyboard.dismiss();
  };

  const handleCancel = () => {
    setQuery("");
    setSubmittedQuery("");
    setMode("default");
    Keyboard.dismiss();
  };

  const handleSuggestionPress = (text: string) => {
    addSearch(text);
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

        {mode === "default" && <ExploreDefaultView />}

        {mode === "idle" && (
          <ExploreIdleView onSearchPress={handleSuggestionPress} />
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
