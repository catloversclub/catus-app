import { Image } from "expo-image";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  ImageStyle,
  LayoutChangeEvent,
  Image as RNImage,
  StyleProp,
  View,
} from "react-native";

export interface ContainedImageLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  containerWidth: number;
  containerHeight: number;
  naturalWidth: number;
  naturalHeight: number;
}

interface ContainedImageFrameProps {
  uri: string;
  borderRadius?: number;
  children?: (layout: ContainedImageLayout) => ReactNode;
  imageClassName?: string;
  imageStyle?: StyleProp<ImageStyle>;
  onImageLayout?: (layout: ContainedImageLayout | null) => void;
}

export const getContainedImageLayout = ({
  containerWidth,
  containerHeight,
  naturalWidth,
  naturalHeight,
}: {
  containerWidth: number;
  containerHeight: number;
  naturalWidth: number;
  naturalHeight: number;
}): ContainedImageLayout => {
  const containerRatio = containerWidth / containerHeight;
  const imageRatio = naturalWidth / naturalHeight;

  const width =
    imageRatio > containerRatio ? containerWidth : containerHeight * imageRatio;
  const height =
    imageRatio > containerRatio ? containerWidth / imageRatio : containerHeight;

  return {
    x: (containerWidth - width) / 2,
    y: (containerHeight - height) / 2,
    width,
    height,
    containerWidth,
    containerHeight,
    naturalWidth,
    naturalHeight,
  };
};

export const useContainedImageLayout = (uri: string) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let isMounted = true;

    RNImage.getSize(
      uri,
      (width, height) => {
        if (isMounted) {
          setNaturalSize({ width, height });
        }
      },
      () => {
        if (isMounted) {
          setNaturalSize({ width: 0, height: 0 });
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, [uri]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  }, []);

  const layout = useMemo(
    () =>
      containerSize.width > 0 &&
      containerSize.height > 0 &&
      naturalSize.width > 0 &&
      naturalSize.height > 0
        ? getContainedImageLayout({
            containerWidth: containerSize.width,
            containerHeight: containerSize.height,
            naturalWidth: naturalSize.width,
            naturalHeight: naturalSize.height,
          })
        : null,
    [
      containerSize.height,
      containerSize.width,
      naturalSize.height,
      naturalSize.width,
    ],
  );

  return { layout, onLayout };
};

const ContainedImageFrame = ({
  uri,
  borderRadius = 8,
  children,
  imageClassName,
  imageStyle,
  onImageLayout,
}: ContainedImageFrameProps) => {
  const { layout, onLayout } = useContainedImageLayout(uri);

  useEffect(() => {
    onImageLayout?.(layout);
  }, [layout, onImageLayout]);

  return (
    <View
      className="flex-1 w-full items-center justify-center overflow-hidden "
      onLayout={onLayout}
      style={{ borderRadius }}
    >
      {layout && (
        <>
          <Image
            source={{ uri }}
            className={imageClassName}
            contentFit="fill"
            style={[
              {
                position: "absolute",
                left: layout.x,
                top: layout.y,
                width: layout.width,
                height: layout.height,
                borderRadius,
              },
              imageStyle,
            ]}
          />
          {children?.(layout)}
        </>
      )}
    </View>
  );
};

export default ContainedImageFrame;
