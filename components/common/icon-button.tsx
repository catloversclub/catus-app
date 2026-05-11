import { cn } from "@/lib/utils";
import { Pressable, PressableProps } from "react-native";

interface IconButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  /**
   * 터치 인식 영역을 시각적 크기 바깥으로 얼마나 확장할지 (px).
   * 기본 8px → 20×20 아이콘 기준 실 터치 영역 36×36.
   * iOS HIG / Material 권장 최소 터치 타겟(44pt)에 맞추려면 12 이상 권장.
   */
  hitSlop?: number;
  className?: string;
}

/**
 * SVG 아이콘 + Pressable + hitSlop을 한 번에 처리하는 공용 아이콘 버튼.
 *
 * 사용 예:
 *   <IconButton onPress={handleClose} hitSlop={12}>
 *     <XLogo width={20} height={20} color={colors.icon.tertiary} />
 *   </IconButton>
 */
const IconButton = ({
  children,
  hitSlop = 8,
  className,
  ...rest
}: IconButtonProps) => {
  return (
    <Pressable hitSlop={hitSlop} className={cn(className)} {...rest}>
      {children}
    </Pressable>
  );
};

export default IconButton;
