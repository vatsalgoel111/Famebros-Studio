import React from 'react';
import { cn } from '@/lib/utils';

export interface ChipProps {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export default function Chip({
  selected = false,
  onClick,
  children,
  className,
  ariaLabel,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-150 select-none cursor-pointer',
        'border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
        selected
          ? 'bg-ink text-paper border-ink'
          : 'bg-paper text-ink border-line hover:border-ink active:bg-paper-dark',
        className
      )}
    >
      {children}
    </button>
  );
}
