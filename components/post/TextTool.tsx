import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import IconButton from "@/components/common/icon-button";
import { DARK } from "@/constants/editor-dark";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";

interface TextEntry {
  id: number;
  content: string;
  color: string;
}

function TextItem({ entry }: { entry: TextEntry }) {
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

export default function TextTool({ uri, onSave, onCancel }: TextToolProps) {
  const { top, bottom } = useSafeAreaInsets();
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
    <View style={{ flex: 1, backgroundColor: DARK.bg, paddingTop: top }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", height: 52, paddingHorizontal: 12 }}>
        <IconButton onPress={onCancel} className="p-3">
          <ArrowLeftIcon width={20} height={20} color={DARK.text} />
        </IconButton>
        <Text style={{ flex: 1, textAlign: "center", color: DARK.text, fontSize: 16, fontWeight: "600", letterSpacing: -0.32, marginRight: 44 }}>
          텍스트 입력
        </Text>
      </View>

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
      <View style={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: Math.max(bottom, 12) + 12, gap: 24, alignItems: "center" }}>
        {/* Controls row */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          {/* Undo */}
          <TouchableOpacity
            onPress={handleUndo}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: DARK.bgSecondary, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: texts.length > 0 ? DARK.text : "#555", fontSize: 18 }}>↩</Text>
          </TouchableOpacity>
          {/* Add text */}
          <TouchableOpacity
            onPress={() => setShowInput(true)}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: DARK.bgSecondary, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: DARK.text, fontSize: 14, fontWeight: "700" }}>T</Text>
          </TouchableOpacity>
        </View>

        {/* 완료 */}
        <TouchableOpacity
          onPress={handleComplete}
          style={{ backgroundColor: DARK.yellow, borderRadius: 4, height: 50, alignItems: "center", justifyContent: "center", width: "100%" }}
        >
          <Text style={{ color: DARK.yellowText, fontSize: 16, fontWeight: "600", letterSpacing: -0.32 }}>
            완료
          </Text>
        </TouchableOpacity>
      </View>

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
            style={{ marginTop: 24, backgroundColor: DARK.yellow, paddingHorizontal: 40, paddingVertical: 12, borderRadius: 100 }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16, color: DARK.yellowText }}>확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
