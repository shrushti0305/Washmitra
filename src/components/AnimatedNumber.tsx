import { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';

interface AnimatedNumberProps {
  value: string;
  className?: string;
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Parse prefix, number, and suffix (e.g. "15,000+", "₹49 Lakh", "70.5%")
    const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1];
    const numericStr = match[2].replace(/,/g, '');
    const suffix = match[3];
    const target = parseFloat(numericStr);

    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }

    const isFloat = numericStr.includes('.');
    const duration = 1600;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      const formattedNum = isFloat
        ? current.toFixed(1)
        : Math.floor(current).toLocaleString();

      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(update);
  }, [isInView, value]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
