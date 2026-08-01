import ActionPressable from "@/components/common/action-pressable";
import { RefreshableScrollView } from "@/components/common/refreshable-scroll-view";
import { commonStyles } from "@/styles/common-styles";
import React, { useCallback, useState } from "react";
import { Linking, Text, View } from "react-native";

interface WebViewPageProps {
  url: string;
  onMessage?: (event: { nativeEvent: { data: string } }) => void;
}

export function WebViewPage({ url, onMessage }: WebViewPageProps) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      onMessage?.({ nativeEvent: { data: "refresh" } });
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    } finally {
      setRefreshing(false);
    }
  }, [onMessage]);

  const openExternal = useCallback(() => {
    Linking.openURL(url);
  }, [url]);

  return (
    <View style={{ flex: 1 }}>
      <RefreshableScrollView
        onRefresh={onRefresh}
        refreshing={refreshing}
        contentContainerStyle={{ flex: 1 }}
      >
        <View
          style={commonStyles.webview}
          className="items-center justify-center bg-semantic-bg-primary px-6"
        >
          <ActionPressable
            onPress={openExternal}
            className="rounded bg-semantic-button-primary-bg px-4 py-3"
          >
            <Text className="typo-body3 text-semantic-button-primary-text">
              브라우저에서 열기
            </Text>
          </ActionPressable>
        </View>
      </RefreshableScrollView>
    </View>
  );
}
