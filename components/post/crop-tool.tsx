import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import IconButton from "@/components/common/icon-button";
import { DARK } from "@/constants/editor-dark";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image as RNImage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CANVAS_SIZE = SCREEN_WIDTH - 24; // 12px padding each side

const RATIOS = ["자유", "1:1", "3:2", "4:3", "16:9"] as const;
type Ratio = (typeof RATIOS)[number];

interface CropToolProps {
  uri: string;
  onSave: (editedUri: string) => void;
  onCancel: () => void;
}

const CropTool = ({ uri, onSave, onCancel }: CropToolProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const [aspectRatio, setAspectRatio] = useState<Ratio>("자유");

  const boxX = useSharedValue(0);
  const boxY = useSharedValue(0);
  const boxWidth = useSharedValue(CANVAS_SIZE);
  const boxHeight = useSharedValue(CANVAS_SIZE);

  const RATIO_MAP: Record<string, number> = {
    "1:1": 1,
    "3:2": 3 / 2,
    "4:3": 4 / 3,
    "16:9": 16 / 9,
  };

  useEffect(() => {
    const ratio = RATIO_MAP[aspectRatio];
    if (!ratio) {
      return;
    }
    const w = CANVAS_SIZE;
    const h = w / ratio;
    boxWidth.value = w;
    boxHeight.value = Math.min(h, CANVAS_SIZE);
    boxX.value = 0;
    boxY.value = (CANVAS_SIZE - boxHeight.value) / 2;
  }, [aspectRatio]);

  const moveGesture = Gesture.Pan().onChange((e) => {
    const newX = boxX.value + e.changeX;
    const newY = boxY.value + e.changeY;
    if (newX >= 0 && newX + boxWidth.value <= CANVAS_SIZE) boxX.value = newX;
    if (newY >= 0 && newY + boxHeight.value <= CANVAS_SIZE) boxY.value = newY;
  });

  const resizeGesture = Gesture.Pan().onChange((e) => {
    const ratio = RATIO_MAP[aspectRatio];
    if (ratio) {
      const avg = (e.changeX + e.changeY) / 2;
      const newW = Math.max(50, Math.min(CANVAS_SIZE - boxX.value, boxWidth.value + avg));
      boxWidth.value = newW;
      boxHeight.value = newW / ratio;
    } else {
      const newW = Math.max(50, boxWidth.value + e.changeX);
      const newH = Math.max(50, boxHeight.value + e.changeY);
      if (boxX.value + newW <= CANVAS_SIZE) boxWidth.value = newW;
      if (boxY.value + newH <= CANVAS_SIZE) boxHeight.value = newH;
    }
  });

  const handleRotate = () => {
    const prevW = boxWidth.value;
    const prevH = boxHeight.value;
    boxWidth.value = Math.min(prevH, CANVAS_SIZE);
    boxHeight.value = Math.min(prevW, CANVAS_SIZE);
    boxX.value = (CANVAS_SIZE - boxWidth.value) / 2;
    boxY.value = (CANVAS_SIZE - boxHeight.value) / 2;
  };

  const handleCrop = async () => {
    try {
      const { width, height } = await new Promise<{ width: number; height: number }>(
        (resolve, reject) =>
          RNImage.getSize(uri, (w, h) => resolve({ width: w, height: h }), reject),
      );
      const scale = width / CANVAS_SIZE;
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{
          crop: {
            originX: Math.round(boxX.value * scale),
            originY: Math.round(boxY.value * scale),
            width: Math.round(boxWidth.value * scale),
            height: Math.round(boxHeight.value * scale),
          },
        }],
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
    <View style={{ flex: 1, backgroundColor: DARK.bg, paddingTop: top }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", height: 52, paddingHorizontal: 12 }}>
        <IconButton onPress={onCancel} className="p-3">
          <ArrowLeftIcon width={20} height={20} color={DARK.text} />
        </IconButton>
        <Text style={{ flex: 1, textAlign: "center", color: DARK.text, fontSize: 16, fontWeight: "600", letterSpacing: -0.32, marginRight: 44 }}>
          자르기
        </Text>
      </View>

      {/* Image + crop overlay */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, position: "relative" }}>
          <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="contain" />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.55)" }]} />
          <GestureDetector gesture={moveGesture}>
            <Animated.View style={[styles.cropBox, boxStyle]}>
              {/* Grid lines */}
              <View style={StyleSheet.absoluteFill}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View style={{ flex: 1, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: "rgba(255,255,255,0.4)" }} />
                  <View style={{ flex: 1, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: "rgba(255,255,255,0.4)" }} />
                  <View style={{ flex: 1 }} />
                </View>
              </View>
              <View style={StyleSheet.absoluteFill}>
                <View style={{ flex: 1, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.4)" }} />
                <View style={{ flex: 1, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.4)" }} />
                <View style={{ flex: 1 }} />
              </View>
              {/* Corner handles */}
              <View style={[styles.corner, { top: -1, left: -1 }]} />
              <View style={[styles.corner, { top: -1, right: -1, transform: [{ scaleX: -1 }] }]} />
              <View style={[styles.corner, { bottom: -1, left: -1, transform: [{ scaleY: -1 }] }]} />
              {/* Resize handle */}
              <GestureDetector gesture={resizeGesture}>
                <View style={[styles.corner, { bottom: -1, right: -1, transform: [{ scale: -1 }] }]} />
              </GestureDetector>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>

      {/* Bottom panel */}
      <View style={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: Math.max(bottom, 12) + 12, gap: 16, alignItems: "center" }}>
        {/* Rotate button */}
        <TouchableOpacity
          onPress={handleRotate}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#fdfdfd", borderWidth: 1, borderColor: "#e7e7e7", alignItems: "center", justifyContent: "center" }}
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
                backgroundColor: aspectRatio === ratio ? DARK.yellow : DARK.bgSecondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: aspectRatio === ratio ? DARK.yellowText : DARK.textMuted }}>
                {ratio}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 완료 */}
        <TouchableOpacity
          onPress={handleCrop}
          style={{ backgroundColor: DARK.yellow, borderRadius: 4, height: 50, alignItems: "center", justifyContent: "center", width: "100%" }}
        >
          <Text style={{ color: DARK.yellowText, fontSize: 16, fontWeight: "600", letterSpacing: -0.32 }}>
            완료
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
