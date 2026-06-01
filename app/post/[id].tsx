import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { usePostByIdQuery } from "@/api/domains/post/queries";

import { useColors } from "@/hooks/use-colors";
import { MoreSheet } from "@/components/bottom-sheet/more-sheet";
import CommentList from "@/components/feed/CommentList";
import { FeedCard } from "@/components/feed/FeedCard";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface PostDetailContentProps {
  postId: string;
  MoreSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

const PostDetailContent = ({
  postId,
  MoreSheetModalRef,
}: PostDetailContentProps) => {
  const { colors } = useColors();
  const { data: post, refetch } = usePostByIdQuery(postId);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const authorNickname = post.author.nickname;

  return (
    <>
      <Stack.Screen
        options={{
          title: `${authorNickname}의 게시물`,
          headerTintColor: colors.text.primary,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingBottom: 40,
          rowGap: 24, // 또는 gap: 24
        }}
      >
        <FeedCard post={post} isDetail />
        <CommentList postId={post.id} />
      </ScrollView>
    </>
  );
}

// 💡 3. 최상위 컴포넌트 (Suspense로 로딩 상태 처리)
const PostDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const MoreSheetModalRef = useRef<BottomSheetModal>(null);

  return (
    <View className="bg-semantic-bg-primary">
      <Suspense
        fallback={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#000" />
          </View>
        }
      >
        <PostDetailContent postId={id} MoreSheetModalRef={MoreSheetModalRef} />
      </Suspense>
      <MoreSheet MoreSheetModalRef={MoreSheetModalRef} />
    </View>
  );
}

export default PostDetailScreen;
