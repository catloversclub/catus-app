import { cn } from "@/lib/utils";
import { Link, type Href } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";

interface ActionPressableProps extends PressableProps {
  children?: ReactNode;
  className?: string;
  href?: Href;
}

const ActionPressable = ({
  children,
  className,
  href,
  ...props
}: ActionPressableProps) => {
  const pressable = (
    <Pressable className={cn("active:opacity-60", className)} {...props}>
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

export default ActionPressable;
