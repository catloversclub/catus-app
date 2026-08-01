import type { ComponentProps, ComponentRef } from "react";
import { forwardRef } from "react";
import { RefreshControl, ScrollViewProps } from "react-native";
import Animated from "react-native-reanimated";

interface RefreshableScrollViewProps extends Omit<ScrollViewProps, "onScroll"> {
  onRefresh: () => Promise<unknown> | void;
  refreshing: boolean;
  onScroll?: ComponentProps<typeof Animated.ScrollView>["onScroll"];
}

const RefreshableScrollView = forwardRef<
  ComponentRef<typeof Animated.ScrollView>,
  RefreshableScrollViewProps
>(({ onRefresh, refreshing, children, ...props }, ref) => (
    <Animated.ScrollView
      ref={ref}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      {...(props as any)}
      contentContainerStyle={[{ flexGrow: 1 }, props.contentContainerStyle]}
    >
      {children}
    </Animated.ScrollView>
  ));

RefreshableScrollView.displayName = "RefreshableScrollView";

export { RefreshableScrollView };
