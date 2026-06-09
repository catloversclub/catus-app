import * as MediaLibrary from "expo-media-library";
import { useState } from "react";

interface UsePhotoSelectionProps {
  selectionLimit: number;
  assets: MediaLibrary.Asset[];
  onConfirm: (uris: string[]) => void;
}

const usePhotoSelection = ({
  selectionLimit,
  assets,
  onConfirm,
}: UsePhotoSelectionProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState(false);

  const toggleSelection = (assetId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(assetId)) return prev.filter((id) => id !== assetId);
      if (selectionLimit <= 1) return [assetId];
      if (prev.length >= selectionLimit) return prev;
      return [...prev, assetId];
    });
  };

  const handleConfirm = async () => {
    if (selectedIds.length === 0) return;
    setIsResolving(true);
    const assetById = new Map(assets.map((asset) => [asset.id, asset]));

    try {
      const uris = await Promise.all(
        selectedIds.flatMap((id) => {
          const asset = assetById.get(id);
          if (!asset) return [];

          return MediaLibrary.getAssetInfoAsync(asset).then(
            (info) => info.localUri ?? info.uri,
          );
        }),
      );

      onConfirm(uris);
    } finally {
      setIsResolving(false);
    }
  };

  return { selectedIds, toggleSelection, handleConfirm, isResolving };
};

export { usePhotoSelection };
