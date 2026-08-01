import type { ComponentProps, ComponentRef } from "react";
import { forwardRef, useCallback, useState } from "react";
import { RefreshControl, ScrollViewProps } from "react-native";
import Animated from "react-native-reanimated";

type Options = {
  onRefresh: () => Promise<unknown> | void;
};

const useLogoRefreshControl = ({ onRefresh }: Options) => {
  const [refreshing, setRefreshing] = useState(false);

  const triggerRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, onRefresh]);

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={triggerRefresh} />
  );

  return { refreshControl, refreshing };
};

// ─────────────────────────────────────────────────────────────────────────────

interface RefreshableScrollViewProps extends Omit<ScrollViewProps, "onScroll"> {
  onRefresh: () => Promise<unknown> | void;
  onScroll?: ComponentProps<typeof Animated.ScrollView>["onScroll"];
}

const RefreshableScrollView = forwardRef<
  ComponentRef<typeof Animated.ScrollView>,
  RefreshableScrollViewProps
>(({ onRefresh, children, ...props }, ref) => {
  const { refreshControl } = useLogoRefreshControl({ onRefresh });

  return (
    <Animated.ScrollView
      ref={ref}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
      {...(props as any)}
      contentContainerStyle={[{ flexGrow: 1 }, props.contentContainerStyle]}
    >
      {children}
    </Animated.ScrollView>
  );
});

RefreshableScrollView.displayName = "RefreshableScrollView";

export { RefreshableScrollView, useLogoRefreshControl };
