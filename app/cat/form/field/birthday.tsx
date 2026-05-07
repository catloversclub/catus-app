import SelectDate from "@/components/common/select-date";
import { Text, View } from "react-native";

interface RegisterBirthDateProps {
  birthDate: string | null;
  onChangeBirthDate: (date: string | null) => void;
}

const RegisterBirthDate = ({
  birthDate,
  onChangeBirthDate,
}: RegisterBirthDateProps) => {
  return (
    <View className="flex-col">
      <Text className="typo-label1 text-semantic-text-primary">
        생일 (선택)
      </Text>
      <View className="h-2" />
      <SelectDate date={birthDate} onChangeDate={onChangeBirthDate} />
    </View>
  );
};

export default RegisterBirthDate;
