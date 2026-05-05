import { BaseBottomSheet } from "@/components/bottom-sheet/base-bottom-sheet";
import WheelPicker from "@/components/common/wheel-picker";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { View } from "react-native";

interface SelectDateSheetProps {
  SelectDateSheetModalRef: React.RefObject<BottomSheetModal | null>;
  date: Date | null;
  onChangeDate: (date: Date) => void;
}

const YEARS = Array.from(
  { length: new Date().getFullYear() - 1990 + 1 },
  (_, i) => 1990 + i,
);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export const SelectDateSheet = ({
  date,
  onChangeDate,
  SelectDateSheetModalRef,
}: SelectDateSheetProps) => {
  const now = date ?? new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());

  return (
    <BaseBottomSheet
      BaseBottomSheetModalRef={SelectDateSheetModalRef}
      onDismiss={() => onChangeDate(new Date(year, month - 1, day))}
    >
      <View className="flex-row justify-center items-center px-5 pb-8">
        <WheelPicker
          items={YEARS}
          selected={year}
          onChange={setYear}
          suffix="년"
        />
        <WheelPicker
          items={MONTHS}
          selected={month}
          onChange={setMonth}
          suffix="월"
        />
        <WheelPicker
          items={DAYS}
          selected={day}
          onChange={setDay}
          suffix="일"
        />
      </View>
    </BaseBottomSheet>
  );
};
