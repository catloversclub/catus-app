import { useColors } from "@/hooks/use-colors";
import {
  BottomSheetBackdrop,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet } from "react-native";

const INDICATOR_WIDTH = 120;
const INDICATOR_HEIGHT = 6;

interface BaseBottomSheetProps {
  BaseBottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  children: React.ReactNode;
  onDismiss?: () => void;
  keyboardBehavior?: "extend" | "fillParent" | "interactive";
  keyboardBlurBehavior?: "none" | "restore";
  snapPoints?: (string | number)[];
  footerComponent?: React.FC<BottomSheetFooterProps>;
}

const BaseBottomSheet = ({
  BaseBottomSheetModalRef,
  children,
  onDismiss,
  keyboardBehavior,
  keyboardBlurBehavior,
  snapPoints,
  footerComponent,
}: BaseBottomSheetProps) => {
  const { colors } = useColors();

  return (
    <BottomSheetModal
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          style={{ backgroundColor: colors.dimmed.primary }}
        />
      )}
      backgroundStyle={{ backgroundColor: colors.bg.secondary }}
      handleIndicatorStyle={{
        width: INDICATOR_WIDTH,
        height: INDICATOR_HEIGHT,
        backgroundColor: colors.icon.secondary,
      }}
      ref={BaseBottomSheetModalRef}
      onDismiss={onDismiss}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior={keyboardBlurBehavior}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      footerComponent={footerComponent}
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
  },
});
