import ActionPressable from "@/components/common/action-pressable";
import ContainedImageFrame from "@/components/post-editor/contained-image-frame";
import { CarouselDots } from "@/components/post/carousel-indicator";
import { useRef, useState } from "react";
import { View } from "react-native";
import PagerView from "react-native-pager-view";

interface ImagePagerProps {
  images: string[];
  height?: number;
  onImagePress?: (uri: string, index: number) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showIndicator?: boolean;
  imageClassName?: string;
}

const ImagePager = ({
  images,
  height,
  onImagePress,
  currentPage,
  onPageChange,
  showIndicator = true,
  imageClassName,
}: ImagePagerProps) => {
  const pagerRef = useRef<PagerView>(null);
  const [internalPage, setInternalPage] = useState(0);
  const activePage = currentPage ?? internalPage;

  if (images.length === 0) return null;

  return (
    <View className={height ? "gap-3" : "flex-1 gap-3"}>
      <PagerView
        ref={pagerRef}
        style={height ? { height } : { flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => {
          const nextPage = e.nativeEvent.position;
          setInternalPage(nextPage);
          onPageChange?.(nextPage);
        }}
      >
        {images.map((uri, index) => (
          <ActionPressable
            key={index}
            onPress={() => onImagePress?.(uri, index)}
            disabled={!onImagePress}
            className="flex-1"
          >
            <View className="flex-1 items-center justify-center relative">
              <ContainedImageFrame uri={uri} imageClassName={imageClassName} />
            </View>
          </ActionPressable>
        ))}
      </PagerView>

      {showIndicator && images.length > 1 && (
        <CarouselDots
          count={images.length}
          current={activePage}
          onDotPress={(pageIndex) => pagerRef.current?.setPage(pageIndex)}
        />
      )}
    </View>
  );
};

export default ImagePager;
