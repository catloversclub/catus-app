import { View, TextInput, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import PagerView from "react-native-pager-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useImageUrisParam } from "@/hooks/use-image-uris-param";

const CreatePostScreen = () => {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const images = useImageUrisParam();
  const pages = images.map((_, index) => index);
  const [content, setContent] = useState("");

  return (
    <KeyboardAwareScrollView>
      <View className="flex-1 bg-white">
        <PagerView
          className="h-[300px] px-3"
          initialPage={0}
          ref={pagerRef}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {images.map((uri, index) => (
            <View
              className="w-full h-full justify-center items-center"
              key={index}
            >
              <Image
                source={{ uri }}
                className="w-full h-[300px]"
                contentFit="contain"
              />
            </View>
          ))}
        </PagerView>
        <View className="mt-[200px] flex-row justify-center items-center">
          {pages.map((pageIndex) => (
            <TouchableOpacity
              key={pageIndex}
              className={`w-2.5 h-2.5 rounded-full mx-1.5 ${
                currentPage === pageIndex
                  ? "bg-gray-700 w-3 h-3"
                  : "bg-gray-300"
              }`}
              onPress={() => pagerRef.current?.setPage(pageIndex)}
            />
          ))}
        </View>
        <View className="p-4 mb-10">
          <TextInput
            placeholder="문구를 작성하세요..."
            placeholderTextColor="#9ca3af"
            value={content}
            onChangeText={setContent}
            multiline
            className="text-base text-black min-h-[120px]"
            textAlignVertical="top"
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default CreatePostScreen;
