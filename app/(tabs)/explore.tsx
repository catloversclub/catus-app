import { postKeys } from "@/api/domains/post/queries";
import { searchKeys } from "@/api/domains/search/queries";
import AlertIcon from "@/assets/icons/alert.svg";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import Gradient from "@/components/common/gradient";
import IconButton from "@/components/common/icon-button";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import SearchInput from "@/components/common/search-input";
import ExploreDefaultView from "@/components/explore/explore-default-view";
import ExploreIdleView from "@/components/explore/explore-idle-view";
import ExploreResultsView from "@/components/explore/explore-results-view";
import ExploreTypingView from "@/components/explore/explore-typing-view";
import { useColors } from "@/hooks/use-colors";
import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { useSearchHistoryStore } from "@/store/explore/search-history-store";
import { Stack } from "expo-router";
import { useCallback, useState } from "react";
import { Keyboard, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";

type ExploreMode = "default" | "idle" | "typing" | "results";

const ExploreScreen = () => {
  const { colors } = useColors();
  const defaultOptions = useDefaultStackScreenOptions();
  const addSearch = useSearchHistoryStore((s) => s.addSearch);
  const refreshDefault = useRefreshQueries([postKeys.dailyPopular()]);

  const [mode, setMode] = useState<ExploreMode>("default");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showEmptyToast, setShowEmptyToast] = useState(false);
  const refreshResults = useRefreshQueries([
    searchKeys.results("post", submittedQuery),
    searchKeys.results("profile", submittedQuery),
  ]);

  const isSearchMode = mode !== "default";

  const handleFocus = useCallback(() => {
    if (mode === "default") setMode("idle");
  }, [mode]);

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    setMode(text.length > 0 ? "typing" : "idle");
  }, []);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) {
      setShowEmptyToast(true);
      setTimeout(() => setShowEmptyToast(false), 2000);
      return;
    }
    addSearch(query.trim());
    setSubmittedQuery(query);
    setMode("results");
    Keyboard.dismiss();
  }, [addSearch, query]);

  const handleCancel = useCallback(() => {
    setQuery("");
    setSubmittedQuery("");
    setMode("default");
    Keyboard.dismiss();
  }, []);

  const handleSuggestionPress = useCallback((text: string) => {
    addSearch(text);
    setQuery(text);
    setSubmittedQuery(text);
    setMode("results");
    Keyboard.dismiss();
  }, [addSearch]);

  const edgeCancelGesture = Gesture.Pan()
    .activeOffsetX(12)
    .failOffsetY([-16, 16])
    .onEnd((event) => {
      if (event.translationX > 56 || event.velocityX > 600) {
        runOnJS(handleCancel)();
      }
    });

  const renderSearchInput = useCallback(
    () => (
      <View className="px-3 mt-3">
        <SearchInput
          value={query}
          onValueChange={handleQueryChange}
          onFocus={handleFocus}
          onSubmitEditing={handleSubmit}
          placeholder="어떤 고양이를 좋아하세요?"
        />
      </View>
    ),
    [handleFocus, handleQueryChange, handleSubmit, query],
  );

  const handleRefresh = useCallback(() => {
    if (mode === "default") return refreshDefault();
    if (mode === "results") return refreshResults();
  }, [mode, refreshDefault, refreshResults]);
  const { refreshControl } = useLogoRefreshControl({ onRefresh: handleRefresh });

  const renderContent = () => {
    switch (mode) {
      case "default":
        return <ExploreDefaultView />;
      case "idle":
        return <ExploreIdleView onSearchPress={handleSuggestionPress} />;
      case "typing":
        return <ExploreTypingView query={query} onPress={handleSuggestionPress} />;
      case "results":
        return <ExploreResultsView query={submittedQuery} />;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          ...defaultOptions,
          title: "탐색",
          headerLeft: () => (
            <IconButton
              onPress={handleCancel}
              disabled={!isSearchMode}
              className={isSearchMode ? "p-2 pl-3" : "p-2 pl-3 opacity-0"}
            >
              <ArrowLeftIcon
                width={20}
                height={20}
                color={colors.icon.primary}
              />
            </IconButton>
          ),
        }}
      />

      <View className="flex-1 bg-semantic-bg-primary">
        <Gradient
          direction="vertical"
          height={10}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        />
        <Animated.ScrollView
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          className="flex-1"
          contentContainerStyle={{ paddingTop: 10, flexGrow: 1 }}
          contentContainerClassName="pb-8 gap-6"
          keyboardShouldPersistTaps="handled"
        >
          {renderSearchInput()}
          {renderContent()}
        </Animated.ScrollView>

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

        {isSearchMode && (
          <GestureDetector gesture={edgeCancelGesture}>
            <View className="absolute left-0 top-0 bottom-0 w-7" />
          </GestureDetector>
        )}
      </View>
    </>
  );
};

export default ExploreScreen;
