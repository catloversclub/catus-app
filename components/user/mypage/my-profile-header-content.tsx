import { useMyPostsQuery } from "@/api/domains/post/queries";
import { useUserProfileQuery } from "@/api/domains/user/queries";
import MyCatListSection from "@/components/user/mypage/my-cat-list-section";
import ProfileActions from "@/components/user/mypage/my-profile-actions";
import { UserProfileHeader } from "@/components/user/profile/profile-header";
import { View } from "react-native";

const MyProfileHeaderContent = () => {
  const { data: userData } = useUserProfileQuery();
  const { data: myPostsData } = useMyPostsQuery();
  const postCount = myPostsData.pages.flat().length;

  return (
    <>
      <UserProfileHeader
        imageUrl={userData.profileImageUrl}
        name={userData.nickname}
        subtitle={userData.isLivingWithCat ? "고양이 집사" : "랜선 집사"}
        stats={[
          { label: "게시글", value: postCount },
          {
            label: "팔로워",
            value: userData.followerCount,
            href: "/user/follower" as const,
          },
          {
            label: "팔로잉",
            value: userData.followingCount,
            href: "/user/following" as const,
          },
        ]}
        actions={<ProfileActions />}
      />
      <MyCatListSection />
      <View className="h-6" />
    </>
  );
};

export default MyProfileHeaderContent;
