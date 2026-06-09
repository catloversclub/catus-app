import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { FlatList, useWindowDimensions, View, ViewToken } from "react-native";

import ImagePressable from "@/components/common/image-pressable";
import ImageViewerModal from "@/components/common/image-viewer-modal";
import { CAROUSEL_CONFIG } from "@/constants/config";
import { Skeleton } from "@/components/ui/skeleton";
import { CarouselCounter, CarouselDots } from "@/components/post/carousel-indicator";

const aspectRatioCache = new Map<string, number>();

interface Origin {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CarouselImage {
  id: string;
  url: string;
}

export interface ImageCarouselProps {
  images: CarouselImage[];
  catName?: string;
  postId?: string;
  overlay?: React.ReactNode;
  linkable?: boolean;
  onFirstImageReady?: () => void;
}

interface CarouselItemProps {
  item: CarouselImage;
  index: number;
  catName: string;
  carouselWidth: number;
  imageHeight: number;
  linkable: boolean;
  postId: string;
  onOpenViewer: (url: string, origin: Origin) => void;
  onFirstImageLoad?: () => void;
}

const CarouselItem = ({
  item,
  index,
  catName,
  carouselWidth,
  imageHeight,
  linkable,
  postId,
  onOpenViewer,
  onFirstImageLoad,
}: CarouselItemProps) => {
  const viewRef = useRef<View>(null);

  const handlePress = () => {
    if (linkable) {
      router.push(`/post/${postId}`);
      return;
    }
    viewRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0) onOpenViewer(item.url, { x, y, width, height });
    });
  };

  return (
    <ImagePressable onPress={handlePress}>
      <View ref={viewRef}>
        <Image
          source={{ uri: item.url }}
          alt={`${catName} photo ${index + 1}`}
          style={{ width: carouselWidth, height: imageHeight }}
          contentFit="cover"
          transition={200}
          onLoad={onFirstImageLoad}
        />
      </View>
    </ImagePressable>
  );
};

const ImageCarousel = ({
  images,
  catName = "",
  postId = "",
  overlay,
  linkable = true,
  onFirstImageReady,
}: ImageCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [showGradient, setShowGradient] = useState(false);
  const [viewerState, setViewerState] = useState<{
    url: string;
    origin: Origin;
  } | null>(null);
  const { width } = useWindowDimensions();
  const carouselWidth = width - 24;

  const firstUrl = images[0]?.url;
  const cached = firstUrl ? aspectRatioCache.get(firstUrl) : null;
  const [imageHeight, setImageHeight] = useState<number | null>(
    cached != null ? carouselWidth * cached : null,
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<CarouselImage>[] }) => {
      if (viewableItems.length > 0) {
        setCurrent(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  if (imageHeight === null) {
    return (
      <>
        {images[0] && (
          <View style={{ height: 0, overflow: "hidden" }}>
            <Image
              source={{ uri: images[0].url }}
              style={{ width: carouselWidth, height: carouselWidth }}
              onLoad={(e) => {
                const { width: w, height: h } = e.source;
                if (w > 0) {
                  if (firstUrl) aspectRatioCache.set(firstUrl, h / w);
                  setImageHeight(carouselWidth * (h / w));
                }
              }}
            />
          </View>
        )}
        <Skeleton style={{ width: carouselWidth, height: carouselWidth, borderRadius: 6 }} />
      </>
    );
  }

  return (
    <>
      <View style={{ overflow: "hidden", borderRadius: 6 }}>
        <FlatList
          data={images}
          keyExtractor={(image) => image.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={CAROUSEL_CONFIG}
          renderItem={({ item, index }) => (
            <CarouselItem
              item={item}
              index={index}
              catName={catName}
              carouselWidth={carouselWidth}
              imageHeight={imageHeight}
              linkable={linkable}
              postId={postId}
              onOpenViewer={(url, origin) => setViewerState({ url, origin })}
              onFirstImageLoad={index === 0 ? () => {
                setShowGradient(true);
                onFirstImageReady?.();
              } : undefined}
            />
          )}
        />

        {showGradient && (
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
            }}
            pointerEvents="none"
          />
        )}

        {images.length > 1 && (
          <CarouselCounter current={current} total={images.length} />
        )}

        {overlay}
      </View>

      {images.length > 1 && (
        <CarouselDots count={images.length} current={current} />
      )}

      {!linkable && (
        <ImageViewerModal
          visible={viewerState !== null}
          source={{ uri: viewerState?.url ?? "" }}
          origin={viewerState?.origin}
          onClose={() => setViewerState(null)}
        />
      )}
    </>
  );
};

export default ImageCarousel;
