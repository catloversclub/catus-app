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
    const selectedAssets = assets.filter((a) => selectedIds.includes(a.id));
    const infos = await Promise.all(
      selectedAssets.map((asset) => MediaLibrary.getAssetInfoAsync(asset)),
    );
    const uris = infos
      .map((info) => info.localUri ?? info.uri)
      .filter(Boolean) as string[];
    onConfirm(uris);
  };

  return { selectedIds, toggleSelection, handleConfirm };
};

export { usePhotoSelection };
