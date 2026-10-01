'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface RevealProps {
  children: React.ReactNode;
  delay?: number; // Delay in milliseconds
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  className,
}: RevealProps) {
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  const isIn = isReducedMotion || hasIntersected;

  useEffect(() => {
    if (isReducedMotion) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [isReducedMotion]);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: delay > 0 ? `${delay}ms` : undefined,
      }}
      className={cn('reveal', isIn && 'is-in', className)}
    >
      {children}
    </div>
  );
}
