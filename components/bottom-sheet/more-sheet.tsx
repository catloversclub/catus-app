import BanIcon from "@/assets/icons/ban.svg";
import BlockIcon from "@/assets/icons/block.svg";
import ShareIcon from "@/assets/icons/share.svg";
import { BaseBottomSheet } from "@/components/bottom-sheet/base-bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface MoreSheetProps {
  MoreSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

const MORE_SHEET_ITEMS = [
  { Icon: BanIcon, label: "신고하기", onPress: () => {} },
  { Icon: BlockIcon, label: "차단하기", onPress: () => {} },
  { Icon: ShareIcon, label: "공유하기", onPress: () => {} },
  { Icon: null, label: "집사 프로필 방문하기", onPress: () => {} },
] as const;

export const MoreSheet = ({ MoreSheetModalRef }: MoreSheetProps) => {
  return (
    <BaseBottomSheet BaseBottomSheetModalRef={MoreSheetModalRef}>
      <View className="flex-1 flex flex-col items-center justify-center pb-16">
        {MORE_SHEET_ITEMS.map(({ Icon, label, onPress }) => (
          <Pressable
            key={label}
            onPress={onPress}
            className="flex-row gap-1.5 py-[14px] items-center justify-center active:opacity-60"
          >
            {Icon && <Icon height={20} width={20} />}
            <Text className="typo-body1 text-semantic-text-primary">
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </BaseBottomSheet>
  );
};
