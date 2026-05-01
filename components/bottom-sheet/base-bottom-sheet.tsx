import { dark, light } from "@/styles/semantic-colors";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, useColorScheme } from "react-native";

const INDICATOR_WIDTH = 120;
const INDICATOR_HEIGHT = 6;

interface BaseBottomSheetProps {
  BaseBottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  children: React.ReactNode;
  onDismiss?: () => void;
}

export const BaseBottomSheet = ({
  BaseBottomSheetModalRef,
  children,
  onDismiss,
}: BaseBottomSheetProps) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;

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
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 668,
    alignItems: "center",
  },
});
