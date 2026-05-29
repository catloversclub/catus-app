import DeleteIcon from "@/assets/icons/delete.svg";
import IconButton from "@/components/common/icon-button";
import { useColors } from "@/hooks/use-colors";
import { Image, Text, View } from "react-native";
import { ViewedCat } from "./explore-idle-view";

interface ViewedCatItemProps {
  cat: ViewedCat;
  onDelete: (id: string) => void;
}

const ViewedCatItem = ({ cat, onDelete }: ViewedCatItemProps) => {
  const { colors } = useColors();

  return (
    <View className="flex-row items-center gap-3 pl-1.5 pr-3 py-3 rounded">
      <View className="size-9 rounded-full bg-semantic-bg-secondary overflow-hidden">
        {cat.imageUrl && (
          <Image
            source={{ uri: cat.imageUrl }}
            className="size-9"
            resizeMode="cover"
          />
        )}
      </View>
      <View className="flex-1 gap-0.5">
        <Text
          className="typo-body3 text-semantic-text-secondary"
          numberOfLines={1}
        >
          {cat.name}
        </Text>
        {cat.breed && (
          <Text
            className="typo-label1 text-semantic-text-tertiary"
            numberOfLines={1}
          >
            {cat.breed}
          </Text>
        )}
      </View>
      <IconButton onPress={() => onDelete(cat.id)} className="p-3">
        <DeleteIcon width={16} height={16} color={colors.icon.tertiary} />
      </IconButton>
    </View>
  );
};

export default ViewedCatItem;
