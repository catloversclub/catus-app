import { WEBVIEW_URL } from "@/constants/api";
import { Share } from "react-native";

const shareUser = async (userId: string, nickname: string) => {
  await Share.share({
    url: `${WEBVIEW_URL}/share/user/${userId}`,
    message: `${nickname}님의 프로필을 확인해보세요!`,
  });
};

const sharePost = async (postId: string, nickname: string) => {
  await Share.share({
    url: `${WEBVIEW_URL}/share/post/${postId}`,
    message: `${nickname}님의 게시물을 확인해보세요!`,
  });
};

export { sharePost, shareUser };
