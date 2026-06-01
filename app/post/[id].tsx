import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense, useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { usePostByIdQuery } from "@/api/domains/post/queries";
import { useColors } from "@/hooks/use-colors";
import CommentList from "@/components/feed/comment-list";
import PostDetailCard from "@/components/feed/post-detail-card";

const PostDetailContent = ({ postId }: { postId: string }) => {
  const { colors } = useColors();
  const { data: post, refetch } = usePostByIdQuery(postId);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <>
      <Stack.Screen
        options={{
          title: `${post.author.nickname}의 게시물`,
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
          rowGap: 24,
        }}
      >
        <PostDetailCard post={post} />
        <CommentList postId={post.id} />
      </ScrollView>
    </>
  );
};

const PostDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="bg-semantic-bg-primary">
      <Suspense
        fallback={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        }
      >
        <PostDetailContent postId={id} />
      </Suspense>
    </View>
  );
};

export default PostDetailScreen;
