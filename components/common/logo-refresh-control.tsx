import Gradient from "@/components/common/gradient";
import { useCallback, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollViewProps,
} from "react-native";
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

  const onScrollEndDrag = useCallback(
    (_event: NativeSyntheticEvent<NativeScrollEvent>) => {
      void _event;
    },
    [],
  );

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={triggerRefresh} />
  );

  return { onScrollEndDrag, logoOverlay: null, refreshControl, refreshing };
};

// ─────────────────────────────────────────────────────────────────────────────

interface RefreshableScrollViewProps extends ScrollViewProps {
  onRefresh: () => Promise<unknown> | void;
}

const RefreshableScrollView = ({
  onRefresh,
  children,
  onScrollEndDrag: onScrollEndDragProp,
  ...props
}: RefreshableScrollViewProps) => {
  const { refreshControl } = useLogoRefreshControl({ onRefresh });

  const handleScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScrollEndDragProp?.(e);
    },
    [onScrollEndDragProp],
  );

  return (
    <>
      <Gradient
        direction="vertical"
        height={10}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScrollEndDrag={handleScrollEndDrag}
        refreshControl={refreshControl}
        {...(props as any)}
        contentContainerStyle={[
          { paddingTop: 10, flexGrow: 1 },
          props.contentContainerStyle,
        ]}
      >
        {children}
      </Animated.ScrollView>
    </>
  );
};

export { RefreshableScrollView, useLogoRefreshControl };
