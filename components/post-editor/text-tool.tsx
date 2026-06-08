import BottomActionBar from "@/components/layout/bottom-action-bar";
import { useContainedImageLayout } from "@/components/post-editor/contained-image-frame";
import EditorHeader from "@/components/post-editor/editor-header";
import { cn } from "@/lib/utils";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import ViewShot from "react-native-view-shot";

interface TextEntry {
  id: number;
  content: string;
  color: string;
}

const TextItem = ({ entry }: { entry: TextEntry }) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedRotation = useSharedValue(0);

  const dragGesture = Gesture.Pan().onChange((e) => {
    x.value += e.changeX;
    y.value += e.changeY;
  });

  const transformGesture = Gesture.Simultaneous(
    Gesture.Pinch()
      .onChange((e) => { scale.value = savedScale.value * e.scale; })
      .onEnd(() => { savedScale.value = scale.value; }),
    Gesture.Rotation()
      .onChange((e) => { rotation.value = savedRotation.value + e.rotation; })
      .onEnd(() => { savedRotation.value = rotation.value; }),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    alignSelf: "center",
    top: "40%",
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(dragGesture, transformGesture)}>
      <Animated.View style={animatedStyle}>
        <Text
          className="text-[28px] font-bold"
          style={{
            color: entry.color,
            textShadowColor: "rgba(0,0,0,0.5)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {entry.content}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

interface TextToolProps {
  uri: string;
  onSave: (editedUri: string) => void;
  onCancel: () => void;
}

const TextTool = ({ uri, onSave, onCancel }: TextToolProps) => {
  const [texts, setTexts] = useState<TextEntry[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");
  const viewShotRef = useRef<ViewShot>(null);
  const { layout: imageLayout, onLayout: handleCanvasLayout } =
    useContainedImageLayout(uri);

  const handleAddText = () => {
    if (!inputText.trim()) return;
    setTexts((prev) => [
      ...prev,
      { id: Date.now(), content: inputText.trim(), color: "#FFFFFF" },
    ]);
    setInputText("");
    setShowInput(false);
  };

  const handleUndo = () => {
    setTexts((prev) => prev.slice(0, -1));
  };

  const handleComplete = async () => {
    if (viewShotRef.current?.capture) {
      try {
        const editedUri = await viewShotRef.current.capture();
        onSave(editedUri);
      } catch (e) {
        console.error("TextTool save failed:", e);
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-990">
      <EditorHeader title="텍스트 입력" onBack={onCancel} />

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
                {texts.map((t) => (
                  <TextItem key={t.id} entry={t} />
                ))}
              </View>
            </ViewShot>
          )}
        </View>
      </View>

      <View className="items-center gap-6 px-3 py-3">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleUndo}
            className="w-11 h-11 rounded-full bg-gray-950 items-center justify-center"
          >
            <Text
              className={cn(
                "text-[18px]",
                texts.length > 0 ? "text-gray-0" : "text-[#555555]",
              )}
            >
              ↩
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowInput(true)}
            className="w-11 h-11 rounded-full bg-gray-950 items-center justify-center"
          >
            <Text className="text-gray-0 text-sm font-bold">T</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomActionBar
        containerClassName="bg-gray-990"
        buttons={[{ label: "완료", onPress: handleComplete }]}
      />

      <Modal visible={showInput} transparent animationType="fade">
        <View className="flex-1 bg-black/85 items-center justify-center p-6">
          <TextInput
            autoFocus
            className="min-h-[60px] w-full text-center text-[26px] font-bold text-white"
            value={inputText}
            onChangeText={setInputText}
            placeholder="문구를 입력하세요"
            placeholderTextColor="#666"
            multiline
          />
          <TouchableOpacity
            onPress={handleAddText}
            className="mt-6 bg-yellow-500 px-10 py-3 rounded-full"
          >
            <Text className="text-gray-990 text-base font-bold">확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default TextTool;
