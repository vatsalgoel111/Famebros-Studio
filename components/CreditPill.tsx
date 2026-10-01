import React from 'react';
import { cn } from '@/lib/utils';

export interface CreditPillProps {
  handle?: string;
  role?: 'managed' | 'made';
  compact?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CreditPill({
  handle,
  role = 'managed',
  compact = false,
  size = 'md',
  className,
}: CreditPillProps) {
  if (compact) {
    return (
      <span
        data-pill="true"
        className={cn(
          'inline-flex items-center gap-1 rounded-full bg-signal px-2 py-0.5 text-[11px] font-semibold leading-none text-ink select-none tracking-tight shadow-none border-none shrink-0',
          className
        )}
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-ink shrink-0"
          aria-hidden="true"
        />
        <span>Famebros</span>
      </span>
    );
  }

  const prefix = role === 'made' ? 'Made by' : 'Managed by';
  const displayText = handle
    ? `${prefix} @${handle.replace(/^@/, '')}`
    : role === 'made'
      ? 'Made by Famebros'
      : 'Managed by Famebros';

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[11px] font-semibold',
    md: 'px-3 py-1 text-[12px] font-semibold',
    lg: 'px-5 py-2 sm:px-6 sm:py-2.5 text-[17px] sm:text-[18px] font-bold tracking-tight',
  };

  return (
    <span
      data-pill="true"
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-signal leading-none text-ink select-none shadow-none border-none',
        sizeClasses[size],
        className
      )}
    >
      {displayText}
    </span>
  );
}
