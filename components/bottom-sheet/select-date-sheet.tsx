import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import WheelPicker from "@/components/common/wheel-picker";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { View } from "react-native";

interface SelectDateSheetProps {
  SelectDateSheetModalRef: React.RefObject<BottomSheetModal | null>;
  date: string | null;
  onChangeDate: (date: string) => void;
}

const YEARS = Array.from(
  { length: new Date().getFullYear() - 1990 + 1 },
  (_, i) => 1990 + i,
);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const parseDate = (date: string | null) => {
  const [year, month, day] = date?.split("T")[0].split("-").map(Number) ?? [];
  if (year && month && day) {
    return {
      year,
      month,
      day,
    };
  }

  const parsed = new Date();
  return {
    year: parsed.getFullYear(),
    month: parsed.getMonth() + 1,
    day: parsed.getDate(),
  };
};

const formatDateOnly = (year: number, month: number, day: number) => {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const SelectDateSheet = ({
  date,
  onChangeDate,
  SelectDateSheetModalRef,
}: SelectDateSheetProps) => {
  const initialDate = parseDate(date);
  const [year, setYear] = useState(initialDate.year);
  const [month, setMonth] = useState(initialDate.month);
  const [day, setDay] = useState(initialDate.day);

  return (
    <BaseBottomSheet
      BaseBottomSheetModalRef={SelectDateSheetModalRef}
      onDismiss={() => onChangeDate(formatDateOnly(year, month, day))}
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

export default SelectDateSheet;
