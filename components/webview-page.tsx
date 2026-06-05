import { RefreshableScrollView } from "@/components/common/logo-refresh-control";
import { commonStyles } from "@/styles/common-styles";
import React, { useCallback } from "react";
import { Linking, Pressable, Text, View } from "react-native";

interface WebViewPageProps {
  url: string;
  onMessage?: (event: { nativeEvent: { data: string } }) => void;
}

export function WebViewPage({ url, onMessage }: WebViewPageProps) {
  const onRefresh = useCallback(async () => {
    onMessage?.({ nativeEvent: { data: "refresh" } });
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  }, [onMessage]);

  const openExternal = useCallback(() => {
    Linking.openURL(url);
  }, [url]);

  return (
    <View style={{ flex: 1 }}>
      <RefreshableScrollView
        onRefresh={onRefresh}
        contentContainerStyle={{ flex: 1 }}
      >
        <View
          style={commonStyles.webview}
          className="items-center justify-center bg-semantic-bg-primary px-6"
        >
          <Pressable
            onPress={openExternal}
            className="rounded bg-semantic-button-primary-bg px-4 py-3 active:opacity-70"
          >
            <Text className="typo-body3 text-semantic-button-primary-text">
              브라우저에서 열기
            </Text>
          </Pressable>
        </View>
      </RefreshableScrollView>
    </View>
  );
}
