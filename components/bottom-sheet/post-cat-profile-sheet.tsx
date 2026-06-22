import { Cat } from "@/api/domains/post/types";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import CatProfileImage from "@/components/cat/profile-image";
import ActionPressable from "@/components/common/action-pressable";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

interface PostCatProfileSheetProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  cats: Cat[];
}

const PostCatProfileSheet = ({ sheetRef, cats }: PostCatProfileSheetProps) => {
  const router = useRouter();

  const handleCatPress = (catId: string) => {
    sheetRef.current?.dismiss();
    router.push(`/cat/${catId}`);
  };

  return (
    <BaseBottomSheet BaseBottomSheetModalRef={sheetRef}>
      <View className="pb-12 pt-2">
        {cats.map((cat) => (
          <ActionPressable
            key={cat.id}
            onPress={() => handleCatPress(cat.id)}
            className="flex-row items-center gap-3 rounded px-1 py-3"
          >
            <CatProfileImage
              imageUrl={cat.profileImageUrl}
              size="base"
              isPreviewDisabled
            />
            <Text className="typo-body2 text-semantic-text-primary">
              {cat.name}
            </Text>
          </ActionPressable>
        ))}
      </View>
    </BaseBottomSheet>
  );
};

export default PostCatProfileSheet;
