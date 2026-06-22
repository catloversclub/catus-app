import { useUserCatsQuery } from "@/api/domains/cat/queries";
import { Cat } from "@/api/domains/cat/types";
import CheckboxFilledIcon from "@/assets/icons/checkbox-filled.svg";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import CatProfileImage from "@/components/cat/profile-image";
import Button from "@/components/common/button";
import { useColors } from "@/hooks/use-colors";
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { RefObject, useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SelectCatSheetProps {
  bottomSheetRef: RefObject<BottomSheetModal | null>;
  userId: string;
  initialSelectedCatIds?: string[];
  onSelectionChange?: (selectedCats: Pick<Cat, "id" | "name">[]) => void;
  onConfirm?: (catIds: string[]) => void;
}

const SelectCatSheet = ({
  bottomSheetRef,
  userId,
  initialSelectedCatIds = [],
  onSelectionChange,
  onConfirm,
}: SelectCatSheetProps) => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useColors();
  const { data: cats } = useUserCatsQuery(userId);
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>(
    initialSelectedCatIds,
  );

  useEffect(() => {
    setSelectedCatIds(initialSelectedCatIds);
  }, [initialSelectedCatIds]);

  useEffect(() => {
    setSelectedCatIds((prev) => {
      const availableCatIds = new Set(cats.map((cat) => cat.id));
      const next = prev.filter((catId) => availableCatIds.has(catId));
      if (next.length === prev.length) return prev;
      onSelectionChange?.(cats.filter((cat) => next.includes(cat.id)));
      return next;
    });
  }, [cats, onSelectionChange]);

  const handleConfirm = () => {
    onConfirm?.(selectedCatIds);
    bottomSheetRef.current?.dismiss();
  };

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <View
          className="px-4 pt-4 bg-semantic-bg-primary"
          style={{ paddingBottom: bottom + 16 }}
        >
          <Button
            button={{ label: "확인", onPress: handleConfirm, size: "lg" }}
          />
        </View>
      </BottomSheetFooter>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bottom, bottomSheetRef, selectedCatIds],
  );

  const toggleCat = useCallback(
    (catId: string) => {
      setSelectedCatIds((prev) => {
        const next = prev.includes(catId)
          ? prev.filter((id) => id !== catId)
          : [...prev, catId];
        onSelectionChange?.(cats.filter((cat) => next.includes(cat.id)));
        return next;
      });
    },
    [cats, onSelectionChange],
  );

  const renderItem = useCallback(
    ({ item }: { item: Cat }) => (
      <TouchableOpacity
        onPress={() => toggleCat(item.id)}
        className="flex-row items-center justify-between gap-1.5 px-3 py-3.5 rounded"
      >
        <View className="flex-row items-center gap-3 flex-1">
          <CatProfileImage
            imageUrl={item.profileImageUrl}
            size="base"
            isPreviewDisabled
          />
          <Text className="text-semantic-text-secondary text-base font-semibold">
            {item.name}
          </Text>
        </View>
        {selectedCatIds.includes(item.id) ? (
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
    ),
    [toggleCat, selectedCatIds, colors.icon.accent],
  );

  return (
    <BaseBottomSheet
      BaseBottomSheetModalRef={bottomSheetRef}
      snapPoints={["50%", "90%"]}
      footerComponent={renderFooter}
      withContentContainer={false}
    >
      <BottomSheetFlatList
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View className="items-center justify-center py-8">
            <Text className="text-semantic-text-tertiary typo-body3">
              등록된 고양이가 없어요.
            </Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </BaseBottomSheet>
  );
};

export default SelectCatSheet;
