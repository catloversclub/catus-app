import { useMyCatsQuery } from "@/api/domains/cat/queries";
import { Cat } from "@/api/domains/cat/types";
import CheckboxFilledIcon from "@/assets/icons/checkbox-filled.svg";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import CatProfileImage from "@/components/cat/profile-image";
import Button from "@/components/common/button";
import { useColors } from "@/hooks/use-colors";
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { RefObject, useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CatProfileSheetProps {
  bottomSheetRef: RefObject<BottomSheetModal | null>;
  onSelectionChange: (selectedCats: Pick<Cat, "id" | "name">[]) => void;
}

const CatProfileSheet = ({
  bottomSheetRef,
  onSelectionChange,
}: CatProfileSheetProps) => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useColors();
  const { data: cats } = useMyCatsQuery();
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCatIds((prev) => {
      const availableCatIds = new Set(cats.map((cat) => cat.id));
      const next = prev.filter((catId) => availableCatIds.has(catId));

      if (next.length === prev.length) {
        return prev;
      }

      onSelectionChange(cats.filter((cat) => next.includes(cat.id)));
      return next;
    });
  }, [cats, onSelectionChange]);

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={bottom}>
        <View className="pb-4">
          <Button
            button={{
              label: "확인",
              onPress: () => bottomSheetRef.current?.dismiss(),
              size: "lg",
            }}
          />
        </View>
      </BottomSheetFooter>
    ),
    [bottom, bottomSheetRef],
  );

  const toggleCat = (catId: string) => {
    setSelectedCatIds((prev) => {
      const next = prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId];

      onSelectionChange(cats.filter((cat) => next.includes(cat.id)));
      return next;
    });
  };

  return (
    <BaseBottomSheet
      BaseBottomSheetModalRef={bottomSheetRef}
      snapPoints={["50%", "90%"]}
      footerComponent={renderFooter}
    >
      <View>
        <View>
          {cats.length === 0 ? (
            <View className="items-center justify-center py-8">
              <Text className="text-semantic-text-tertiary typo-body3">
                등록된 고양이가 없어요.
              </Text>
            </View>
          ) : (
            cats.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => toggleCat(cat.id)}
                className="flex-row items-center justify-between gap-1.5 px-3 py-3.5 rounded"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <CatProfileImage
                    imageUrl={cat.profileImageUrl}
                    size="base"
                    isPreviewDisabled
                  />
                  <Text className="text-semantic-text-secondary text-base font-semibold">
                    {cat.name}
                  </Text>
                </View>
                {selectedCatIds.includes(cat.id) ? (
                  <CheckboxFilledIcon
                    width={24}
                    height={24}
                    color={colors.icon.accent}
                  />
                ) : (
                  <View
                    className="w-5 h-5 rounded-full m-0.5 border-semantic-border-primary"
                    style={{ borderWidth: 1.5 }}
                  />
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </BaseBottomSheet>
  );
};

export default CatProfileSheet;
