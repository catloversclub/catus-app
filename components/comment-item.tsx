import { Comment } from "@/api/domains/comment/types";
import { Image } from "expo-image";
import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import HeartFilledIcon from "@/assets/icons/heart-filled.svg";
import HeartOutlineIcon from "@/assets/icons/heart-outline.svg";
import { formatRelativeTime } from "@/lib/utils";

interface CommentItemProps {
  item: Comment;
  onReply?: (id: string, author: string) => void;
  isReply?: boolean;
}

const CommentItem = ({ item, onReply, isReply = false }: CommentItemProps) => {
  return (
    <View className={`flex-row py-2.5 ${isReply ? "ml-11 mt-[-4px]" : ""}`}>
      <Image
        source={
          item.author.profileImageUrl
            ? { uri: item.author.profileImageUrl }
            : require("@/assets/images/default-avatar.png")
        }
        placeholder={require("@/assets/images/default-avatar.png")}
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
        }}
        className="bg-gray-200"
        contentFit="cover"
        cachePolicy="memory-disk"
      />

      <View className="ml-3 flex-1">
        <View className="mb-0.5 flex-row items-center">
          <Text className="mr-2 text-[13px] font-bold text-gray-800">
            {item.author.nickname}
          </Text>
          <Text className="text-[12px] text-gray-400">
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>

        <Text className="text-[14px] leading-5 text-gray-900">
          {item.content}
        </Text>

        <View className="mt-2 flex-row items-center">
          <TouchableOpacity
            onPress={() => onReply?.(item.id, item.author.nickname)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-[12px] font-semibold text-gray-500">
              답글 달기
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="ml-4">
            {item.isLikedByMe ? (
              <HeartFilledIcon width={14} height={14} color="#FF3B30" />
            ) : (
              <HeartOutlineIcon width={14} height={14} color="#999" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(CommentItem);
