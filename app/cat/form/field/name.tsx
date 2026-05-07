import NameField from "@/components/settings/name-field";
import { Text, View } from "react-native";

interface RegisterCatNameProps {
  name: string;
  onChangeName: (text: string) => void;
}

const RegisterCatName = ({ name, onChangeName }: RegisterCatNameProps) => {
  return (
    <View className="flex-col">
      <NameField name={name} setName={onChangeName} />
      <View className="h-1.5" />
      <View className="flex-row justify-end w-full">
        <Text className="typo-label1 text-semantic-text-tertiary">
          {name.length}/16
        </Text>
      </View>
    </View>
  );
};

export default RegisterCatName;
