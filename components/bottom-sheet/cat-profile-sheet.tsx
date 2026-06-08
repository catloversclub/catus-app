import { useMyCatsQuery } from "@/api/domains/cat/queries";
import { Cat } from "@/api/domains/cat/types";
import CheckboxFilledIcon from "@/assets/icons/checkbox-filled.svg";
import DefaultAvatarCatIcon from "@/assets/icons/default-avatar-cat.svg";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import Button from "@/components/common/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { RefObject, useEffect, useState } from "react";
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
  return (
    <BaseBottomSheet
      BaseBottomSheetModalRef={bottomSheetRef}
      snapPoints={["50%"]}
    >
      <SuspenseWithDelay fallback={<CatProfileSheetSkeleton />} delay={0}>
        <CatProfileSheetContent
          bottomSheetRef={bottomSheetRef}
          onSelectionChange={onSelectionChange}
        />
      </SuspenseWithDelay>
    </BaseBottomSheet>
  );
};

interface CatProfileSheetContentProps {
  bottomSheetRef: RefObject<BottomSheetModal | null>;
  onSelectionChange: (selectedCats: Pick<Cat, "id" | "name">[]) => void;
}

const CatProfileSheetContent = ({
  bottomSheetRef,
  onSelectionChange,
}: CatProfileSheetContentProps) => {
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
    <BottomSheetView
      style={{ paddingBottom: Math.max(bottom, 12) + 24 }}
      className="flex-1 px-3 gap-[60px]"
    >
      <View>
        {cats.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-semantic-text-tertiary typo-body3">
              등록된 고양이가 없어요.
            </Text>
          </View>
        ) : (
          cats.map((cat, idx) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => toggleCat(cat.id)}
              className={cn(
                "flex-row items-center justify-between gap-1.5 px-3 py-3.5 rounded",
                idx % 2 === 0
                  ? "bg-semantic-bg-secondary"
                  : "bg-semantic-border-primary",
              )}
            >
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-[54px] h-[54px] rounded-full bg-semantic-bg-primary items-center justify-center overflow-hidden">
                  {cat.profileImageUrl ? (
                    <Image
                      source={{ uri: cat.profileImageUrl }}
                      className="w-full h-full"
                      contentFit="cover"
                    />
                  ) : (
                    <DefaultAvatarCatIcon width={54} height={54} />
                  )}
                </View>
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

      <Button
        button={{
          label: "확인",
          onPress: () => bottomSheetRef.current?.dismiss(),
          size: "lg",
        }}
      />
    </BottomSheetView>
  );
};

const CatProfileSheetSkeleton = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <BottomSheetView
      style={{ paddingBottom: Math.max(bottom, 12) + 24 }}
      className="flex-1 px-3 gap-[60px]"
    >
      <View>
        {Array.from({ length: 3 }).map((_, idx) => (
          <View
            key={idx}
            className={cn(
              "flex-row items-center justify-between gap-1.5 px-3 py-3.5 rounded",
              idx % 2 === 0
                ? "bg-semantic-bg-secondary"
                : "bg-semantic-border-primary",
            )}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <Skeleton className="w-[54px] h-[54px] rounded-full bg-semantic-bg-primary" />
              <Skeleton className="w-24 h-5 rounded bg-semantic-bg-primary" />
            </View>
            <Skeleton className="w-5 h-5 rounded-full bg-semantic-bg-primary m-0.5" />
          </View>
        ))}
      </View>

      <Skeleton className="h-[46px] rounded bg-semantic-bg-secondary" />
    </BottomSheetView>
  );
};

export default CatProfileSheet;
