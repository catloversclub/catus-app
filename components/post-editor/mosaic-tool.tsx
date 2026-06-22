import BottomActionBar from "@/components/layout/bottom-action-bar";
import { useContainedImageLayout } from "@/components/post-editor/contained-image-frame";
import { ScreenHeader } from "@/components/common/screen-header";
import { cn } from "@/lib/utils";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
      <Animated.View
        className="absolute overflow-hidden border border-yellow-500/50"
        style={animatedStyle}
      >
        <BlurView intensity={80} className="absolute inset-0" tint="dark" />
      </Animated.View>
    </GestureDetector>
  );
}

const MosaicTool = ({ uri, onSave, onCancel }: MosaicToolProps) => {
  const [mosaics, setMosaics] = useState<MosaicData[]>([]);
  const [selectedType, setSelectedType] = useState<"rect" | "circle">("rect");
  const viewShotRef = useRef<ViewShot>(null);
  const [history, setHistory] = useState<MosaicData[][]>([[]]);
  const { layout: imageLayout, onLayout: handleCanvasLayout } =
    useContainedImageLayout(uri);

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
    const maxX = Math.max((imageLayout?.width ?? 240) - 120, 0);
    const maxY = Math.max((imageLayout?.height ?? 240) - 120, 0);
    const newItem: MosaicData = {
      id: Date.now(),
      type,
      x: Math.min(60 + Math.random() * 100, maxX),
      y: Math.min(60 + Math.random() * 100, maxY),
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
      <ScreenHeader title="모자이크" onBack={onCancel} variant="editor" />

      <View className="flex-1 justify-center px-3 py-3">
        <View
          className="flex-1 w-full items-center justify-center overflow-hidden bg-black rounded-lg"
          onLayout={handleCanvasLayout}
        >
          {imageLayout && (
            <ViewShot
              ref={viewShotRef}
              options={{ format: "jpg", quality: 0.9 }}
              style={{
                position: "absolute",
                left: imageLayout.x,
                top: imageLayout.y,
                width: imageLayout.width,
                height: imageLayout.height,
              }}
            >
              <View className="flex-1 bg-black">
                <Image
                  source={{ uri }}
                  className="absolute inset-0"
                  contentFit="fill"
                />
                {mosaics.map((item) => (
                  <MosaicItem key={item.id} item={item} />
                ))}
              </View>
            </ViewShot>
          )}
        </View>
      </View>

      <View className="items-center gap-6 px-3 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={handleUndo}
            className="w-11 h-11 rounded-full bg-gray-950 items-center justify-center"
          >
            <Text
              className={cn(
                "text-[18px]",
                mosaics.length > 0 ? "text-gray-0" : "text-[#555555]",
              )}
            >
              ↩
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRedo}
            className="w-11 h-11 rounded-full bg-gray-950 items-center justify-center"
          >
            <Text className="text-[18px] text-[#555555]">↪</Text>
          </TouchableOpacity>

          <View className="w-px h-8 bg-gray-100/25" />

          <TouchableOpacity
            onPress={() => { setSelectedType("rect"); addMosaic("rect"); }}
            className={cn(
              "size-6 border",
              selectedType === "rect"
                ? "bg-gray-400 border-2 border-yellow-500"
                : "bg-[#555555] border-[#777777]",
            )}
          />
          <TouchableOpacity
            onPress={() => { setSelectedType("circle"); addMosaic("circle"); }}
            className={cn(
              "size-6 rounded-full border",
              selectedType === "circle"
                ? "bg-gray-400 border-2 border-yellow-500"
                : "bg-[#555555] border-[#777777]",
            )}
          />
        </View>
      </View>
      <BottomActionBar
        containerClassName="bg-gray-990"
        gradientColorScheme="dark"
        buttons={[{ label: "완료", onPress: handleComplete }]}
      />
    </View>
  );
}

export default MosaicTool;
