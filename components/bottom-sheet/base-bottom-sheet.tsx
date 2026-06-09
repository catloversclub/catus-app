import { useColors } from "@/hooks/use-colors";
import {
  BottomSheetBackdrop,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { usePathname } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

const INDICATOR_WIDTH = 120;
const INDICATOR_HEIGHT = 6;

interface BaseBottomSheetProps {
  BaseBottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  children: React.ReactNode;
  onDismiss?: () => void;
  onChange?: (index: number) => void;
  keyboardBehavior?: "extend" | "fillParent" | "interactive";
  keyboardBlurBehavior?: "none" | "restore";
  snapPoints?: (string | number)[];
  footerComponent?: React.FC<BottomSheetFooterProps>;
  stackBehavior?: "push" | "switch" | "replace";
  dismissOnRouteChange?: boolean;
}

const BaseBottomSheet = ({
  BaseBottomSheetModalRef,
  children,
  onDismiss,
  onChange,
  keyboardBehavior,
  keyboardBlurBehavior,
  snapPoints,
  footerComponent,
  stackBehavior = "replace",
  dismissOnRouteChange = true,
}: BaseBottomSheetProps) => {
  const { colors } = useColors();
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        style={{ backgroundColor: colors.dimmed.primary }}
      />
    ),
    [colors.dimmed.primary],
  );

  useEffect(() => {
    if (!dismissOnRouteChange) {
      previousPathnameRef.current = pathname;
      return;
    }

    if (previousPathnameRef.current !== pathname) {
      BaseBottomSheetModalRef.current?.dismiss();
    }

    previousPathnameRef.current = pathname;
  }, [BaseBottomSheetModalRef, dismissOnRouteChange, pathname]);

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.bg.primary }}
      handleIndicatorStyle={{
        width: INDICATOR_WIDTH,
        height: INDICATOR_HEIGHT,
        backgroundColor: colors.icon.secondary,
      }}
      ref={BaseBottomSheetModalRef}
      onDismiss={onDismiss}
      onChange={onChange}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior={keyboardBlurBehavior}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      footerComponent={footerComponent}
      stackBehavior={stackBehavior}
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BaseBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 12,
  },
});
