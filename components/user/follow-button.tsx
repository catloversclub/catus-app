import Button, { ButtonType } from "@/components/common/button";
import { useUserFollowToggle } from "@/hooks/user/use-user-follow-toggle";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  size?: "sm" | "md";
  onUnfollowStart?: () => void;
  className?: string;
}

const SIZE_CLASS = {
  sm: "h-[34px] w-[68px]",
  md: "h-10 w-[86px]",
} as const;

const FollowButton = ({
  userId,
  isFollowing,
  size = "sm",
  onUnfollowStart,
  className,
}: FollowButtonProps) => {
  const { toggleFollow, isPending } = useUserFollowToggle({
    userId,
    isFollowing,
    onUnfollowStart,
  });

  const button: ButtonType = {
    label: isFollowing ? "팔로잉" : "팔로우",
    onPress: toggleFollow,
    variant: isFollowing ? "secondary" : "primary",
    size: "md",
    isPending,
  };

  return (
    <Button
      button={button}
      className={cn("rounded-[4px] py-0", SIZE_CLASS[size], className)}
      textClassName={size === "sm" ? "typo-body4" : undefined}
    />
  );
};

export default FollowButton;
