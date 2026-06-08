import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import IconButton from "@/components/common/icon-button";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface EditorHeaderProps {
  title: string;
  onBack: () => void;
}

const EditorHeader = ({ title, onBack }: EditorHeaderProps) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top }}>
      <View className="flex-row items-center h-[52px] px-3">
        <IconButton onPress={onBack} className="p-3">
          <ArrowLeftIcon width={20} height={20} color="#FDFDFD" />
        </IconButton>
        <Text className="flex-1 text-center text-gray-0 typo-body1 mr-11">
          {title}
        </Text>
      </View>
    </View>
  );
};

export default EditorHeader;
