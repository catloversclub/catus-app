import { cn } from "@/lib/utils";
import { Link, type Href } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";

interface ImagePressableProps extends PressableProps {
  children?: ReactNode;
  className?: string;
  href?: Href;
}

const ImagePressable = ({
  children,
  className,
  href,
  ...props
}: ImagePressableProps) => {
  const pressable = (
    <Pressable className={cn(className)} {...props}>
      {children}
    </Pressable>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        {pressable}
      </Link>
    );
  }

  return pressable;
};

export default ImagePressable;
