import { bottomSheet } from "@/constants";
import { dark, light } from "@/styles/semantic-colors";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { StyleSheet, useColorScheme } from "react-native";
interface BaseBottomSheetProps {
  BaseBottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  children: React.ReactNode;
}

export const BaseBottomSheet = ({
  BaseBottomSheetModalRef,
  children,
}: BaseBottomSheetProps) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;

  const handleBaseBottomSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
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
        width: bottomSheet.indicatorWidth,
        height: bottomSheet.indicatorHeight,
        backgroundColor: colors.icon.secondary,
      }}
      ref={BaseBottomSheetModalRef}
      onChange={handleBaseBottomSheetChanges}
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
