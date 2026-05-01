import Input from "@/components/common/input";
import { Text, View } from "react-native";

interface NameFieldProps {
  name: string;
  setName: (name: string) => void;
  placeholder?: string;
  isError?: boolean;
}

 const NameField = ({ name, setName, placeholder, isError }: NameFieldProps) => {
 return (
    <View className="flex-col gap-1.5">
      <Text className="typo-label1 text-semantic-text-primary">이름</Text>
      <Input
        value={name}
        onChangeText={setName}
        maxLength={16}
        placeholder={placeholder || "이름을 입력하세요."}
        isError={isError}
      />
    </View>
  );
}

export default NameField;
