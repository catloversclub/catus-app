import { BaseBottomSheet } from "@/components/bottom-sheet/base-bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface DisplayModeSheetProps {
  DisplayModeSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

const DISPLAY_MODE_SHEET_ITEMS = [
  { label: "시스템 (자동)", onPress: () => {} },
  { label: "라이트 모드", onPress: () => {} },
  { label: "다크 모드", onPress: () => {} },
] as const;

export const DisplayModeSheet = ({
  DisplayModeSheetModalRef,
}: DisplayModeSheetProps) => {
  return (
    <BaseBottomSheet BaseBottomSheetModalRef={DisplayModeSheetModalRef}>
      <View className="flex-1 flex flex-col items-center justify-center pb-16">
        {DISPLAY_MODE_SHEET_ITEMS.map(({ label, onPress }) => (
          <Pressable
            key={label}
            onPress={onPress}
            className="flex-row gap-1.5 py-[14px] items-center justify-center active:opacity-60"
          >
            <Text className="typo-body1 text-semantic-text-primary">
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </BaseBottomSheet>
  );
};
