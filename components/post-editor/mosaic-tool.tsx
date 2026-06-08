import BottomActionBar from "@/components/layout/bottom-action-bar";
import EditorHeader from "@/components/post-editor/editor-header";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import ViewShot from "react-native-view-shot";

interface MosaicData {
  id: number;
  type: "rect" | "circle";
  x: number;
  y: number;
  size: number;
}

const EDITOR_COLORS = {
  bgSecondary: "#303030", // gray-950
  text: "#FDFDFD", // gray-0
  disabled: "#555555",
  separator: "rgba(231,231,231,0.25)", // gray-100/25
  yellow: "#FECF16", // yellow-500
  yellowText: "#1B1B1B", // gray-990
} as const;

interface MosaicToolProps {
  uri: string;
  onSave: (editedUri: string) => void;
  onCancel: () => void;
}

const MosaicItem = ({ item }: { item: MosaicData }) => {
  const x = useSharedValue(item.x);
  const y = useSharedValue(item.y);

  const moveGesture = Gesture.Pan().onChange((e) => {
    x.value += e.changeX;
    y.value += e.changeY;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    width: item.size,
    height: item.size,
    borderRadius: item.type === "circle" ? item.size / 2 : 0,
  }));

  return (
    <GestureDetector gesture={moveGesture}>
      <Animated.View style={[animatedStyle, styles.mosaicBox]}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
      </Animated.View>
    </GestureDetector>
  );
}

const MosaicTool = ({ uri, onSave, onCancel }: MosaicToolProps) => {
  const [mosaics, setMosaics] = useState<MosaicData[]>([]);
  const [selectedType, setSelectedType] = useState<"rect" | "circle">("rect");
  const viewShotRef = useRef<ViewShot>(null);
  const [history, setHistory] = useState<MosaicData[][]>([[]]);

  const handleComplete = async () => {
    if (viewShotRef.current?.capture) {
      try {
        const editedUri = await viewShotRef.current.capture();
        onSave(editedUri);
      } catch (e) {
        console.error("Mosaic save failed:", e);
      }
    }
  };

  const addMosaic = (type: "rect" | "circle") => {
    const newItem: MosaicData = {
      id: Date.now(),
      type,
      x: 60 + Math.random() * 100,
      y: 60 + Math.random() * 100,
      size: 80,
    };
    const next = [...mosaics, newItem];
    setMosaics(next);
    setHistory((prev) => [...prev, next]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const prev = history[history.length - 2];
    setMosaics(prev);
    setHistory((h) => h.slice(0, -1));
  };

  const handleRedo = () => {
    // redo not tracked in this simple implementation
  };

  return (
    <View className="flex-1 bg-gray-990">
      <EditorHeader title="모자이크" onBack={onCancel} />

      {/* Canvas */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: "jpg", quality: 0.9 }}
          style={{ width: "100%", aspectRatio: 1 }}
        >
          <View style={{ flex: 1, backgroundColor: "#000" }}>
            <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="contain" />
            {mosaics.map((item) => (
              <MosaicItem key={item.id} item={item} />
            ))}
          </View>
        </ViewShot>
      </View>

      {/* Bottom panel */}
      <View style={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 12, gap: 24, alignItems: "center" }}>
        {/* Controls row */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {/* Undo */}
          <TouchableOpacity
            onPress={handleUndo}
            className="w-11 h-11 rounded-full bg-gray-950 items-center justify-center"
          >
            <Text style={{ color: mosaics.length > 0 ? EDITOR_COLORS.text : EDITOR_COLORS.disabled, fontSize: 18 }}>↩</Text>
          </TouchableOpacity>
          {/* Redo */}
          <TouchableOpacity
            onPress={handleRedo}
            className="w-11 h-11 rounded-full bg-gray-950 items-center justify-center"
          >
            <Text style={{ color: EDITOR_COLORS.disabled, fontSize: 18 }}>↪</Text>
          </TouchableOpacity>

          {/* Separator */}
          <View style={{ width: 1, height: 32, backgroundColor: EDITOR_COLORS.separator }} />

          {/* Rect brush */}
          <TouchableOpacity
            onPress={() => { setSelectedType("rect"); addMosaic("rect"); }}
            style={{
              width: 24,
              height: 24,
              backgroundColor: selectedType === "rect" ? "#aaa" : "#555",
              borderWidth: selectedType === "rect" ? 2 : 1,
              borderColor: selectedType === "rect" ? EDITOR_COLORS.yellow : "#777",
            }}
          />
          {/* Circle brush */}
          <TouchableOpacity
            onPress={() => { setSelectedType("circle"); addMosaic("circle"); }}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: selectedType === "circle" ? "#aaa" : "#555",
              borderWidth: selectedType === "circle" ? 2 : 1,
              borderColor: selectedType === "circle" ? EDITOR_COLORS.yellow : "#777",
            }}
          />
        </View>

      </View>
      <BottomActionBar buttons={[{ label: "완료", onPress: handleComplete }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  mosaicBox: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.5)",
  },
});

export default MosaicTool;
