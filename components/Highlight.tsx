import React from 'react';
import { cn } from '@/lib/utils';

export interface HighlightProps {
  children: React.ReactNode;
  animate?: boolean;
  className?: string;
}

export default function Highlight({
  children,
  animate = false,
  className,
}: HighlightProps) {
  return (
    <mark
      className={cn(
        'font-inherit font-semibold text-ink px-1.5 py-0.5',
        animate
          ? 'highlight-animated inline-block isolate z-0'
          : 'inline bg-signal',
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </mark>
  );
}
