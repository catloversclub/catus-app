import CameraIcon from "@/assets/icons/camera.svg";
import { useColors } from "@/hooks/use-colors";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const GRID_COLUMNS = 3;
const GRID_PADDING = 12;
const GRID_GAP = 6;

type ImagePickerGridItem =
  | { type: "camera" }
  | { type: "photo"; asset: MediaLibrary.Asset };

interface CameraCellProps {
  size: number;
  onPress: () => void;
}

const CameraCell = ({ size, onPress }: CameraCellProps) => {
  const { colors } = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center justify-center bg-semantic-bg-secondary"
      style={{ width: size, height: size }}
      activeOpacity={0.7}
    >
      <CameraIcon width={24} height={24} color={colors.icon.secondary} />
    </TouchableOpacity>
  );
};

interface PhotoCellProps {
  asset: MediaLibrary.Asset;
  size: number;
  selectionIndex: number;
  onPress: () => void;
}

const PhotoCell = ({
  asset,
  size,
  selectionIndex,
  onPress,
}: PhotoCellProps) => {
  const isSelected = selectionIndex >= 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ width: size, height: size }}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: asset.uri }}
        style={{ width: size, height: size }}
        contentFit="cover"
      />
      {isSelected && (
        <View className="absolute inset-0 border-2 border-semantic-border-accent" />
      )}
      <View
        className="absolute right-1.5 top-1.5 h-[22px] w-[22px] items-center justify-center rounded-full"
        style={{
          backgroundColor: isSelected ? "#FECF16" : "rgba(0,0,0,0.35)",
        }}
      >
        {isSelected && (
          <Text className="text-[11px] font-semibold text-[#1b1b1b]">
            {selectionIndex + 1}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface ImagePickerGridProps {
  assets: MediaLibrary.Asset[];
  width: number;
  selectedIds: string[];
  hasMore: boolean;
  onCameraPress: () => void;
  onPhotoPress: (assetId: string) => void;
  onLoadMore: () => void;
}

const ImagePickerGrid = ({
  assets,
  width,
  selectedIds,
  hasMore,
  onCameraPress,
  onPhotoPress,
  onLoadMore,
}: ImagePickerGridProps) => {
  const cellSize =
    (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  const data = useMemo<ImagePickerGridItem[]>(
    () => [
      { type: "camera" },
      ...assets.map((asset) => ({ type: "photo" as const, asset })),
    ],
    [assets],
  );
  const selectedIndexById = useMemo(
    () => new Map(selectedIds.map((id, index) => [id, index])),
    [selectedIds],
  );

  return (
    <FlatList
      style={{ flex: 1 }}
      data={data}
      numColumns={GRID_COLUMNS}
      keyExtractor={(item) =>
        item.type === "camera" ? "camera" : item.asset.id
      }
      renderItem={({ item }) => {
        if (item.type === "camera") {
          return <CameraCell size={cellSize} onPress={onCameraPress} />;
        }

        return (
          <PhotoCell
            asset={item.asset}
            size={cellSize}
            selectionIndex={selectedIndexById.get(item.asset.id) ?? -1}
            onPress={() => onPhotoPress(item.asset.id)}
          />
        );
      }}
      columnWrapperStyle={{ gap: GRID_GAP }}
      ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
      contentContainerStyle={{ paddingHorizontal: GRID_PADDING }}
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (hasMore) onLoadMore();
      }}
      onEndReachedThreshold={0.4}
    />
  );
};

export default ImagePickerGrid;
