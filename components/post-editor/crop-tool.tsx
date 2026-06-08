import BottomActionBar from "@/components/layout/bottom-action-bar";
import ContainedImageFrame, {
  ContainedImageLayout,
} from "@/components/post-editor/contained-image-frame";
import EditorHeader from "@/components/post-editor/editor-header";
import { cn } from "@/lib/utils";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const RATIOS = ["자유", "1:1", "3:2", "4:3", "16:9"] as const;
type Ratio = (typeof RATIOS)[number];
const RATIO_MAP: Record<string, number> = {
  "1:1": 1,
  "3:2": 3 / 2,
  "4:3": 4 / 3,
  "16:9": 16 / 9,
};

interface CropToolProps {
  uri: string;
  onSave: (editedUri: string) => void;
  onCancel: () => void;
}

const CropTool = ({ uri, onSave, onCancel }: CropToolProps) => {
  const [aspectRatio, setAspectRatio] = useState<Ratio>("자유");
  const [isCropping, setIsCropping] = useState(false);
  const [imageLayout, setImageLayout] = useState<ContainedImageLayout | null>(
    null,
  );

  const boxX = useSharedValue(0);
  const boxY = useSharedValue(0);
  const boxWidth = useSharedValue(0);
  const boxHeight = useSharedValue(0);
  const canvasWidth = useSharedValue(0);
  const canvasHeight = useSharedValue(0);

  useEffect(() => {
    if (!imageLayout) {
      return;
    }

    canvasWidth.value = imageLayout.width;
    canvasHeight.value = imageLayout.height;

    const ratio = RATIO_MAP[aspectRatio];
    if (!ratio) {
      boxWidth.value = imageLayout.width;
      boxHeight.value = imageLayout.height;
      boxX.value = 0;
      boxY.value = 0;
      return;
    }

    const widthByHeight = imageLayout.height * ratio;
    const w = Math.min(imageLayout.width, widthByHeight);
    const h = w / ratio;
    boxWidth.value = w;
    boxHeight.value = h;
    boxX.value = (imageLayout.width - w) / 2;
    boxY.value = (imageLayout.height - h) / 2;
  }, [
    aspectRatio,
    boxHeight,
    boxWidth,
    boxX,
    boxY,
    canvasHeight,
    canvasWidth,
    imageLayout,
  ]);

  const moveGesture = Gesture.Pan().onChange((e) => {
    if (canvasWidth.value <= 0 || canvasHeight.value <= 0) {
      return;
    }

    const newX = boxX.value + e.changeX;
    const newY = boxY.value + e.changeY;
    if (newX >= 0 && newX + boxWidth.value <= canvasWidth.value) {
      boxX.value = newX;
    }
    if (newY >= 0 && newY + boxHeight.value <= canvasHeight.value) {
      boxY.value = newY;
    }
  });

  const resizeGesture = Gesture.Pan().onChange((e) => {
    if (canvasWidth.value <= 0 || canvasHeight.value <= 0) {
      return;
    }

    const ratio = RATIO_MAP[aspectRatio];
    if (ratio) {
      const avg = (e.changeX + e.changeY) / 2;
      const newW = Math.max(
        50,
        Math.min(canvasWidth.value - boxX.value, boxWidth.value + avg),
      );
      const newH = newW / ratio;
      if (boxY.value + newH <= canvasHeight.value) {
        boxWidth.value = newW;
        boxHeight.value = newH;
      }
    } else {
      const newW = Math.max(50, boxWidth.value + e.changeX);
      const newH = Math.max(50, boxHeight.value + e.changeY);
      if (boxX.value + newW <= canvasWidth.value) boxWidth.value = newW;
      if (boxY.value + newH <= canvasHeight.value) boxHeight.value = newH;
    }
  });

  const handleRotate = () => {
    if (!imageLayout) {
      return;
    }

    const prevW = boxWidth.value;
    const prevH = boxHeight.value;
    boxWidth.value = Math.min(prevH, imageLayout.width);
    boxHeight.value = Math.min(prevW, imageLayout.height);
    boxX.value = (imageLayout.width - boxWidth.value) / 2;
    boxY.value = (imageLayout.height - boxHeight.value) / 2;
  };

  const handleCrop = async () => {
    if (!imageLayout) {
      return;
    }

    setIsCropping(true);
    try {
      const scaleX = imageLayout.naturalWidth / imageLayout.width;
      const scaleY = imageLayout.naturalHeight / imageLayout.height;
      const originX = Math.max(
        0,
        Math.min(
          imageLayout.naturalWidth - 1,
          Math.round(boxX.value * scaleX),
        ),
      );
      const originY = Math.max(
        0,
        Math.min(
          imageLayout.naturalHeight - 1,
          Math.round(boxY.value * scaleY),
        ),
      );
      const width = Math.max(
        1,
        Math.min(
          imageLayout.naturalWidth - originX,
          Math.round(boxWidth.value * scaleX),
        ),
      );
      const height = Math.max(
        1,
        Math.min(
          imageLayout.naturalHeight - originY,
          Math.round(boxHeight.value * scaleY),
        ),
      );
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: {
              originX,
              originY,
              width,
              height,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
      );
      onSave(result.uri);
    } catch (e) {
      console.error("Crop failed:", e);
    } finally {
      setIsCropping(false);
    }
  };

  const boxStyle = useAnimatedStyle(() => ({
    top: boxY.value,
    left: boxX.value,
    width: boxWidth.value,
    height: boxHeight.value,
  }));

  return (
    <View className="flex-1 bg-gray-990">
      <EditorHeader title="자르기" onBack={onCancel} />

      <View className="flex-1 justify-center px-3 py-3">
        <ContainedImageFrame uri={uri} onImageLayout={setImageLayout}>
          {(layout) => {
            return (
              <View
                className="absolute"
                style={{
                  left: layout.x,
                  top: layout.y,
                  width: layout.width,
                  height: layout.height,
                }}
              >
                <View className="absolute inset-0 bg-black/55" />
                <GestureDetector gesture={moveGesture}>
                  <Animated.View
                    className="absolute border-[1.5px] border-white bg-transparent"
                    style={boxStyle}
                  >
                    <View className="absolute inset-0">
                      <View className="flex-1 flex-row">
                        <View className="flex-1 border-r-hairline border-white/40" />
                        <View className="flex-1 border-r-hairline border-white/40" />
                        <View className="flex-1" />
                      </View>
                    </View>
                    <View className="absolute inset-0">
                      <View className="flex-1 border-b-hairline border-white/40" />
                      <View className="flex-1 border-b-hairline border-white/40" />
                      <View className="flex-1" />
                    </View>
                    <View className="absolute top-[-1px] left-[-1px] size-5 border-l-[2.5px] border-t-[2.5px] border-white" />
                    <View
                      className="absolute top-[-1px] right-[-1px] size-5 border-l-[2.5px] border-t-[2.5px] border-white"
                      style={{ transform: [{ scaleX: -1 }] }}
                    />
                    <View
                      className="absolute bottom-[-1px] left-[-1px] size-5 border-l-[2.5px] border-t-[2.5px] border-white"
                      style={{ transform: [{ scaleY: -1 }] }}
                    />
                    <GestureDetector gesture={resizeGesture}>
                      <View
                        className="absolute bottom-[-1px] right-[-1px] size-5 border-l-[2.5px] border-t-[2.5px] border-white"
                        style={{ transform: [{ scale: -1 }] }}
                      />
                    </GestureDetector>
                  </Animated.View>
                </GestureDetector>
              </View>
            );
          }}
        </ContainedImageFrame>
      </View>

      <View className="items-center gap-4 px-3 py-3">
        <TouchableOpacity
          onPress={handleRotate}
          className="size-11 rounded-full bg-gray-0 border border-gray-100 items-center justify-center"
        >
          <Text className="text-[18px] text-gray-990">↻</Text>
        </TouchableOpacity>

        <View className="flex-row gap-1.5">
          {RATIOS.map((ratio) => (
            <TouchableOpacity
              key={ratio}
              onPress={() => setAspectRatio(ratio)}
              className={cn(
                "w-12 h-[26px] rounded items-center justify-center",
                aspectRatio === ratio ? "bg-yellow-500" : "bg-gray-950",
              )}
            >
              <Text
                className={cn(
                  "text-xs font-semibold",
                  aspectRatio === ratio ? "text-gray-990" : "text-gray-100",
                )}
              >
                {ratio}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <BottomActionBar
        containerClassName="bg-gray-990"
        buttons={[
          {
            label: "완료",
            onPress: handleCrop,
            disabled: !imageLayout,
            isPending: isCropping,
          },
        ]}
      />
    </View>
  );
};

export default CropTool;
