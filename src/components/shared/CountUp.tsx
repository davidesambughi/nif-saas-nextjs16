"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  to: number;
  suffix?: string;
  decimals?: number;
  separator?: boolean;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function CountUp({
  to,
  suffix = "",
  decimals = 0,
  separator = false,
  duration = 1.6,
  className,
  style,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = eased * to;
      setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView, to, duration, decimals]);

  const display = separator
    ? count.toLocaleString("en-US", { maximumFractionDigits: decimals })
    : decimals > 0
    ? count.toFixed(decimals)
    : String(count);

  return (
    <span ref={ref} className={className} style={style}>
      {display}{suffix}
    </span>
  );
}
