import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import { ThemeMode, useThemeStore } from "@/store/theme-store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface DisplayModeSheetProps {
  DisplayModeSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

const DISPLAY_MODE_SHEET_ITEMS: { label: string; mode: ThemeMode }[] = [
  { label: "시스템 (자동)", mode: "system" },
  { label: "라이트 모드", mode: "light" },
  { label: "다크 모드", mode: "dark" },
] as const;

const DisplayModeSheet = ({
  DisplayModeSheetModalRef,
}: DisplayModeSheetProps) => {
  const setMode = useThemeStore((s) => s.setMode);

  const handleModePress = async (mode: ThemeMode) => {
    await setMode(mode);
    DisplayModeSheetModalRef.current?.dismiss();
  };

  return (
    <BaseBottomSheet BaseBottomSheetModalRef={DisplayModeSheetModalRef}>
      <View className="flex-1 flex flex-col items-center justify-center pb-16">
        {DISPLAY_MODE_SHEET_ITEMS.map(({ label, mode }) => (
          <Pressable
            key={label}
            onPress={() => handleModePress(mode)}
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

export default DisplayModeSheet;
