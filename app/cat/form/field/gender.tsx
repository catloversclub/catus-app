import { Gender } from "@/api/domains/cat/types";
import Select from "@/components/common/select";
import { Text, View } from "react-native";

interface RegisterGenderProps {
  gender: Gender | undefined;
  onChangeGender: (value: Gender) => void;
}

const RegisterGender = ({ gender, onChangeGender }: RegisterGenderProps) => {
  return (
    <View className="flex-col">
      <Text className="typo-label1 text-semantic-text-primary">성별</Text>
      <View className="h-2" />
      <Select
        options={[
          { label: "여자", value: "FEMALE" },
          { label: "남자", value: "MALE" },
          { label: "선택 안 함", value: "UNKNOWN" },
        ]}
        value={gender}
        onChange={onChangeGender}
      />
    </View>
  );
};

export default RegisterGender;
