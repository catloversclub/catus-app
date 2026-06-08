import BottomActionBar from "@/components/layout/bottom-action-bar";
import EditorHeader from "@/components/post-editor/editor-header";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
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
import ViewShot from "react-native-view-shot";

interface TextEntry {
  id: number;
  content: string;
  color: string;
}

const EDITOR_COLORS = {
  text: "#FDFDFD", // gray-0
  disabled: "#555555",
  yellowText: "#1B1B1B", // gray-990
} as const;

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
        <Text style={{ color: entry.color, fontSize: 28, fontWeight: "bold", textShadowColor: "rgba(0,0,0,0.5)", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }}>
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

      {/* Canvas */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: "jpg", quality: 0.9 }}
          style={{ width: "100%", aspectRatio: 1 }}
        >
          <View style={{ flex: 1, backgroundColor: "#000" }}>
            <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="contain" />
            {texts.map((t) => (
              <TextItem key={t.id} entry={t} />
            ))}
          </View>
        </ViewShot>
      </View>

      {/* Bottom panel */}
      <View style={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 12, gap: 24, alignItems: "center" }}>
        {/* Controls row */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          {/* Undo */}
          <TouchableOpacity
            onPress={handleUndo}
            className="w-11 h-11 rounded-full bg-gray-950 items-center justify-center"
          >
            <Text style={{ color: texts.length > 0 ? EDITOR_COLORS.text : EDITOR_COLORS.disabled, fontSize: 18 }}>↩</Text>
          </TouchableOpacity>
          {/* Add text */}
          <TouchableOpacity
            onPress={() => setShowInput(true)}
            className="w-11 h-11 rounded-full bg-gray-950 items-center justify-center"
          >
            <Text className="text-gray-0 text-sm font-bold">T</Text>
          </TouchableOpacity>
        </View>

      </View>
      <BottomActionBar buttons={[{ label: "완료", onPress: handleComplete }]} />

      {/* Text input overlay */}
      <Modal visible={showInput} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "center", alignItems: "center", padding: 24 }}>
          <TextInput
            autoFocus
            style={{ color: "#fff", fontSize: 26, fontWeight: "bold", width: "100%", textAlign: "center", minHeight: 60 }}
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
