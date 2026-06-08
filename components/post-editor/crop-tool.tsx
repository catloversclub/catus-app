import BottomActionBar from "@/components/layout/bottom-action-bar";
import ContainedImageFrame, {
  ContainedImageLayout,
} from "@/components/post-editor/contained-image-frame";
import EditorHeader from "@/components/post-editor/editor-header";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const RATIOS = ["자유", "1:1", "3:2", "4:3", "16:9"] as const;
type Ratio = (typeof RATIOS)[number];
const EDITOR_COLORS = {
  bgSecondary: "#303030", // gray-950
  text: "#FDFDFD", // gray-0
  textMuted: "#E7E7E7", // gray-100
  yellow: "#FECF16", // yellow-500
  yellowText: "#1B1B1B", // gray-990
} as const;
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

    try {
      const scaleX = imageLayout.naturalWidth / imageLayout.width;
      const scaleY = imageLayout.naturalHeight / imageLayout.height;
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: {
              originX: Math.round(boxX.value * scaleX),
              originY: Math.round(boxY.value * scaleY),
              width: Math.round(boxWidth.value * scaleX),
              height: Math.round(boxHeight.value * scaleY),
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
      );
      onSave(result.uri);
    } catch (e) {
      console.error("Crop failed:", e);
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
                style={{
                  position: "absolute",
                  left: layout.x,
                  top: layout.y,
                  width: layout.width,
                  height: layout.height,
                }}
              >
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: "rgba(0,0,0,0.55)" },
                  ]}
                />
                <GestureDetector gesture={moveGesture}>
                  <Animated.View style={[styles.cropBox, boxStyle]}>
                    <View style={StyleSheet.absoluteFill}>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <View
                          style={{
                            flex: 1,
                            borderRightWidth: StyleSheet.hairlineWidth,
                            borderRightColor: "rgba(255,255,255,0.4)",
                          }}
                        />
                        <View
                          style={{
                            flex: 1,
                            borderRightWidth: StyleSheet.hairlineWidth,
                            borderRightColor: "rgba(255,255,255,0.4)",
                          }}
                        />
                        <View style={{ flex: 1 }} />
                      </View>
                    </View>
                    <View style={StyleSheet.absoluteFill}>
                      <View
                        style={{
                          flex: 1,
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: "rgba(255,255,255,0.4)",
                        }}
                      />
                      <View
                        style={{
                          flex: 1,
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: "rgba(255,255,255,0.4)",
                        }}
                      />
                      <View style={{ flex: 1 }} />
                    </View>
                    <View style={[styles.corner, { top: -1, left: -1 }]} />
                    <View
                      style={[
                        styles.corner,
                        { top: -1, right: -1, transform: [{ scaleX: -1 }] },
                      ]}
                    />
                    <View
                      style={[
                        styles.corner,
                        { bottom: -1, left: -1, transform: [{ scaleY: -1 }] },
                      ]}
                    />
                    <GestureDetector gesture={resizeGesture}>
                      <View
                        style={[
                          styles.corner,
                          {
                            bottom: -1,
                            right: -1,
                            transform: [{ scale: -1 }],
                          },
                        ]}
                      />
                    </GestureDetector>
                  </Animated.View>
                </GestureDetector>
              </View>
            );
          }}
        </ContainedImageFrame>
      </View>

      {/* Bottom panel */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 12,
          paddingBottom: 12,
          gap: 16,
          alignItems: "center",
        }}
      >
        {/* Rotate button */}
        <TouchableOpacity
          onPress={handleRotate}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#fdfdfd",
            borderWidth: 1,
            borderColor: "#e7e7e7",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: "#1b1b1b" }}>↻</Text>
        </TouchableOpacity>

        {/* Ratio chips */}
        <View style={{ flexDirection: "row", gap: 6 }}>
          {RATIOS.map((ratio) => (
            <TouchableOpacity
              key={ratio}
              onPress={() => setAspectRatio(ratio)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 4,
                backgroundColor:
                  aspectRatio === ratio
                    ? EDITOR_COLORS.yellow
                    : EDITOR_COLORS.bgSecondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color:
                    aspectRatio === ratio
                      ? EDITOR_COLORS.yellowText
                      : EDITOR_COLORS.textMuted,
                }}
              >
                {ratio}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <BottomActionBar buttons={[{ label: "완료", onPress: handleCrop }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  cropBox: {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "#fff",
    backgroundColor: "transparent",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: "#fff",
  },
});

export default CropTool;
