import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import { commonStyles } from "@/styles/common-styles"
import React, { useCallback, useRef } from "react"
import { View, ScrollView } from "react-native"
import { WebView, WebViewMessageEvent } from "react-native-webview"

interface WebViewPageProps {
  url: string
  onMessage: (event: WebViewMessageEvent) => void
}

export function WebViewPage({ url, onMessage }: WebViewPageProps) {
  const webViewRef = useRef<WebView>(null)

  const onRefresh = useCallback(async () => {
    webViewRef.current?.reload()
    await new Promise<void>((resolve) => setTimeout(resolve, 1000))
  }, [])

  const { onScrollEndDrag, logoOverlay } = useLogoRefreshControl({ onRefresh })

  return (
    <View style={{ flex: 1 }}>
      {logoOverlay}
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        onScrollEndDrag={onScrollEndDrag}
      >
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={commonStyles.webview}
          showsVerticalScrollIndicator={false}
          allowsBackForwardNavigationGestures={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onMessage={onMessage}
        />
      </ScrollView>
    </View>
  )
}
