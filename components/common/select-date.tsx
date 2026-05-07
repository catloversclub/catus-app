import CalendarIcon from "@/assets/icons/calendar.svg";
import { SelectDateSheet } from "@/components/bottom-sheet/select-date-sheet";
import { useColors } from "@/hooks/use-colors";
import { formatDate } from "@/lib/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { Text, TouchableOpacity } from "react-native";

interface SelectDateProps {
  date: string | null;
  onChangeDate: (value: string | null) => void;
}

const SelectDate = ({ date, onChangeDate }: SelectDateProps) => {
  const { colors } = useColors();
  const SelectDateSheetModalRef = useRef<BottomSheetModal>(null);
  const handleSelectDatePress = useCallback(() => {
    SelectDateSheetModalRef.current?.present();
  }, []);
  return (
    <>
      <TouchableOpacity
        onPress={handleSelectDatePress}
        className="rounded px-3 py-[13px] bg-semantic-bg-secondary flex-row justify-between items-center"
      >
        <Text className="typo-body4 text-semantic-text-tertiary">
          {formatDate(date)}
        </Text>
        <CalendarIcon color={colors.icon.tertiary} />
      </TouchableOpacity>
      <SelectDateSheet
        SelectDateSheetModalRef={SelectDateSheetModalRef}
        date={date}
        onChangeDate={onChangeDate}
      />
    </>
  );
};

export default SelectDate;
