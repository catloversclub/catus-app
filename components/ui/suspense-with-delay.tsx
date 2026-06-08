import { ReactNode, Suspense, useEffect, useState } from "react";

interface DelayedFallbackProps {
  children: ReactNode;
  delay: number;
}

const DelayedFallback = ({ children, delay }: DelayedFallbackProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return show ? <>{children}</> : null;
};

interface SuspenseWithDelayProps {
  fallback: ReactNode;
  children: ReactNode;
  delay?: number;
}

const SuspenseWithDelay = ({
  fallback,
  children,
  delay = 300,
}: SuspenseWithDelayProps) => {
  return (
    <Suspense
      fallback={<DelayedFallback delay={delay}>{fallback}</DelayedFallback>}
    >
      {children}
    </Suspense>
  );
};

export { SuspenseWithDelay };
