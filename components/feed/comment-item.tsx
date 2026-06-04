import {
  useLikeCommentMutation,
  useUnlikeCommentMutation,
} from "@/api/domains/comment/queries";
import { Comment } from "@/api/domains/comment/types";
import { ReplyTarget } from "@/components/feed/comment-input-bar";
import { UserPostProfileInfo } from "@/components/feed/post-profile-info";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Heart } from "@/lib/icons";
import { useState } from "react";
import { Pressable, View } from "react-native";

const ReplyItem = ({ reply }: { reply: Comment }) => (
  <View className="px-3 pt-3 pb-2 pl-12">
    <UserPostProfileInfo
      imageUrl={reply.author.profileImageUrl}
      userId={reply.author.id}
      name={reply.author.nickname}
      subtitle={formatRelativeTime(reply.createdAt)}
    />
    <Text className="typo-body4 text-semantic-text-primary mt-1 pl-12">
      {reply.content}
    </Text>
  </View>
);

type CommentItemProps = {
  comment: Comment;
  postId: string;
  onReply?: (target: ReplyTarget) => void;
};

const CommentItem = ({ comment, postId, onReply }: CommentItemProps) => {
  const [expandedValue, setExpandedValue] = useState<string>("");
  const isExpanded = expandedValue === "replies";

  const { id, author, content, isLikedByMe, likeCount, createdAt, replies } =
    comment;

  const { mutate: likeComment } = useLikeCommentMutation();
  const { mutate: unlikeComment } = useUnlikeCommentMutation();

  const handleLike = () => {
    if (isLikedByMe) {
      unlikeComment({ postId, commentId: id });
    } else {
      likeComment({ postId, commentId: id });
    }
  };

  const handleReply = () => {
    onReply?.({ id, nickname: author.nickname });
  };

  return (
    <View className="flex-col">
      <View className="flex-row items-start justify-between p-3 pb-1">
        <UserPostProfileInfo
          imageUrl={author.profileImageUrl}
          userId={author.id}
          name={author.nickname}
          subtitle={formatRelativeTime(createdAt)}
        />
        <Pressable
          onPress={handleLike}
          className="items-center gap-0.5 active:opacity-60"
        >
          <Heart
            size={14}
            className={
              isLikedByMe
                ? "fill-semantic-icon-error text-semantic-icon-error"
                : "text-semantic-text-tertiary"
            }
          />
          {likeCount > 0 && (
            <Text className="typo-label1 text-semantic-text-tertiary">
              {likeCount}
            </Text>
          )}
        </Pressable>
      </View>

      <View className="px-3 pb-3 pl-[60px]">
        <Text className="typo-body4 text-semantic-text-primary">{content}</Text>
        <Pressable onPress={handleReply} className="mt-1.5 active:opacity-60">
          <Text className="typo-label1 text-semantic-text-tertiary">답글</Text>
        </Pressable>
      </View>

      {replies && replies.length > 0 ? (
        <Accordion
          type="single"
          collapsible
          value={expandedValue}
          onValueChange={(value: string | undefined) =>
            setExpandedValue(value ?? "")
          }
        >
          <AccordionItem value="replies">
            <AccordionTrigger
              className={cn(
                "flex-row items-center justify-start gap-1.5 py-2 pl-12",
                isExpanded && "hidden",
              )}
            >
              <View className="h-[1px] w-4 bg-semantic-border-primary" />
              <Text className="typo-label1 text-semantic-text-tertiary">
                답글 {replies.length}개 더 보기...
              </Text>
            </AccordionTrigger>

            <AccordionContent>
              <View className="bg-semantic-bg-secondary pb-2">
                {replies.map((reply) => (
                  <ReplyItem key={reply.id} reply={reply} />
                ))}

                <Pressable
                  className="flex-row items-center gap-1.5 pb-4 pl-12 pt-2 active:opacity-60"
                  onPress={() => setExpandedValue("")}
                >
                  <View className="h-[1px] w-4 bg-semantic-border-primary" />
                  <Text className="typo-label1 text-semantic-text-tertiary">
                    답글 닫기
                  </Text>
                </Pressable>
              </View>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <View className="h-5" />
      )}
    </View>
  );
};

export default CommentItem;
