import { API_BASE_URL } from "@/constants/api";
import { Share } from "react-native";

const shareUser = async (userId: string) => {
  await Share.share({
    url: `${API_BASE_URL}/share/user/${userId}`,
  });
};

const sharePost = async (postId: string) => {
  await Share.share({
    url: `${API_BASE_URL}/share/post/${postId}`,
  });
};

const shareCat = async (catId: string) => {
  await Share.share({
    url: `${API_BASE_URL}/share/cat/${catId}`,
  });
};

export { shareCat, sharePost, shareUser };
