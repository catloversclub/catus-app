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

  const handleConfirm = () => {
    if (selectedIds.length === 0) return;
    const assetUriById = new Map(assets.map((asset) => [asset.id, asset.uri]));
    const uris = selectedIds.flatMap((id) => {
      const uri = assetUriById.get(id);
      return uri ? [uri] : [];
    });
    onConfirm(uris);
  };

  return { selectedIds, toggleSelection, handleConfirm };
};

export { usePhotoSelection };
