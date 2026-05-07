import SelectBreed from "@/components/cat/select-breed";
import { Text, View } from "react-native";

interface RegisterBreedProps {
  breed: string | null;
  onChangeBreed: (breed: string | null) => void;
  onBreedOpen: () => void;
  onLayout: (y: number) => void;
}

const RegisterBreed = ({
  breed,
  onChangeBreed,
  onBreedOpen,
  onLayout,
}: RegisterBreedProps) => {
  return (
    <View
      onLayout={(e) => onLayout(e.nativeEvent.layout.y)}
      className="flex-col"
    >
      <Text className="typo-label1 text-semantic-text-primary">
        품종 (선택)
      </Text>
      <View className="h-2" />
      <SelectBreed
        breed={breed}
        onChangeBreed={onChangeBreed}
        onBreedOpen={onBreedOpen}
      />
    </View>
  );
};

export default RegisterBreed;
