import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useRef, useState } from "react";

const useGalleryAssets = (isGalleryPermissionGranted: boolean) => {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const loadPhotos = useCallback(async (cursor?: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const result = await MediaLibrary.getAssetsAsync({
        first: 60,
        mediaType: MediaLibrary.MediaType.photo,
        after: cursor,
      });
      setAssets((prev) =>
        cursor ? [...prev, ...result.assets] : result.assets,
      );
      setEndCursor(result.endCursor);
      setHasMore(result.hasNextPage);
    } finally {
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (isGalleryPermissionGranted) {
      loadPhotos();
    }
  }, [isGalleryPermissionGranted, loadPhotos]);

  return { assets, hasMore, endCursor, loadPhotos };
};

export { useGalleryAssets };
